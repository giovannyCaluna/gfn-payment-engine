import express, { Request, Response } from 'express';
import PaymentService from './payment.service';
import { PaymentDTO } from '@/modules/payments/DTOs/payment.dto';
import { CardsRequestDTO } from '@/modules/platforms/mercado-pago/DTOs/cards -request';
import { PaymentUserAlreadyRegistered } from '@/modules/payments/DTOs/payment-registered-user.dto';
import { CreateTransactionPaymentDTO } from '@/modules/payments/DTOs/create-payment-transaction.dto';

const router = express.Router();
const paymentService = new PaymentService();


// Ruta para crear un pago
router.post('/register', async (req: Request, res: Response) => {
  try {
    const paymentData: PaymentDTO = req.body
    const result = await paymentService.registerCardAndFirstPayment(paymentData);
    res.json({ result: result });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});



// Ruta para manejar notificaciones de pagos
router.post('/notification', async (req: Request, res: Response) => {
  try {
    const result = await paymentService.handlePaymentNotification(req.body, req.body.method);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});



router.post('/get-cards', async (req: Request, res: Response) => {
  try {
    const data: CardsRequestDTO = req.body;
    const result = await paymentService.getCards(data);
    res.json({ result });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
);

router.post('/execute-payment', async (req: Request, res: Response) => {
  try {
    const paymentData: PaymentUserAlreadyRegistered = req.body;
    const token = await paymentService.executePayment(paymentData);
    res.json(token);
  }
  catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
);

router.post('/save-payment-transaction', async (req: Request, res: Response) => {
  try {
    const data: CreateTransactionPaymentDTO = req.body;
    const result = paymentService.savePayment(data);
    res.json({ result });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

);



export default router;