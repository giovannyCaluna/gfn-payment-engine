import { getAccessTokenByAppAndPlatform } from '@/modules/credentials/credentials.service';
import { PaymentUserAlreadyRegistered } from '@/modules/payments/DTOs/payment-registered-user.dto';
import { PaymentDTO } from '@/modules/payments/DTOs/payment.dto';
import { PaymentFunctions } from '@/modules/payments/payment.functions';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { CardsRequestDTO } from './DTOs/cards -request';
import { TokenGenerationNoCVVDto } from './DTOs/token-generation-no-cvv.dto';
import { MercadoPagoFunctions } from './mercado-pago-functions';
import { PaymentResult } from './mercado-pago.dto';
import { createLocalUser } from '@/modules/users/user.service'



class MercadoPagoService {

  private mercadoPagoFunctions: MercadoPagoFunctions;
  private paymentFunctions: PaymentFunctions;

  constructor() {
    this.mercadoPagoFunctions = new MercadoPagoFunctions();
    this.paymentFunctions = new PaymentFunctions();

  }

  // Crear un pago en Mercado Pago
  async registerCardAndFirstPayment(paymentData: PaymentDTO): Promise<PaymentResult> {
    // Validación inicial de datos

    const access_token = await getAccessTokenByAppAndPlatform({
      app_id: paymentData.app_id,
      platform_id: paymentData.platform_id,
      country_code: paymentData.country_code,
    });

    if (!access_token) {
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
      accessToken: access_token.toString(),
    });
    try {
      const customerInfo = await this.mercadoPagoFunctions.findMPUserByEmail(paymentData.userInfo.email, client);
      // Flujo para cliente nuevo
      if (!customerInfo) {
        return await this.handleNewCustomerFlow(paymentData, client);
      }

      // Flujo para cliente existente /// Usuario existe pero no tiene tarjetas
      console.log('ℹ Cliente ya existe en plataforma de pago:', customerInfo.id);
      return await this.mercadoPagoFunctions.handleExistingCustomerFlow(customerInfo, paymentData);

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
    console.log("Payment response : ");
    console.log(paymentResponse);
    if (paymentResponse && paymentResponse.id) {
      const transaction = this.mercadoPagoFunctions.createTransactionPayment(paymentResponse, data);
      const savePayment = this.paymentFunctions.savePayment(transaction);

      //crear subscripcion
      //finalizar





    }



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


  async handleNewCustomerFlow(paymentData: PaymentDTO, client: any): Promise<PaymentResult> {
    try {

      // 1. Crear cliente en Mercado Pago
      const newCustomer = await this.mercadoPagoFunctions.creareMPUser(paymentData.userInfo, client);

      if (!newCustomer?.id) {
        throw new Error('Fallo al crear el usuario en la plataforma de pago');
      }

      // 2. Crear usuario en base de datos local
      const userCreated = await createLocalUser(newCustomer, paymentData);

      if (!userCreated || !('id' in userCreated) || !userCreated.id) {
        throw new Error('Fallo al crear el usuario en la plataforma local');
      }

      // 3. Registrar tarjeta en MP
      const cardResponse = await this.mercadoPagoFunctions.registerCustomerCard(
        newCustomer.id,
        paymentData.cardInfo,
        client
      );
      //Actualizamos datos de tarjeta
      paymentData.cardInfo = {
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
      const transaction: PaymentUserAlreadyRegistered = {
        ...paymentData,
        customer_id: newCustomer.id,
      };

      const paymentResult = await this.executePayment(transaction)

      return {
        success: true,
        message: 'Pago y registro completados exitosamente',
        data: {
          customer: newCustomer,
          card: cardResponse,
          subscription: subscriptionResult,
          payment: paymentResult
        }
      };

    } catch (error: any) {
      console.error('Error en flujo de nuevo cliente:', error);
      throw error;
    }
  }

}

export default MercadoPagoService;
