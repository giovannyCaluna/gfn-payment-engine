import PaymentIntegrationService from './payment.integration';
import { PaymentDto, PaymentStatusDto } from './payment.dto';
type PaymentMethod = 'mercadopago' | 'wom' | 'stripe';
class PaymentService {

  private paymentIntegrationService: PaymentIntegrationService;

  constructor() {
    this.paymentIntegrationService = new PaymentIntegrationService();
  }

  // Crear un pago
  async createPayment(paymentData: PaymentDto): Promise<any> {
    const { method } = paymentData;
    return await this.paymentIntegrationService.createPayment(paymentData, method as PaymentMethod);
  }

  // Consultar el estado de un pago
  async getPaymentStatus(paymentStatusData: PaymentStatusDto): Promise<string> {
    const { paymentId, method } = paymentStatusData;
    return await this.paymentIntegrationService.getPaymentStatus(paymentId, method  as PaymentMethod);
  }

  // Manejar una notificación de pago
  async handlePaymentNotification(notificationData: any, method: string): Promise<any> {
    return await this.paymentIntegrationService.handlePaymentNotification(notificationData, method  as PaymentMethod);
  }
}

export default PaymentService;
