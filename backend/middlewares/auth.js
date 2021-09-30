const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError(401)');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const cookie = req.cookies;

  if (!cookie) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  const token = cookie.jwt;
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  req.user = payload;

  next();
};
