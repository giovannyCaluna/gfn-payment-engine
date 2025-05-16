import express, { Request, Response } from 'express';
import PaymentService from './payment.service';
import { PaymentDTO, PaymentStatusDTO } from '@/modules/payments/payment.dto';
import { CreatePaymentDTO } from '../platforms/mercado-pago/DTOs/create-payment.dto';

const router = express.Router();
const paymentService = new PaymentService();

// Ruta para crear un pago
router.post('/create', async (req: Request, res: Response) => {
  try {
    const paymentData = new PaymentDTO(
      req.body.title,
      req.body.amount,
      req.body.method,
      req.body.successUrl,
      req.body.failureUrl,
      req.body.pendingUrl
    );

    const payment = await paymentService.createPayment(paymentData);
    res.json({ paymentUrl: payment.init_point });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Ruta para consultar el estado de un pago
router.get('/status/:paymentId', async (req: Request, res: Response) => {
  try {
    const paymentStatusData = new PaymentStatusDTO(req.params.paymentId, req.body.method);
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


router.get('/payment-platforms', (req: Request, res: Response) => {
  try {
    const platforms = paymentService.getAllPlatforms();
    res.json({ platforms });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});



export default router;
