import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import { authMiddleware, AuthRequest } from '../../middleware/auth';
import { upload, ensureUploadDir } from './utils';

const router = express.Router();

router.post('/', authMiddleware, upload.single('audio'), async (req: AuthRequest, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    const uploadDir = path.join(__dirname, '../../../uploads/audio');
    await ensureUploadDir(uploadDir);

    const filename = `${uuidv4()}.${path.extname(req.file.originalname)}`;
    const filepath = path.join(uploadDir, filename);

    await fs.writeFile(filepath, req.file.buffer);

    const fileUrl = `/uploads/audio/${filename}`;

    res.json({
      success: true,
      url: fileUrl,
      filename,
      size: req.file.size,
      originalName: req.file.originalname,
      duration: req.body.duration || null,
    });
  } catch (error) {
    console.error('Audio upload error:', error);
    res.status(500).json({ error: 'Failed to upload audio' });
  }
});

export default router;
