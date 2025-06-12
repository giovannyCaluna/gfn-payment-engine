import express, { Request, Response } from 'express';

import * as subscriptionService from '@/modules/subscriptions/subscription.service';


const router = express.Router();

export const create = async (req: Request, res: Response) => {

   try {
    const result = await subscriptionService.createSubscription(req.body);
    res.json({ result });
  }
  catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAll = async (req: Request, res: Response) => {

     try {
    const result = await subscriptionService.getAllSubscriptions(req, res);
    res.json({ result });
  }
  catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};





export default router;
