import { createSubscription, getAllSubscriptions } from '@/modules/subscriptions/subscrition.service';
import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/getAllSubscriptions', async (req: Request, res: Response) => {
  try {
    const result = await getAllSubscriptions(req, res);
    res.json({ result });
  }
  catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});


router.post('/create-subscription', async (req: Request, res: Response) => {
  try {
    const result = await createSubscription(req.body);
    res.json({ result });
  }
  catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});




export default router;
