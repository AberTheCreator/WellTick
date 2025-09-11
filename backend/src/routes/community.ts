import express from 'express';

const router = express.Router();
let posts: any[] = [
  { id: 1, user: 'Alice', text: 'Welcome to the community!', createdAt: new Date() }
];

router.get('/posts', (req, res) => res.json(posts));
router.post('/posts', (req, res) => {
  const { user, text } = req.body;
  const post = { id: posts.length + 1, user, text, createdAt: new Date() };
  posts.push(post);
  res.json(post);
});

export default router;