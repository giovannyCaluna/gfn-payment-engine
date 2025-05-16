// DTO para crear un pago
class MercadoPagoPaymentDTO {
  title: string;
  amount: number;
  payerName: string;
  payerEmail: string;
  successUrl: string;
  failureUrl: string;
  pendingUrl: string;

  constructor(
    title: string,
    amount: number,
    payerName: string,
    payerEmail: string,
    successUrl: string,
    failureUrl: string,
    pendingUrl: string
  ) {
    this.title = title;
    this.amount = amount;
    this.payerName = payerName;
    this.payerEmail = payerEmail;
    this.successUrl = successUrl;
    this.failureUrl = failureUrl;
    this.pendingUrl = pendingUrl;
  }
}

export { MercadoPagoPaymentDTO };
