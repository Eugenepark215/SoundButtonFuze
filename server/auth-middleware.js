const jwt = require('jsonwebtoken');
const ClientError = require('./client-error');

function authorizationMiddleware(req, res, next) {
  const xAccess = req.get('X-Access-Token');
  if (!xAccess) {
    throw new ClientError(401, 'authentication required');
  }
  const payload = jwt.verify(xAccess, process.env.TOKEN_SECRET);
  req.user = payload;
  next();
}

module.exports = authorizationMiddleware;
