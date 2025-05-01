import express from 'express';
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import { connectDb } from './db/index.js';
import { adminRouter } from './routes/admin.routes.js';
import { logger } from './utils/logger/logger.js';

config();

const PORT = +process.env.PORT;

const app = express();

app.use(express.json());
app.use(cookieParser());

await connectDb();

app.use('/admin', adminRouter);

process.on('uncaughtException', (err) => {
  if (err) {
    console.log(`Uncaught exception: ${err}`);
  }
  process.exit(1);
});

process.on(`unhandledRejection`, (reasion) => {
  console.log(`Unhandled rejection: ${reasion}`);
});

app.use((err, req, res, next) => {
  if (err) {
    return res.status(500).json({
      error: err.message || 'Internal server error',
    });
  } else {
    next();
  }
});

app.listen(PORT, logger.info(`Server started on port ${PORT}`));
