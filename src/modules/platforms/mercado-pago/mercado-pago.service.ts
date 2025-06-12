import { getAccessTokenByAppAndPlatform } from '@/modules/credentials/credentials.service';
import { PaymentUserAlreadyRegistered } from '@/modules/payments/DTOs/payment-registered-user.dto';
import { PaymentDTO } from '@/modules/payments/DTOs/payment.dto';
import { Customer, CustomerCard, MercadoPagoConfig, Payment } from 'mercadopago';
import { CustomerSearchData } from 'mercadopago/dist/clients/customer/search/types';
import { CardsRequestDTO } from './DTOs/cards -request';
import { TokenGenerationNoCVVDto } from './DTOs/token-generation-no-cvv.dto';
import { MercadoPagoFunctions } from './mercado-pago-functions';
import { PaymentResult } from './mercado-pago.dto';



class MercadoPagoService {

  private mercadoPagoFunctions: MercadoPagoFunctions;

  constructor() {
    this.mercadoPagoFunctions = new MercadoPagoFunctions();

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
      return await this.mercadoPagoFunctions.handleExistingCustomerFlow(
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



  // Manejar notificaciones de pagos
  async handlePaymentNotification(notificationData: any): Promise<void> {
    console.log('Notificación de pago recibida:', notificationData);
    // Implementar lógica personalizada aquí
  }


  async executePayment(data: PaymentUserAlreadyRegistered): Promise<any> {
    const access_token = await getAccessTokenByAppAndPlatform({
      app_id: data.app_id,
      platform_id: data.platform_id,
      country_code: data.country_code,
    });

    const client = new MercadoPagoConfig({
      accessToken: access_token.toString(),
    });


    const dataCard: TokenGenerationNoCVVDto = {
      card_id: data.cardInfo.card_id,
      customer_id: data.cardInfo.customer_id
    };

    const token = await this.mercadoPagoFunctions.generateCardTokenNoCVV(dataCard, client);
    const payment = new Payment(client);
    const paymentData = this.mercadoPagoFunctions.createPaymentRequestBody(data, token.id);
    const paymentResponse = await payment.create({
      body: paymentData,
      requestOptions: { idempotencyKey: `PAY_${Date.now()}` },
    });

    const transaction = this.mercadoPagoFunctions.createTransactionPayment(paymentResponse, data);



    return paymentResponse;


  }

  async getCards(data: CardsRequestDTO) {
    const access_token = await getAccessTokenByAppAndPlatform({
      app_id: data.app_id,
      platform_id: data.platform_id,
      country_code: data.country_code,
    });
    const client = new MercadoPagoConfig({
      accessToken: access_token.toString(),
    });
    return this.mercadoPagoFunctions.getCards(data, client);

  }
  async handleNewCustomerFlow(
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



      // 2. Crear usuario en base de datos local
      const userCreated = await this.mercadoPagoFunctions.createLocalUser(newCustomer, paymentData);
      if (!userCreated?.id) {
        throw new Error('Fallo al crear el usuario en la plataforma local');
      }

      // 3. Registrar tarjeta
      const cardResponse = await this.mercadoPagoFunctions.registerCustomerCard(
        customerCard,
        newCustomer.id,
        paymentData.cardInfo
      );

      paymentData.cardInfo = {
        token: '',
        card_id: cardResponse.id,
        payment_method_id: cardResponse.payment_method.id,
        customer_id: newCustomer.id
      }
      // 4. Crear suscripción
      const subscriptionResult = await this.mercadoPagoFunctions.createSubscription(
        userCreated.id,
        paymentData.productInfo
      );


      // 4. Crear pago
      const paymentResult = await this.mercadoPagoFunctions.createFirtPayment(
        newCustomer.id,
        cardResponse,
        subscriptionResult,
        paymentData
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

}

export default MercadoPagoService;
