const router = require('express').Router();

const apiRoutes = require('./api');
const homeRoutes = require('./home-routes.js');
const feedRoutes = require('./feed-routes.js');

router.use('/api', apiRoutes);
router.use('/', homeRoutes);
router.use('/feed',feedRoutes);

router.use((req, res) => {
  res.status(404).end();
});

module.exports = router;