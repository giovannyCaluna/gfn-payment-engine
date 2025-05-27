import axios from 'axios';
import { CardTokenRequestDTO } from "@/modules/platforms/mercado-pago/DTOs/card-token-request.dto";
import { CreatePaymentDTO } from '@/modules/platforms/mercado-pago/DTOs/create-payment.dto';
import { randomUUID } from 'crypto';
import { CardsRequestDTO } from './DTOs/cardsRequest';
import mercadopago, { MercadoPagoConfig, CustomerCard, Customer, Payment, CardToken } from 'mercadopago';
import { CustomerSearchData, CustomerSearchOptions } from 'mercadopago/dist/clients/customer/search/types';
import { TokenGenerationNoCVVDto } from './DTOs/token-generation-no-CVV.dto';
import { createSubscription, createUser, createUserExternalPlatform, obtainSuscriptionPlan } from '@/modules/subscriptions/subscrition.service';
import { PaymentDTO } from '@/modules/payments/DTOs/payment.dto';
import { CreateSubscriptionDto, CreateUserExternalPlatformInterface, CreateUserInterface } from '@/modules/subscriptions/DTO/create-subscription.dto';
import { PaymentAlreadyRegistered } from '@/modules/payments/DTOs/payment-registered-user.dto';
import { PaymentResult } from './mercado-pago.dto';



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
  async registerCardAndFirstPayment(paymentData: PaymentDTO): Promise<PaymentResult> {
    // Validación inicial de datos
    if (!paymentData.accessToken) {
      return {
        success: false,
        message: 'Token de acceso no proporcionado'
      };
    }

    if (!paymentData.userInfo?.email) {
      return {
        success: false,
        message: 'Información del usuario incompleta'
      };
    }

    // Configuración inicial
    const client = new MercadoPagoConfig({
      accessToken: paymentData.accessToken,
      options: { timeout: 5000 } // Timeout para evitar esperas infinitas
    });

    const customer = new Customer(client);
    const customerCard = new CustomerCard(client);
    const filter: CustomerSearchData = { 
      options: { 
        email: paymentData.userInfo.email,
        limit: 1 
      } 
    };

    try {
      // Buscar cliente existente
      const response = await customer.search(filter);
      let customerInfo = response.results?.[0];

      // Flujo para cliente nuevo
      if (!customerInfo) {
        return await this.handleNewCustomerFlow(
          customer,
          customerCard,
          paymentData
        );
      }

      // Flujo para cliente existente
      console.log('ℹ Cliente ya existe en plataforma de pago:', customerInfo.id);
      return await this.handleExistingCustomerFlow(
        customerInfo,
        customerCard,
        paymentData
      );

    } catch (error: any) {
      console.error('Error en el proceso de pago:', {
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      
      return {
        success: false,
        message: 'Error al procesar el pago',
        error: {
          description: error.message,
          cause: error.cause?.[0]?.description || 'Desconocido'
        }
      };
    }
  }

  private async handleNewCustomerFlow(
    customer: Customer,
    customerCard: CustomerCard,
    paymentData: PaymentDTO
  ): Promise<PaymentResult> {
    try {
      // 1. Crear cliente en Mercado Pago
      const newCustomer = await customer.create({
        body: paymentData.userInfo
      });

      if (!newCustomer?.id) {
        throw new Error('Fallo al crear el usuario en la plataforma de pago');
      }

      console.log('Cliente creado:', newCustomer.id);

      // 2. Crear usuario en base de datos local
      const userCreated = await this.createLocalUser(newCustomer, paymentData);
      if (!userCreated?.id) {
        throw new Error('Fallo al crear el usuario en la plataforma local');
      }

      // 3. Registrar tarjeta
      const cardResponse = await this.registerCustomerCard(
        customerCard,
        newCustomer.id,
        paymentData.cardInfo
      );

      // 4. Crear suscripción
      const subscriptionResult = await this.createSubscription(
        userCreated.id,
        paymentData.productInfo
      );

      // 4. Crear pago
      const paymentResult = await this.createSubscription(
        userCreated.id,
        paymentData.productInfo
      );

      return {
        success: true,
        message: 'Pago y registro completados exitosamente',
        data: {
          customer: newCustomer,
          card: cardResponse,
          subscription: subscriptionResult
        }
      };

    } catch (error: any) {
      console.error('Error en flujo de nuevo cliente:', error);
      throw error;
    }
  }

  private async createLocalUser(
    mercadoPagoCustomer: any,
    paymentData: PaymentDTO
  ): Promise<any> {
    const userData: CreateUserInterface = {
      email: paymentData.userInfo.email,
      first_name: mercadoPagoCustomer.first_name,
      last_name: mercadoPagoCustomer.last_name,
      phone: mercadoPagoCustomer.phone || paymentData.userInfo.phone,
      country_code: 'CL',
      is_active: true,
      created_at: new Date()
    };

    const userCreated = await createUser(userData);
    
    // Crear relación de usuario externo
    if (userCreated?.id) {
      await createUserExternalPlatform({
        user_id: userCreated.id,
        platform_id: 1,
        external_user_id: mercadoPagoCustomer.id,
        platform_name: paymentData.method,
        created_at: new Date()
      });
    }

    return userCreated;
  }

  private async registerCustomerCard(
    customerCard: CustomerCard,
    customerId: string,
    cardInfo: any
  ): Promise<any> {
    if (!cardInfo?.token) {
      throw new Error('Token de tarjeta no válido');
    }

    const cardResponse = await customerCard.create({
      customerId,
      body: cardInfo
    });

    if (!cardResponse?.id) {
      throw new Error('Error al guardar la tarjeta de crédito');
    }

    console.log("Tarjeta almacenada:", cardResponse.id);
    return cardResponse;
  }

  private async createSubscription(
    userId: number,
    productInfo: any
  ): Promise<any> {
    const selectedPlan = await obtainSuscriptionPlan(productInfo);
    if (!selectedPlan?.id) {
      throw new Error('Plan de suscripción no válido');
    }

    const currentDate = new Date();
    const nextBillingDate = this.addOneMonth(currentDate);
    const subscriptionData: CreateSubscriptionDto = {
      user_id: userId,
      plan_id: selectedPlan.id,
      start_date: currentDate.toISOString(),
      end_date: nextBillingDate.toISOString(),
      next_billing_date: nextBillingDate.toISOString(),
      amount: selectedPlan.amount,
      interval: selectedPlan.interval,
      created_at: currentDate
    };

    const newSuscription = await createSubscription(subscriptionData);

    if (!newSuscription?.id) {
      throw new Error('Error al crear la suscripcion');
    }
    return newSuscription;
  }


  private async handleExistingCustomerFlow(
    customerInfo: any,
    customerCard: CustomerCard,
    paymentData: PaymentDTO
  ): Promise<PaymentResult> {
    // Implementar lógica para clientes existentes
    // (similar al flujo de nuevo cliente pero sin crear usuario)
    throw new Error('Flujo para cliente existente no implementado');
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
    const client = new MercadoPagoConfig({
      accessToken: this.accessToken,
    });
    const dataCard: TokenGenerationNoCVVDto = {
      card_id: data.cardInfo.card_id,
      customer_id: data.cardInfo.customer_id,
      security_code: "123"
    };



    const token = await this.generateCardTokenNoCVV(dataCard);

    const payment = new Payment(client);

    const paymentData = {
      transaction_amount: data.productInfo.auto_recurring.transaction_amount, // Amount to be charged
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

  private addOneMonth(date: Date): Date {
    const result = new Date(date);
    result.setMonth(result.getMonth() + 1);
    return result;
  }



}

export default MercadoPagoService;
