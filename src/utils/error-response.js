import { logger } from './logger/logger.js';
export const catchError = (res, code, err) => {
  logger.error(`Dangggg: ${err}`);
  return res.status(500).json({
    statusCode: code,
    message: err,
  });
};
