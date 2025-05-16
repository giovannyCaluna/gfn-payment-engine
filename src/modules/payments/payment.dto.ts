// DTO para crear un pago
class PaymentDTO {
  title: string;
  amount: number;
  method: string;
  successUrl: string;
  failureUrl: string;
  pendingUrl: string;

  constructor(
    title: string,
    amount: number,
    method: string,
    successUrl: string,
    failureUrl: string,
    pendingUrl: string
  ) {
    this.title = title;
    this.amount = amount;
    this.method = method;
    this.successUrl = successUrl;
    this.failureUrl = failureUrl;
    this.pendingUrl = pendingUrl;
  }
}

// DTO para el estado del pago
class PaymentStatusDTO {
  paymentId: string;
  method: string;

  constructor(paymentId: string, method: string) {
    this.paymentId = paymentId;
    this.method = method;
  }
}

export { PaymentDTO, PaymentStatusDTO };
