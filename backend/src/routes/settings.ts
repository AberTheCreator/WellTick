import express from 'express';

const router = express.Router();
let userSettings: any = {
  colorInversion: false,
  fontSize: 'medium'
};

router.get('/', (req, res) => res.json(userSettings));
router.post('/', (req, res) => {
  Object.assign(userSettings, req.body);
  res.json(userSettings);
});

export default router;