import express, { Request, Response } from 'express';
import PaymentService from './payment.service';
import { PaymentDTO, PaymentStatusDTO } from '@/modules/payments/DTOs/payment.dto';
import { CreatePaymentDTO } from '@/modules/platforms/mercado-pago/DTOs/mp-create-payment.dto';
import { CardsRequestDTO } from '@/modules/platforms/mercado-pago/DTOs/cards -request';
import { createSubscription, getAllSubscriptions } from '@/modules/subscriptions/subscrition.service';
import { CreateSubscriptionDto } from '@/modules/subscriptions/DTO/create-subscription.dto';
import { ExecutePaymentDto } from '@/modules/payments/DTOs/executePayment.dto';
import executePayment from '@/modules/payments/payment.service';
import { TokenGenerationNoCVVDto } from '@/modules/platforms/mercado-pago/DTOs/token-generation-no-cvv.dto';
import { PaymentAlreadyRegistered } from '@/modules/payments/DTOs/payment-registered-user.dto';
import { CreateTransactionPaymentDTO } from '@/modules/payments/DTOs/create-payment-transaction.dto';
import prisma from 'lib/prisma';
import { Prisma, payments_payment_method } from '@prisma/client';

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
    const paymentData: PaymentAlreadyRegistered = req.body;
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
    const paymentData: CreateTransactionPaymentDTO = req.body;





    const result = await prisma.payments.create({
      data: {
        subscription_id: 1,
        user_id: 1,
        platform_id: 2,
        external_payment_id: "mp-98423849823984",
        amount: new Prisma.Decimal("150"),
        currency: "USD",
        status: "paid", // ✅ correct enum usage
        payment_method: payments_payment_method.credit_card,
        description: "Monthly subscription for GFN Premium",
        invoice_url: "https://example.com/invoices/123456",
        attempted_at: new Date("2025-05-23T12:30:00.000Z"),
        confirmed_at: new Date("2025-05-23T12:31:00.000Z"),
        refunded_at: null,
        failure_reason: null,
        response_data: "{\"payment_id\": \"1234567890\", \"details\": \"Successful transaction\"}"
      }
    });

    res.json({ result });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

);





export default router;
