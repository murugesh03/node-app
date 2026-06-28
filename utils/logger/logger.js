const fs = require("fs"); // inbuilt node js
const path = require("path"); //inbuilt in node js
const winston = require("winston");

const logDir = path.join(__dirname, "..", "..", "logs"); //during the complie time it would convert like '../../logs'

// Check whether the logger folder exist or it creates a new folder
//  async and sync
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const RETENTION_DAYS = Number(process.env.LOG_RETENTION_DAYS || 7);
const RETENTION_MS = RETENTION_DAYS * 24 * 60 * 60 * 1000;

function cleanupOldLogs() {
  if (!fs.existsSync(logDir)) return;

  const files = fs.readdirSync(logDir);
  const now = Date.now();

  files.forEach((file) => {
    const filePath = path.join(logDir, file);
    const stat = fs.statSync(filePath);

    if (stat.isFile() && now - stat.mtimeMs > RETENTION_MS) {
      fs.unlinkSync(filePath);
      logger.info(`Deleted old log file: ${file}`);
    }
  });
}

cleanupOldLogs();
setInterval(cleanupOldLogs, 24 * 60 * 60 * 1000);

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
      let output = `[${timestamp}] ${level.toUpperCase()}: ${message}`;

      if (Object.keys(meta).length > 0) {
        output += ` ${JSON.stringify(meta)}`;
      }

      if (stack) {
        output += `\n${stack}`;
      }

      return output;
    })
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.colorize({ all: true })
    }),
    new winston.transports.File({
      filename: path.join(logDir, "app.log"),
      maxsize: 5 * 1024 * 1024,
      maxFiles: 5
    })
  ]
});

logger.stream = {
  write: (message) => logger.info(message.trim())
};

module.exports = logger;
