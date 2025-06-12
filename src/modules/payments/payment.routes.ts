import { Router } from 'express';
import * as payments from './payment.controller';

const router = Router();

router.post('/create-first-payment', payments.createFirtPayment);
router.post('/get-cards', payments.getCards);
router.post('/execute-payment', payments.executePayment);

export default router;