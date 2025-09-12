import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import { authMiddleware, AuthRequest } from '../../middleware/auth';
import { upload, ensureUploadDir } from './utils';

const router = express.Router();

router.post('/', authMiddleware, upload.single('video'), async (req: AuthRequest, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video file provided' });
    }

    const uploadDir = path.join(__dirname, '../../../uploads/videos');
    await ensureUploadDir(uploadDir);

    const filename = `${uuidv4()}.${path.extname(req.file.originalname)}`;
    const filepath = path.join(uploadDir, filename);

    await fs.writeFile(filepath, req.file.buffer);

    const fileUrl = `/uploads/videos/${filename}`;

    res.json({
      success: true,
      url: fileUrl,
      filename,
      size: req.file.size,
      originalName: req.file.originalname,
    });
  } catch (error) {
    console.error('Video upload error:', error);
    res.status(500).json({ error: 'Failed to upload video' });
  }
});

export default router;
