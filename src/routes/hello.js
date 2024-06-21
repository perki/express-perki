const router = require('express-promise-router')();

const errors = require('../errors');
const helloMethod = require('../methods/hello.js');

/**
 * Sample GET route
 */
router.get('/hello/', async (req, res) => {
  res.json({ hello: helloMethod() });
});

/**
 * Sample POST route
 */
router.post('/hello/', async (req, res) => {
  res.json({ hello: helloMethod(req.body.from) });
});

/**
 * Sample POST unauthentified error throwing route
 */
router.get('/hello/auth', async (req, res) => {
  errors.assertLoggedIn(req);
});

module.exports = router;
