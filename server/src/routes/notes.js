const router = require('express').Router();
const Note = require('../models/Note');
const USER = 'anonymous';
router.get('/', async (_, res) => res.json(await Note.find({ userId: USER }).sort({ updatedAt: -1 })));
router.post('/', async (req, res) => {
  const note = await Note.create({ userId: USER, ...req.body, updatedAt: new Date() });
  res.status(201).json(note);
});
router.patch('/:id', async (req, res) => {
  const note = await Note.findOneAndUpdate(
    { _id: req.params.id, userId: USER },
    { ...req.body, updatedAt: new Date() },
    { new: true }
  );
  res.json(note);
});
module.exports = router;
