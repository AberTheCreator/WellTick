import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { authMiddleware, AuthRequest } from '../../middleware/auth';
import { upload, ensureUploadDir } from './utils';

const router = express.Router();

router.post('/', authMiddleware, upload.single('image'), async (req: AuthRequest, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const uploadDir = path.join(__dirname, '../../../uploads/images');
    await ensureUploadDir(uploadDir);

    const filename = `${uuidv4()}.webp`;
    const filepath = path.join(uploadDir, filename);

    await sharp(req.file.buffer)
      .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(filepath);

    const fileUrl = `/uploads/images/${filename}`;

    res.json({
      success: true,
      url: fileUrl,
      filename,
      size: req.file.size,
      originalName: req.file.originalname,
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

export default router;
