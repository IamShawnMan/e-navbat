import { connect } from 'mongoose';

export const connectDb = async () => {
  try {
    await connect(process.env.MONGO_URL);
    console.log('Database connected');
  } catch (error) {
    console.log('Database connection failed');
  }
};
