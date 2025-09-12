import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { ensureUploadDir } from '../utils/file';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|mp4|mov|avi|wav|mp3|m4a/;
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedTypes.test(file.mimetype);

    if (mimeType && extName) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images, videos, and audio files are allowed.'));
    }
  },
});


router.post('/image', authMiddleware, upload.single('image'), async (req: AuthRequest, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file provided' });

    const uploadDir = path.join(__dirname, '../../uploads/images');
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


router.post('/audio', authMiddleware, upload.single('audio'), async (req: AuthRequest, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No audio file provided' });

    const uploadDir = path.join(__dirname, '../../uploads/audio');
    await ensureUploadDir(uploadDir);

    const filename = `${uuidv4()}${path.extname(req.file.originalname)}`;
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

router.post('/video', authMiddleware, upload.single('video'), async (req: AuthRequest, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No video file provided' });

    const uploadDir = path.join(__dirname, '../../uploads/videos');
    await ensureUploadDir(uploadDir);

    const filename = `${uuidv4()}${path.extname(req.file.originalname)}`;
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


router.delete('/:filename', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { filename } = req.params;
    const { type } = req.query;

    if (!type || !['images', 'audio', 'videos'].includes(type as string)) {
      return res.status(400).json({ error: 'Invalid file type specified' });
    }

    const filepath = path.join(__dirname, `../../uploads/${type}`, filename);

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
