import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();
const users: any[] = [];

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if (users.some(u => u.email === email)) return res.status(400).json({ error: 'Email exists' });
  const hash = await bcrypt.hash(password, 10);
  users.push({ email, password: hash });
  res.json({ success: true });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(400).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ email }, process.env.JWT_SECRET!, { expiresIn: '7d' });
  res.json({ token });
});

export default router;