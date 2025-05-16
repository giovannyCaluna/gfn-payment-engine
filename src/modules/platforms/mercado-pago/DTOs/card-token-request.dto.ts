
export interface CardTokenRequestDTO {
  cardNumber: string;
  expirationMonth: number;
  expirationYear: number;
  securityCode: string;
  cardholder: {
    name: string;
    identification: {
      type:string; 
      number: string;
    };
  };
}
