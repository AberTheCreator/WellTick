import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import { authMiddleware, AuthRequest } from '../../middleware/auth';

const router = express.Router();

router.delete('/:filename', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { filename } = req.params;
    const { type } = req.query;

    if (!type || !['images', 'audio', 'videos'].includes(type as string)) {
      return res.status(400).json({ error: 'Invalid file type specified' });
    }

    const filepath = path.join(__dirname, `../../../uploads/${type}`, filename);

    try {
      await fs.access(filepath);
      await fs.unlink(filepath);
      res.json({ success: true, message: 'File deleted successfully' });
    } catch {
      res.status(404).json({ error: 'File not found' });
    }
  } catch (error) {
    console.error('File deletion error:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

export default router;
