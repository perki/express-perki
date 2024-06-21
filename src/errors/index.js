const expressErrorLogger = require('boiler').getLogger('expressError');

module.exports = {
  expressErrorHandler,
  assertLoggedIn,
  assertValidEmail
};

function expressErrorHandler (err, req, res, next) {
  expressErrorLogger.error(err);
  if (res.headersSent) {
    return next(err);
  }
  const statusCode = err.statusCode || 501;
  res.status(statusCode);
  res.json({ error: err.message });
}

function assertLoggedIn (req) {
  if (req.session?.userId) return;
  const e = new Error('User must be logged in');
  e.statusCode = 401;
  throw e;
}

function assertValidEmail (email) {
  if (email != null && validateEmail(email)) return;
  const e = new Error(`Invalid email "${email}"`);
  e.statusCode = 400;
  throw e;
}

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};
