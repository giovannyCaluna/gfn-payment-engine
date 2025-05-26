import express, { Request, Response } from 'express';
import PaymentService from './payment.service';
import { PaymentDTO, PaymentStatusDTO } from '@/modules/payments/DTOs/payment.dto';
import { CreatePaymentDTO } from '../platforms/mercado-pago/DTOs/create-payment.dto';
import { CardsRequestDTO } from '../platforms/mercado-pago/DTOs/cardsRequest';
import { createSubscription, getAllSubscriptions } from '@/modules/subscriptions/subscrition.service';
import { CreateSubscriptionDto } from './../subscriptions/DTO/create-subscription.dto';
import { ExecutePaymentDto } from './DTOs/executePayment.dto';
import executePayment from './payment.integration';
import { TokenGenerationNoCVVDto } from '../platforms/mercado-pago/DTOs/token-generation-no-CVV.dto';
import { PaymentAlreadyRegistered } from '@/modules/payments/DTOs/payment-registered-user.dto';

const router = express.Router();
const paymentService = new PaymentService();


// Ruta para crear un pago
router.post('/register', async (req: Request, res: Response) => {
  try {
    const paymentData :PaymentDTO = req.body
    console.log('Datos procesados para pago:', paymentData);
    const result = await paymentService.registerCardAndFirstPayment(paymentData);
    res.json({ result: result});
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Ruta para consultar el estado de un pago
router.get('/status/:paymentId', async (req: Request, res: Response) => {
  try {
    const paymentStatusData = req.body;
    const status = await paymentService.getPaymentStatus(paymentStatusData);
    res.json({ status });
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

// Ruta para generar un token de tarjeta
router.post('/card-token', async (req: Request, res: Response) => {
  try {
    console.log("req.body", req.body);
    const cardData = req.body;
    const token = await paymentService.generateCardToken(cardData, "mercadopago");
   res.json({ token });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});
//ruta para hacer un pago

router.post('/generate-payment', async (req: Request, res: Response) => {
  try {
    const paymentData:CreatePaymentDTO = req.body;
    const token = await paymentService.generatePayment(paymentData, "mercadopago");
    res.json({ token });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});



router.post('/get-cards', async (req: Request, res: Response) => {
  try {
    const data:CardsRequestDTO = req.body;
    const result = await paymentService.getCards(data);
    res.json({ result });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
);

router.post('/execute-payment', async (req: Request, res: Response) => {
  try {
    const paymentData: PaymentAlreadyRegistered = req.body;
    const token = await paymentService.executePayment(paymentData);
    console.log("token", token);
    res.json( token );
  }
  catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
);










export default router;
