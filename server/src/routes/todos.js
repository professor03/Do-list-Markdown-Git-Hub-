const router = require('express').Router();
const Todo = require('../models/Todo');
const USER = 'anonymous';

router.get('/', async (_, res) => {
  const items = await Todo.find({ userId: USER }).sort({ order: -1, createdAt: -1 });
  res.json(items);
});
router.post('/', async (req, res) => {
  const { title } = req.body; if (!title) return res.status(400).json({ error: 'title required' });
  const count = await Todo.countDocuments({ userId: USER });
  const todo = await Todo.create({ userId: USER, title, order: count });
  res.status(201).json(todo);
});
router.patch('/:id', async (req, res) => {
  const todo = await Todo.findOneAndUpdate({ _id: req.params.id, userId: USER }, req.body, { new: true });
  if (!todo) return res.status(404).end();
  res.json(todo);
});
router.delete('/:id', async (req, res) => {
  await Todo.deleteOne({ _id: req.params.id, userId: USER });
  res.status(204).end();
});
module.exports = router;
