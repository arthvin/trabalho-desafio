import { Request, Response, NextFunction } from 'express';
import * as bcrypt from 'bcrypt';
const saltRounds = 10;

export async function hashPassword(req: Request, res: Response, next: NextFunction) {
  req.body.password = await bcrypt.hash(req.body.password, saltRounds).then((hash) => hash);
  next();
};