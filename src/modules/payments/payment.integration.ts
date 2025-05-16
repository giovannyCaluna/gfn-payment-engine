import MercadoPagoService from '@/modules/payments/mercado-pago/mercado-pago.service';
import { PaymentDTO } from '@/modules/payments/payment.dto';
// import WomService from './wo';
// import StripeService from '../stripe/stripe.service';


type PaymentMethod = 'mercadopago' | 'wom' | 'stripe';

class PaymentIntegrationService {
  private mercadoPagoService: MercadoPagoService;
  // private womService: WomService;
  // private stripeService: StripeService;

  constructor() {
    this.mercadoPagoService = new MercadoPagoService();
    // this.womService = new WomService();
    // this.stripeService = new StripeService();
  }

  // Crear un pago dependiendo del método de pago elegido
  async createPayment(paymentData: PaymentDTO, method: PaymentMethod): Promise<any> {
    switch (method) {
      case 'mercadopago':
        return await this.mercadoPagoService.createPayment(paymentData);
      // case 'wom':
      //   return await this.womService.createPayment(paymentData);
      // case 'stripe':
      //   return await this.stripeService.createPayment(paymentData);
      default:
        throw new Error('Payment method not supported');
    }
  }

  // Consultar el estado de un pago
  async getPaymentStatus(paymentId: string, method: PaymentMethod): Promise<string> {
    switch (method) {
      case 'mercadopago':
        return await this.mercadoPagoService.getPaymentStatus(paymentId);
      // case 'wom':
      //   return await this.womService.getPaymentStatus(paymentId);
      // case 'stripe':
      //   return await this.stripeService.getPaymentStatus(paymentId);
      default:
        throw new Error('Payment method not supported');
    }
  }

  // Manejar las notificaciones de los pagos
  async handlePaymentNotification(notificationData: any, method: PaymentMethod): Promise<any> {
    switch (method) {
      case 'mercadopago':
        return await this.mercadoPagoService.handlePaymentNotification(notificationData);
      // case 'wom':
      //   return await this.womService.handlePaymentNotification(notificationData);
      // case 'stripe':
      //   return await this.stripeService.handlePaymentNotification(notificationData);
      default:
        throw new Error('Payment method not supported');
    }
  }
}

export default PaymentIntegrationService;
