import { payments_payment_method } from '@/modules/payments/DTOs/create-payment-transaction.dto';
import { PaymentUserAlreadyRegistered } from '@/modules/payments/DTOs/payment-registered-user.dto';
import { PaymentDTO } from "@/modules/payments/DTOs/payment.dto";
import { CreateSubscriptionDto } from '@/modules/subscriptions/DTO/create-subscription.dto';
import { createSubscription, obtainSuscriptionPlan } from '@/modules/subscriptions/subscription.service';
import { CardToken } from "mercadopago/dist/clients/cardToken";
import { Customer } from "mercadopago/dist/clients/customer";
import { CustomerSearchData } from "mercadopago/dist/clients/customer/search/types";
import { CustomerCard } from "mercadopago/dist/clients/customerCard";
import { CardsRequestDTO } from "./DTOs/cards -request";
import { CreatePaymentDTO } from './DTOs/mp-create-payment.dto';
import { TokenGenerationNoCVVDto } from "./DTOs/token-generation-no-cvv.dto";
import { PaymentResult } from './mercado-pago.dto';
import { createUser, createUserExternalPlatform } from '@/modules/users/user.service';
import { UserInfoDTO } from '@/modules/users/DTOs/user.dto';



export class MercadoPagoFunctions {

  constructor() { }

  async generateCardTokenNoCVV(data: TokenGenerationNoCVVDto, client: any): Promise<any> {
    const cardToken = new CardToken(client);
    const body = {
      card_id: data.card_id,
      customer_id: data.customer_id,
    };
    const response = await cardToken.create({ body });
    return response;
  }

  async getCards(data: CardsRequestDTO, client: any): Promise<any> {

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

  async findMPUserByEmail(email: string, client: any): Promise<any> {
    const customer = new Customer(client);
    const customerCard = new CustomerCard(client);
    const filter: CustomerSearchData = {
      options: {
        email: email,
        limit: 1
      }
    };
    // Buscar cliente existente
    const response = await customer.search(filter);
    let customerInfo = response.results?.[0];
    return customerInfo;
  }

  async creareMPUser(userInfo: UserInfoDTO, client: any): Promise<any> {
    const customer = new Customer(client);
    const newCustomer = await customer.create({
      body: userInfo
    });
    return newCustomer;
  }



  async registerCustomerCard(
    customerId: string,
    cardInfo: any,
    client: any
  ): Promise<any> {
    if (!cardInfo?.token) {
      throw new Error('Token de tarjeta no válido');
    }
    const customerCard = new CustomerCard(client);
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

  async createSubscription(userId: number, productInfo: any): Promise<any> {

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

  async createFirtPayment(cutomerId: string, cardResponse: any, subscriptionResult: any, paymentData: PaymentDTO): Promise<any> {

    const firstPayment: PaymentUserAlreadyRegistered = {
      app_id: 2,
      method: paymentData.method,
      platform_id: subscriptionResult.plan_id,
      customer_id: cutomerId,
      userInfo: paymentData.userInfo,
      productInfo: paymentData.productInfo,
      cardInfo: paymentData.cardInfo,
      country_code: 'CL'

    };
    console.log(firstPayment);
    // const newSuscription = await this.executePayment(firstPayment);
    const newSuscription = null;

    // if (!newSuscription?.id) {
    //   throw new Error('Error al crear la suscripcion');
    // }
    return newSuscription;
  }


  async handleExistingCustomerFlow(
    customerInfo: any,
    paymentData: PaymentDTO
  ): Promise<PaymentResult> {
    // Implementar lógica para clientes existentes
    // (similar al flujo de nuevo cliente pero sin crear usuario)
    throw new Error('Flujo para cliente existente no implementado');
  }



  private addOneMonth(date: Date): Date {
    const result = new Date(date);
    result.setMonth(result.getMonth() + 1);
    return result;
  }


  createPaymentRequestBody(data: PaymentUserAlreadyRegistered, tokenId: string): CreatePaymentDTO {
    return {
      transaction_amount: Number(data.productInfo.amount), // Convert amount to number
      payment_method_id: data.cardInfo.payment_method_id,
      payer: {
        type: 'customer',
        id: data.cardInfo.customer_id,
      },
      token: tokenId,
      description: 'Descripción de producto',
      external_reference: '123',
      installments: 1,
      notification_url: 'https://your-app.com/webhook',
    };
  }

  createTransactionPayment(paymentResponse: any, data: PaymentUserAlreadyRegistered) {
    return {
      subscription_id: paymentResponse.id ?? 0,
      user_id: 1, // This should be replaced with the actual user ID
      platform_id: data.platform_id,
      external_payment_id: paymentResponse.external_reference,
      amount: paymentResponse.transaction_amount as unknown as string, // Ensure amount is a string
      currency: paymentResponse.currency_id as unknown as string, // Ensure currency is a string
      status: paymentResponse.status as 'pending' | 'paid' | 'failed' | 'refunded' || 'pending', // Default to 'pending'
      payment_method: data.method as payments_payment_method,
      description: paymentResponse.description || 'Pago realizado',
      attempted_at: new Date().toISOString(),
      confirmed_at: paymentResponse.date_approved ? new Date(paymentResponse.date_approved).toISOString() : null,
      refunded_at: null,
      failure_reason: paymentResponse.status_detail || null,
      response_data: JSON.stringify(paymentResponse),

    }
  }

}