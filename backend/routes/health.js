const express = require('express');
const router = express.Router();

router.get('/jobs', (req, res) => {
  res.json({
    status: 'ok',
    cronJobs: {
      scheduleCron: 'running',
      queueCron: 'running'
    },
    timestamp: new Date()
  });
});

module.exports = router;