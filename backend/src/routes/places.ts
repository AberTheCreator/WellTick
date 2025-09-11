import express from 'express';

const router = express.Router();
let places: any[] = [
  { id: 1, name: 'City Museum', accessible: true, type: 'museum' },
  { id: 2, name: 'Green Park', accessible: false, type: 'park' }
];

router.get('/', (req, res) => res.json(places));
router.post('/', (req, res) => {
  const place = { ...req.body, id: places.length + 1 };
  places.push(place);
  res.json(place);
});

export default router;