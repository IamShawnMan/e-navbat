import { model, Schema } from 'mongoose';

const adminSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    hashedPassword: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['admin', 'superadmin'],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Admin = model('Admin', adminSchema);
