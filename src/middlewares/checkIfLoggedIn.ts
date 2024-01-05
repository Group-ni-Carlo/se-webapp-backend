import { Request, Response, NextFunction } from 'express';

import dotenv from 'dotenv';

dotenv.config();

export const checkIfLoggedIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.header('Authorization');
  const token = authHeader?.split(' ')[1];

  if (!token) {
    res.status(401).json({ status: false });
  } else {
    next();
  }
};
