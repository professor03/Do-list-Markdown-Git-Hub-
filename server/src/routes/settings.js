const router = require('express').Router();
const Setting = require('../models/Setting');
const USER = 'anonymous';
router.get('/', async (_, res) => {
  let s = await Setting.findOne({ userId: USER });
  if (!s) s = await Setting.create({ userId: USER });
  res.json(s);
});
router.put('/', async (req, res) => {
  const s = await Setting.findOneAndUpdate({ userId: USER }, req.body, { new: true, upsert: true });
  res.json(s);
});
module.exports = router;
