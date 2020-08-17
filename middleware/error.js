const winston = require("winston");

module.exports = (err, req, res, next) => {
  winston.error(err.message, err);
  // console.log("asd");
  res.status(500).send(err.errmsg);
};
