import { PaymentAlreadyRegistered } from '@/modules/payments/DTOs/payment-registered-user.dto';
import { PaymentDTO } from '@/modules/payments/DTOs/payment.dto';
import MercadoPagoService from '@/modules/platforms/mercado-pago/mercado-pago.service';
import { CardTokenRequestDTO } from '../platforms/mercado-pago/DTOs/card-token-request.dto';
import { CardsRequestDTO } from '../platforms/mercado-pago/DTOs/cards -request';
import { CreatePaymentDTO } from '../platforms/mercado-pago/DTOs/mp-create-payment.dto';

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
  async registerCardAndFirstPayment(paymentData: PaymentDTO, method: PaymentMethod): Promise<any> {
    switch (method) {
      case 'mercadopago':
        return await this.mercadoPagoService.registerCardAndFirstPayment(paymentData);
      // case 'wom':
      //   return await this.womService.createPayment(paymentData);
      // case 'stripe':
      //   return await this.stripeService.createPayment(paymentData);
      default:
        throw new Error('Método de pago no soportado');
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

  async generateCardToken(cardData: CardTokenRequestDTO, method: PaymentMethod): Promise<any> {
    switch (method) {
      case 'mercadopago':
        return await this.mercadoPagoService.generateCardToken(cardData);
      // case 'wom':
      //   return await this.womService.generateCardToken(cardData);
      // case 'stripe':
      //   return await this.stripeService.generateCardToken(cardData);
      default:
        throw new Error('Payment method not supported');
    }
  }



  async getCards(data:CardsRequestDTO): Promise<any> {
    switch (data.platformCode) {
      case 'mercadopago':
        return await this.mercadoPagoService.getCards(data);
      // case 'wom':
      //   return await this.womService.getCards(userId);
      // case 'stripe':

      //   return await this.stripeService.getCards(userId);
      default:
        throw new Error('Payment method not supported');
    }
  }
  async executePayment(data:PaymentAlreadyRegistered): Promise<any> {
    switch (data.method) {
      case 'mercadopago':
        return await this.mercadoPagoService.executePayment(data);
      // case 'wom':
      //   return await this.womService.getCards(userId);
      // case 'stripe':

      //   return await this.stripeService.getCards(userId);
      default:
        throw new Error('Payment method not supported');
    }
  }
  



}

export default PaymentIntegrationService;
