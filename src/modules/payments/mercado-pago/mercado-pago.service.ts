import axios from 'axios';



class MercadoPagoService {
  private apiUrl: string;
  private accessToken: string;

  constructor() {
    this.apiUrl = 'https://api.mercadopago.com';
    this.accessToken = process.env.MP_ACCESS_TOKEN|| '';
    if (!this.accessToken) {
      throw new Error('MP_ACCESS_TOKEN environment variable is not set.');
    }
  }

  // Crear un pago en Mercado Pago
  async createPayment(paymentData: any): Promise<any> {
    try {
      const response = await axios.post(`${this.apiUrl}/checkout/preferences`, {
        items: [
          {
            title: paymentData.title,
            quantity: 1,
            unit_price: paymentData.amount,
          },
        ],
        back_urls: {
          success: paymentData.successUrl,
          failure: paymentData.failureUrl,
          pending: paymentData.pendingUrl,
        },
        payer: {
          name: paymentData.payerName,
          email: paymentData.payerEmail,
        },
      }, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });

      return response.data;
    } catch (error: any) {
      throw new Error('Error al crear el pago en Mercado Pago: ' + error.message);
    }
  }

  // Consultar el estado de un pago en Mercado Pago
  async getPaymentStatus(paymentId: string): Promise<string> {
    try {
      const response = await axios.get(`${this.apiUrl}/v1/payments/${paymentId}`, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });

      return response.data.status;
    } catch (error: any) {
      throw new Error('Error al consultar el estado del pago: ' + error.message);
    }
  }

  // Manejar notificaciones de pagos
  async handlePaymentNotification(notificationData: any): Promise<void> {
    console.log('Notificación de pago recibida:', notificationData);
    // Implementar lógica personalizada aquí
  }
}

export default MercadoPagoService;
