// agentos/server/utils/logger.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.AGENTOS_LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'agentos-server' },
  transports: [
    new winston.transports.File({ 
      filename: 'logs/agentos-error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: 'logs/agentos-combined.log' 
    }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

export { logger };