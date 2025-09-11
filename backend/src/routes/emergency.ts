import express from 'express';

const router = express.Router();
let contacts: any[] = [
  { id: 1, name: '911', phone: '911' }
];

router.get('/contacts', (req, res) => res.json(contacts));
router.post('/contacts', (req, res) => {
  const { name, phone } = req.body;
  const contact = { id: contacts.length + 1, name, phone };
  contacts.push(contact);
  res.json(contact);
});

export default router;