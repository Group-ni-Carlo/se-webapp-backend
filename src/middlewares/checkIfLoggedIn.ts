import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const checkIfLoggedIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.header('Authorization');
  const token = authHeader?.split(' ')[1];

  if (!token) {
    res.status(400).json({ status: false });
  } else {
    try {
      jwt.verify(token, `${process.env.CODE}`);
      next();
    } catch (err) {
      console.log(err);
      res.status(400).json({ status: false });
    }
  }
};
