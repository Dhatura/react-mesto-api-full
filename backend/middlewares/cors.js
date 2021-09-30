const allowedCors = [
  'localhost:3000',
  'localhost:3001',
  'https://mesto-datura.students.nomoredomains.icu',
  'http://mesto-datura.students.nomoredomains.icu',
  'https://api.mesto-datura.students.nomoredomains.icu',
  'http://api.mesto-datura.students.nomoredomains.icu',
];

module.exports = ((req, res, next) => {
  const { origin } = req.headers;

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  const { method } = req;
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const requestHeaders = req.headers['access-control-request-headers'];

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }

  return next();
});
