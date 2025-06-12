import express, { Request, Response } from 'express';
import PaymentService from './payment.service';
import { PaymentDTO } from '@/modules/payments/DTOs/payment.dto';
import { CardsRequestDTO } from '@/modules/platforms/mercado-pago/DTOs/cards -request';
import { PaymentUserAlreadyRegistered } from '@/modules/payments/DTOs/payment-registered-user.dto';
import { CreateTransactionPaymentDTO } from '@/modules/payments/DTOs/create-payment-transaction.dto';

const router = express.Router();
const paymentService = new PaymentService();


// Ruta para crear el primer pago
export const createFirtPayment = async (req: Request, res: Response) => {
  try {
    const paymentData: PaymentDTO = req.body
    const result = await paymentService.registerCardAndFirstPayment(paymentData);
    res.json({ result: result });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};






export const getCards = async (req: Request, res: Response) => {
  try {
    const data: CardsRequestDTO = req.body;
    const result = await paymentService.getCards(data);
    res.json({ result });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const executePayment = async (req: Request, res: Response) => {
  try {
    const paymentData: PaymentUserAlreadyRegistered = req.body;
    const token = await paymentService.executePayment(paymentData);
    res.json(token);
  }
  catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const savePaymentTransaction = async (req: Request, res: Response) => {
  try {
    const data: CreateTransactionPaymentDTO = req.body;
    const result = paymentService.savePayment(data);
    res.json({ result });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};




export default router;