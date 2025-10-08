const router = require('express').Router();
const Session = require('../models/Session');
const USER = 'anonymous';
router.post('/', async (req, res) => {
  const session = await Session.create({ userId: USER, ...req.body });
  res.status(201).json(session);
});
router.get('/stats', async (_, res) => {
  const since = new Date(Date.now() - 7*24*60*60*1000);
  const data = await Session.aggregate([
    { $match: { userId: USER, startedAt: { $gte: since } } },
    { $group: { _id: { d: { $dateToString: { format: '%Y-%m-%d', date: '$startedAt' } }, phase: '$phase' }, total: { $sum: '$durationSec' }, count: { $sum: 1 } } },
    { $sort: { '_id.d': 1 } }
  ]);
  res.json(data);
});
module.exports = router;
