import jwt from "jsonwebtoken";

export const generateAccessToekn = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_KEY, {
    expiresIn: process.env.ACCESS_TOKEN_TIME,
  });
};

export const generateRefreshToekn = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_KEY, {
    expiresIn: process.env.REFRESH_TOKEN_TIME,
  });
};
