const cuid = require('cuid');

module.exports = () => (req, res, next) => {
  req.request_id = cuid();
  next();
};
