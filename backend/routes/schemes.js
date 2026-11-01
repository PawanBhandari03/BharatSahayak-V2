const express = require('express');
const router = express.Router();
const schemeStore = require('../services/schemeStore');
const { matchSchemes, aiRecommend } = require('../controllers/schemeController');

// Full scheme list — the single copy of the data for all channels.
router.get('/schemes', (req, res) => {
  const schemes = schemeStore.getAll();
  res.json({ count: schemes.length, schemes });
});

router.get('/schemes/:id', (req, res) => {
  const scheme = schemeStore.getById(req.params.id);
  if (!scheme) return res.status(404).json({ message: 'Scheme not found' });
  res.json(scheme);
});

router.post('/match-schemes', matchSchemes);
router.post('/ai-recommend', aiRecommend);

module.exports = router;
