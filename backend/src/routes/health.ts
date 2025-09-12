import express from 'express';
import crypto from 'crypto';
import { HealthRecord, WellnessMetric } from '../database/init';
import { authMiddleware, AuthRequest, optionalAuth } from '../middleware/auth';
import { create as createIPFS } from 'ipfs-http-client';

const router = express.Router();

const ipfs = createIPFS({ 
  host: 'ipfs.infura.io', 
  port: 5001, 
  protocol: 'https',
  headers: {
    authorization: process.env.INFURA_IPFS_PROJECT_ID ? 
      `Basic ${Buffer.from(`${process.env.INFURA_IPFS_PROJECT_ID}:${process.env.INFURA_IPFS_SECRET}`).toString('base64')}` : 
      ''
  }
});

const encryptData = (data: string, key: string): string => {
  const cipher = crypto.createCipher('aes-256-cbc', key);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

const decryptData = (encryptedData: string, key: string): string => {
  const decipher = crypto.createDecipher('aes-256-cbc', key);
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

router.post('/records', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { type, title, description, data, isPrivate = true } = req.body;
    
    if (!type || !title) {
      return res.status(400).json({ error: 'Type and title are required' });
    }

    const validTypes = ['medication', 'condition', 'allergy', 'procedure', 'note'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: 'Invalid record type' });
    }

    let ipfsHash = null;
    let encryptionKey = null;

    if (data && isPrivate) {
      encryptionKey = crypto.randomBytes(32).toString('hex');
      const encryptedData = encryptData(JSON.stringify(data), encryptionKey);
      
      try {
        const result = await ipfs.add(encryptedData);
        ipfsHash = result.path;
      } catch (ipfsError) {
        console.warn('IPFS storage failed, storing locally:', ipfsError);
      }
    }

    const record = await HealthRecord.create({
      userId: req.userId,
      type,
      title,
      description,
      data: !isPrivate ? data : null,
      isPrivate,
      ipfsHash,
      encryptionKey,
    });

    res.status(201).json({
      success: true,
      record: {
        id: record.get('id'),
        type: record.get('type'),
        title: record.get('title'),
        description: record.get('description'),
        data: !isPrivate ? record.get('data') : null,
        isPrivate: record.get('isPrivate'),
        createdAt: record.get('createdAt'),
      },
    });
  } catch (error) {
    console.error('Health record creation error:', error);
    res.status(500).json({ error: 'Failed to create health record' });
  }
});

router.get('/records', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const records = await HealthRecord.findAll({
      where: { userId: req.userId },
      attributes: ['id', 'type', 'title', 'description', 'isPrivate', 'createdAt', 'updatedAt'],
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      records: records.map(record => record.toJSON()),
    });
  } catch (error) {
    console.error('Health records fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch health records' });
  }
});

router.get('/records/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const record = await HealthRecord.findOne({
      where: { 
        id: req.params.id, 
        userId: req.userId 
      },
    });

    if (!record) {
      return res.status(404).json({ error: 'Health record not found' });
    }

    let recordData = record.toJSON();

    if (record.get('isPrivate') && record.get('ipfsHash') && record.get('encryptionKey')) {
      try {
        const chunks = [];
        for await (const chunk of ipfs.cat(record.get('ipfsHash') as string)) {
          chunks.push(chunk);
        }
        const encryptedData = Buffer.concat(chunks).toString();
        const decryptedData = decryptData(encryptedData, record.get('encryptionKey') as string);
        recordData.data = JSON.parse(decryptedData);
      } catch (ipfsError) {
        console.warn('IPFS retrieval failed:', ipfsError);
        recordData.data = null;
      }
    }

    res.json({
      success: true,
      record: recordData,
    });
  } catch (error) {
    console.error('Health record fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch health record' });
  }
});

router.put('/records/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { title, description, data, isPrivate } = req.body;
    
    const record = await HealthRecord.findOne({
      where: { 
        id: req.params.id, 
        userId: req.userId 
      },
    });

    if (!record) {
      return res.status(404).json({ error: 'Health record not found' });
    }

    const updateData: any = {};
    
    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (isPrivate !== undefined) updateData.isPrivate = isPrivate;

    if (data && isPrivate) {
      const encryptionKey = crypto.randomBytes(32).toString('hex');
      const encryptedData = encryptData(JSON.stringify(data), encryptionKey);
      
      try {
        const result = await ipfs.add(encryptedData);
        updateData.ipfsHash = result.path;
        updateData.encryptionKey = encryptionKey;
        updateData.data = null;
      } catch (ipfsError) {
        console.warn('IPFS storage failed:', ipfsError);
        updateData.data = data;
      }
    } else if (data && !isPrivate) {
      updateData.data = data;
      updateData.ipfsHash = null;
      updateData.encryptionKey = null;
    }

    await record.update(updateData);

    res.json({
      success: true,
      message: 'Health record updated successfully',
    });
  } catch (error) {
    console.error('Health record update error:', error);
    res.status(500).json({ error: 'Failed to update health record' });
  }
});

router.delete('/records/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const record = await HealthRecord.findOne({
      where: { 
        id: req.params.id, 
        userId: req.userId 
      },
    });

    if (!record) {
      return res.status(404).json({ error: 'Health record not found' });
    }

    await record.destroy();

    res.json({
      success: true,
      message: 'Health record deleted successfully',
    });
  } catch (error) {
    console.error('Health record deletion error:', error);
    res.status(500).json({ error: 'Failed to delete health record' });
  }
});

router.post('/metrics', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { type, value, notes, recordedAt } = req.body;
    
    if (!type || value === undefined) {
      return res.status(400).json({ error: 'Type and value are required' });
    }

    const validTypes = ['mood', 'pain', 'energy', 'sleep', 'steps', 'heart_rate'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: 'Invalid metric type' });
    }

    const metric = await WellnessMetric.create({
      userId: req.userId,
      type,
      value: parseFloat(value),
      notes,
      recordedAt: recordedAt ? new Date(recordedAt) : new Date(),
    });

    res.status(201).json({
      success: true,
      metric: {
        id: metric.get('id'),
        type: metric.get('type'),
        value: metric.get('value'),
        notes: metric.get('notes'),
        recordedAt: metric.get('recordedAt'),
      },
    });
  } catch (error) {
    console.error('Wellness metric creation error:', error);
    res.status(500).json({ error: 'Failed to create wellness metric' });
  }
});

router.get('/metrics', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { type, startDate, endDate, limit = 100 } = req.query;
    
    const whereClause: any = { userId: req.userId };
    
    if (type) whereClause.type = type;
    
    if (startDate || endDate) {
      whereClause.recordedAt = {};
      if (startDate) whereClause.recordedAt.gte = new Date(startDate as string);
      if (endDate) whereClause.recordedAt.lte = new Date(endDate as string);
    }

    const metrics = await WellnessMetric.findAll({
      where: whereClause,
      order: [['recordedAt', 'DESC']],
      limit: parseInt(limit as string),
    });

    res.json({
      success: true,
      metrics: metrics.map(metric => metric.toJSON()),
    });
  } catch (error) {
    console.error('Wellness metrics fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch wellness metrics' });
  }
});

router.get('/analytics', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period as string);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const metrics = await WellnessMetric.findAll({
      where: { 
        userId: req.userId,
        recordedAt: { gte: startDate }
      },
      order: [['recordedAt', 'ASC']],
    });

    const groupedMetrics: { [key: string]: any[] } = {};
    const averages: { [key: string]: number } = {};
    const trends: { [key: string]: 'up' | 'down' | 'stable' } = {};

    metrics.forEach(metric => {
      const type = metric.get('type') as string;
      const value = metric.get('value') as number;
      
      if (!groupedMetrics[type]) {
        groupedMetrics[type] = [];
      }
      
      groupedMetrics[type].push({
        value,
        recordedAt: metric.get('recordedAt'),
      });
    });

    Object.keys(groupedMetrics).forEach(type => {
      const values = groupedMetrics[type].map(m => m.value);
      averages[type] = values.reduce((sum, val) => sum + val, 0) / values.length;
      
      if (values.length >= 2) {
        const firstHalf = values.slice(0, Math.floor(values.length / 2));
        const secondHalf = values.slice(Math.floor(values.length / 2));
        const firstAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;
        
        const difference = secondAvg - firstAvg;
        trends[type] = Math.abs(difference) < 0.1 ? 'stable' : 
                      difference > 0 ? 'up' : 'down';
      } else {
        trends[type] = 'stable';
      }
    });

    res.json({
      success: true,
      analytics: {
        period: days,
        groupedMetrics,
        averages,
        trends,
        totalRecords: metrics.length,
      },
    });
  } catch (error) {
    console.error('Health analytics error:', error);
    res.status(500).json({ error: 'Failed to generate health analytics' });
  }
});

export default router;