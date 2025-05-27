import axios from 'axios';
import { CardTokenRequestDTO } from "@/modules/platforms/mercado-pago/DTOs/card-token-request.dto";
import { CreatePaymentDTO } from '@/modules/platforms/mercado-pago/DTOs/create-payment.dto';
import { randomUUID } from 'crypto';
import { CardsRequestDTO } from './DTOs/cardsRequest';
import mercadopago, { MercadoPagoConfig, CustomerCard, Customer, Payment, CardToken } from 'mercadopago';
import { CustomerSearchData, CustomerSearchOptions } from 'mercadopago/dist/clients/customer/search/types';
import { TokenGenerationNoCVVDto } from './DTOs/token-generation-no-CVV.dto';
import { createSubscription, createUser, createUserExternalPlatform } from '@/modules/subscriptions/subscrition.service';
import { PaymentDTO } from '@/modules/payments/DTOs/payment.dto';
import { CreateSubscriptionDto, CreateUserExternalPlatformInterface, CreateUserInterface } from '@/modules/subscriptions/DTO/create-subscription.dto';
import { PaymentAlreadyRegistered } from '@/modules/payments/DTOs/payment-registered-user.dto';
import { getAccessTokenByAppAndPlatform } from '@/modules/credentials/credentials.service';


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
  async registerCardAndFirstPayment(paymentData: PaymentDTO): Promise<any> {
    const client = new MercadoPagoConfig({
      accessToken: paymentData.accessToken,
    });
    const customer = new Customer(client);
    const filter: CustomerSearchData = { options: { email: paymentData.userInfo.email } };

    const customerCard = new CustomerCard(client);

    try {

      const response = await customer.search(filter);
      let customerInfo = response.results?.[0];
      if (!customerInfo) {
        const createCustomerData = {
          body: paymentData.userInfo
        }
        const newCustomer = await customer.create(createCustomerData);
        if (newCustomer) {
          customerInfo = newCustomer;

          // Creacion del usuario dentro de Despues de la creacion del usuario mercado pago
          const createCustomerInfo: CreateUserInterface = {
            email: paymentData.userInfo.email,
            first_name: customerInfo.first_name,
            last_name: customerInfo.last_name,
            phone: customerInfo.phone,
            country_code: 'CL',
            is_active: true,
            created_at: new Date,
          }
          console.log('Cliente creado:', customerInfo.id);
          const userCreated = await createUser(createCustomerInfo);

          // Creacion de user_external_id para identificar de que plataforma llega el usuario.
          const createUserExternal: CreateUserExternalPlatformInterface = {

            user_id: userCreated.id,
            platform_id: 1,
            external_user_id: customerInfo.id,
            platform_name: 'Mercado pago',
            created_at: new Date,
          }
          const externalUserCreated = await createUserExternalPlatform(createUserExternal);


          return newCustomer;
        }

      } else {
        console.log('ℹCliente ya existe:', customerInfo.id);
      }

      if (!customerInfo?.id) {
        throw new Error("No se pudo obtener el ID del cliente");
      }

      if (!paymentData.cardInfo) {
        throw new Error("Token de tarjeta no proporcionado");
      }

      // 3. Almacenar tarjeta asociada al customer_id
      const cardResponse = await customerCard.create({
        customerId: customerInfo.id,
        body: paymentData.cardInfo// Token generado en el frontend
      });
      console.log("💳 Tarjeta almacenada:", cardResponse.id);

      if (cardResponse.id) {

        const currentDate = new Date();
        const nextBillingDate = this.addOneMonth(currentDate);

        // let suscriptionData: CreateSubscriptionDto = {
        //   user_id: 123,
        //   plan_id: 1,
        //   status: 'active',
        //   start_date: currentDate.toISOString(), // ISO string or 'YYYY-MM-DD HH:mm:ss'
        //   next_billing_date: nextBillingDate.toISOString(),
        //   interval: 'monthly'
        // };

        // const result = await createSubscription(suscriptionData);

      }
      return response.results;
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
  async executePayment(data: PaymentAlreadyRegistered): Promise<any> {

    const access_token = await getAccessTokenByAppAndPlatform({
      app_id: data.app_id,
      platform_id: data.platform_id,
      country_code: data.country_code
    }); 

    const client = new MercadoPagoConfig({
      accessToken: access_token.toString(),
    });
    const dataCard: TokenGenerationNoCVVDto = {
      card_id: data.cardInfo.card_id,
      customer_id: data.cardInfo.customer_id,
      security_code: "123"
    };



    const token = await this.generateCardTokenNoCVV(dataCard);

    const payment = new Payment(client);

    const paymentData = {
      transaction_amount:data.productInfo.auto_recurring.transaction_amount, // Amount to be charged
      payment_method_id: data.cardInfo.payment_method_id, // Payment method ID (e.g., 'visa', 'master')
      payer: {
        type: 'customer',
        id: data.cardInfo.customer_id, // must exist in your Mercado Pago account
      },
      token: token.id, // Replace with a valid test card token (see below)
      callback_url: data.productInfo.back_url, // URL to redirect after payment',
      date_of_expiration: data.productInfo.auto_recurring.end_date, // 7 days from May 23, 2025
      description: data.productInfo.reason, // Description of the payment
      differential_pricing_id: undefined, // Set if using differential pricing
      external_reference: data.productInfo.external_reference, // External reference for your records',
      installments: 1,
      notification_url: 'https://your-app.com/webhook'
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
    // const body = {
    //   card_id: "1743519795673",
    //   customer_id: "2362240901-LkCLVlyiGixvC4",
    //   security_code: "123"
    // }

    const body = {
      card_id: data.card_id,
      customer_id: data.customer_id,
      security_code: data.security_code
    };

    const reponse = await cardToken.create({ body: body });
    return reponse;
  }

  addOneMonth(date: Date): Date {
    const result = new Date(date);
    result.setMonth(result.getMonth() + 1);
    return result;
  }



}

export default MercadoPagoService;
