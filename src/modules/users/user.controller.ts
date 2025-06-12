import { Request, Response } from 'express';
import * as userService from '@/modules/users/user.service';



export const create = async (req: Request, res: Response) => {
  const userData = req.body;
  const payment = await userService.createUser(userData);
  res.status(201).json(payment);
};


