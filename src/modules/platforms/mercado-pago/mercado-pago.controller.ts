import express, { Request, Response } from 'express';
import MercadoPagoService from '@/modules/platforms/mercado-pago/mercado-pago.service';
import { PaymentDTO } from '@/modules/payments/payment.dto';
import { CardTokenRequestDTO } from './DTOs/card-token-request.dto';
import { CreatePaymentDTO } from './DTOs/create-payment.dto';

const router = express.Router();
const mercadoPagoService = new MercadoPagoService();

// Ruta para crear un pago en Mercado Pago
router.post('/create', async (req: Request, res: Response) => {
  try {
    const paymentData = new PaymentDTO(
      req.body.title,
      req.body.amount,
      'mercadopago', // Método de pago Mercado Pago
      req.body.successUrl,
      req.body.failureUrl,
      req.body.pendingUrl
    );
    const payment = await mercadoPagoService.createPayment(paymentData);
    res.json({ paymentUrl: payment.init_point }); // URL para redirigir al usuario a la plataforma de pago
  } catch (error: any) {
    res.status(500).json({ message: error });
  }
});

// Ruta para consultar el estado de un pago en Mercado Pago
router.get('/status/:paymentId', async (req: Request, res: Response) => {
  try {
    const paymentStatus = await mercadoPagoService.getPaymentStatus(req.params.paymentId);
    res.json({ status: paymentStatus });
  } catch (error: any) {
    res.status(500).json({ message: error });
  }
});

// Ruta para manejar notificaciones de pagos de Mercado Pago
router.post('/notification', async (req: Request, res: Response) => {
  try {
    await mercadoPagoService.handlePaymentNotification(req.body);
    res.json({ message: 'Notification received' });
  } catch (error: any) {
    res.status(500).json({ message: error });
  }
});

// router.post('/card-token', async (req: Request, res: Response) => {
//   try {
//     const cardData: CardTokenRequestDTO = req.body;
//     const token = await mercadoPagoService.generateCardToken(cardData);
//     res.json({ token });
//   } catch (error: any) {
//     res.status(500).json({ error: error.message });
//   }
// });

// router.post('/generate-payment', async (req: Request, res: Response) => {
//   try {
//     const paymentData: CreatePaymentDTO = req.body;
//     const reponse = await mercadoPagoService.generatePayment(paymentData);
//     res.json({ reponse });
//   } catch (error: any) {
//     res.status(500).json({ error: error.message });
//   }
// });


export default router;
