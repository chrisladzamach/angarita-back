import jwt from 'jsonwebtoken';
import "dotenv"

export const generateToken = (properties: any, key: any, minutes: number) => jwt.sign({
  exp: Math.floor(Date.now() / 1000) + (minutes * 60),
  data: properties}, key
);