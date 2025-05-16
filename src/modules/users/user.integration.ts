import MercadoPagoService from '@/modules/platforms/mercado-pago/mercado-pago.service';
import { PaymentDTO } from '@/modules/payments/payment.dto';

import { UserDTO } from './user.dto';
// import WomService from './wo';
// import StripeService from '../stripe/stripe.service';


type platform = 'mercadopago' | 'wom' | 'stripe';

class UserIntegrationService {
  private mercadoPagoService: MercadoPagoService;
  // private womService: WomService;
  // private stripeService: StripeService;

  constructor() {
    this.mercadoPagoService = new MercadoPagoService();
    // this.womService = new WomService();
    // this.stripeService = new StripeService();
  }
  // Crear un pago dependiendo del método de pago elegido
  async createUser(UserDTO: UserDTO, method: platform): Promise<any> {
    switch (method) {
      case 'mercadopago':
        return await this.mercadoPagoService.createPayment(UserDTO);
      // case 'wom':
      //   return await this.womService.createPayment(paymentData);
      // case 'stripe':
      //   return await this.stripeService.createPayment(paymentData);
      default:
        throw new Error('Payment method not supported');
    }
  }
}

export default UserIntegrationService;
