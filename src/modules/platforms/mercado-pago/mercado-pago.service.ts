import axios from 'axios';
import { CardTokenRequestDTO } from "@/modules/platforms/mercado-pago/DTOs/card-token-request.dto";
import { CreatePaymentDTO } from '@/modules/platforms/mercado-pago/DTOs/create-payment.dto';
import { randomUUID } from 'crypto';
import { CardsRequestDTO } from './DTOs/cardsRequest';
import mercadopago, { MercadoPagoConfig, CustomerCard, Customer, Payment, CardToken } from 'mercadopago';
import { CustomerSearchData, CustomerSearchOptions } from 'mercadopago/dist/clients/customer/search/types';
import { TokenGenerationNoCVVDto } from './DTOs/token-generation-no-CVV.dto';



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
      accessToken: this.accessToken,
    });
    const customer = new Customer(client);
    const filter: CustomerSearchData = { options: { email: data.email } };
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
  async executePayment(data: any): Promise<any> {
    const client = new MercadoPagoConfig({
      accessToken: this.accessToken,
    });

    const token = await this.generateCardTokenNoCVV(data);
    console.log("token", token.id);

    const payment = new Payment(client);

    const paymentData = {
      transaction_amount: 150.00,
      payment_method_id: 'visa',
      payer: {
        type: 'customer',
        id: '2362240901-LkCLVlyiGixvC4', // must exist in your Mercado Pago account
      },
      token: token.id, // Replace with a valid test card token (see below)
      binary_mode: true,
      callback_url: 'https://your-app.com/return',
      campaign_id: undefined, // Set if you have a campaign ID
      capture: true,
      date_of_expiration: '2025-05-30T23:59:59.000Z', // 7 days from May 23, 2025
      description: 'GFN Premium Monthly Subscription',
      differential_pricing_id: undefined, // Set if using differential pricing
      external_reference: 'ORDER_20250523',
      installments: 1,
      metadata: { order_id: 'ORDER_20250523' },
      notification_url: 'https://your-app.com/webhook',
      statement_descriptor: 'GFN Subscription',
      three_d_secure_mode: 'optional',
      forward_data: {},
      sponsor_id: undefined, // Set if using a sponsor
      transaction_details: { financial_institution: undefined },
    };



    const paymentResponse = await payment.create({
      body: paymentData,
      requestOptions: { idempotencyKey: `PAY_${Date.now()}` }, // Unique idempotency key
    });


    console.log("response", paymentResponse);


    return paymentResponse;

  }


  async generateCardTokenNoCVV(data: TokenGenerationNoCVVDto): Promise<any> {
    const client = new MercadoPagoConfig({
      accessToken: this.accessToken,
    });
    const cardToken = new CardToken(client);
    const body = {
      card_id: "1743519795673",
      customer_id: "2362240901-LkCLVlyiGixvC4",
      security_code: "123"
    }

    const reponse = await cardToken.create({ body: body });
    return reponse;
  }




}

export default MercadoPagoService;
