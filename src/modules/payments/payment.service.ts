import PaymentIntegrationService from './payment.integration';
import { PaymentDTO, PaymentStatusDTO } from './DTOs/payment.dto';
import { CardTokenRequestDTO } from '../platforms/mercado-pago/DTOs/card-token-request.dto';
import { CreatePaymentDTO } from '@/modules/platforms/mercado-pago/DTOs/create-payment.dto';
import { CardsRequestDTO } from '../platforms/mercado-pago/DTOs/cardsRequest';
import { ExecutePaymentDto } from './DTOs/executePayment.dto';
type PaymentMethod = 'mercadopago' | 'wom' | 'stripe';
class PaymentService {

  private paymentIntegrationService: PaymentIntegrationService;

  constructor() {
    this.paymentIntegrationService = new PaymentIntegrationService();
  }

  // Crear un pago
  async registerCardAndFirstPayment(paymentData: PaymentDTO): Promise<any> {
    const { method } = paymentData;
    return await this.paymentIntegrationService.registerCardAndFirstPayment(paymentData, method as PaymentMethod);
  }

  // Consultar el estado de un pago
  async getPaymentStatus(paymentStatusData: PaymentStatusDTO): Promise<string> {
    const { paymentId, method } = paymentStatusData;
    return await this.paymentIntegrationService.getPaymentStatus(paymentId, method  as PaymentMethod);
  }

  // Manejar una notificación de pago
  async handlePaymentNotification(notificationData: any, method: string): Promise<any> {
    return await this.paymentIntegrationService.handlePaymentNotification(notificationData, method  as PaymentMethod);
  }

  async generateCardToken(cardData: CardTokenRequestDTO, method: string): Promise<any> {
    return await this.paymentIntegrationService.generateCardToken(cardData, method as PaymentMethod);
  }

    async generatePayment(paymentData: CreatePaymentDTO, method: string): Promise<any> {
    return await this.paymentIntegrationService.generatePayment(paymentData, method as PaymentMethod);
  }

async getCards(data:CardsRequestDTO): Promise<any> {
    return await this.paymentIntegrationService.getCards(data);
  }
async executePayment(data:ExecutePaymentDto): Promise<any> {
    return await this.paymentIntegrationService.executePayment(data);
  }


}

export default PaymentService;
