import axios from 'axios';
import { CardTokenRequestDTO } from "@/modules/platforms/mercado-pago/DTOs/card-token-request.dto";
import { CreatePaymentDTO } from '@/modules/platforms/mercado-pago/DTOs/create-payment.dto';
import { randomUUID } from 'crypto';
import { CardsRequestDTO } from './DTOs/cardsRequest';
import mercadopago, { MercadoPagoConfig, CustomerCard, Customer } from 'mercadopago';
import { CustomerSearchData, CustomerSearchOptions } from 'mercadopago/dist/clients/customer/search/types';



class MercadoPagoService {
  private apiUrl: string;
  private accessToken: string;

  constructor() {
    this.apiUrl = 'https://api.mercadopago.com';
    this.accessToken = process.env.MP_ACCESS_TOKEN || '';
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

  async generateCardToken(cardData: CardTokenRequestDTO): Promise<string> {
    try {
      const response = await axios.post(`${this.apiUrl}/v1/card_tokens`, cardData, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      // return "hola";
      console.log("response", response.data);
      return response.data.id; // The token ID
    } catch (error: any) {
      throw new Error('Error al generar el token de la tarjeta: ' + error);
    }
  }

  async generatePayment(data: CreatePaymentDTO): Promise<any> {

    const response = await axios.post(`${this.apiUrl}/v1/payments`, data, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': randomUUID(),
      },
    });
    console.log("response", response);
    return response.data;
  }

  async createuser(data: any): Promise<any> {
    return null;
  }

  async saveCard(data: any): Promise<any> {
    return null;
  }

  async getCards(data: CardsRequestDTO): Promise<any> {
    const client = new MercadoPagoConfig({
      accessToken: data.accessToken,
    });
    const customer = new Customer(client);
    const filter: CustomerSearchData = {options: { email: data.email}};
    let customerInfor: any[] = [];
    try {
      const response = await customer.search(filter);
      customerInfor = response.results ?? [];
    } catch (error: any) {
      console.error("error", error);
      return error;
    }
    if (customerInfor && customerInfor.length > 0) {
      return customerInfor[0].cards;
    }
    return customerInfor;
  }


  async generatePaymentToken(data: any): Promise<any> {
    return null;
  }
  async generateRecurrentPayment(data: any): Promise<any> {
    return null;
  }


}

export default MercadoPagoService;
