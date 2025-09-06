const fs = require("fs");
const path = require("path");

const logFile = path.join(__dirname, "app.log");

function logger(req, res, next) {
  const logEntry = {
    time: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl,
    body: req.body,
    ip: req.ip,
  };
  fs.appendFileSync(logFile, JSON.stringify(logEntry) + "\n");
  next();
}

module.exports = logger;