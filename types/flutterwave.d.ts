declare module 'flutterwave-node-v3' {
  interface FlutterwaveCustomer {
    email: string;
    name: string;
    phonenumber?: string;
  }

  interface FlutterwaveCustomizations {
    title?: string;
    description?: string;
    logo?: string;
  }

  interface FlutterwavePaymentPayload {
    tx_ref: string;
    amount: number;
    currency: string;
    redirect_url?: string;
    customer: FlutterwaveCustomer;
    customizations?: FlutterwaveCustomizations;
    meta?: Record<string, any>;
  }

  interface FlutterwaveResponse {
    status: string;
    message?: string;
    data?: any;
  }

  interface FlutterwaveTransaction {
    id: string;
    tx_ref: string;
    amount: number;
    currency: string;
    status: string;
    [key: string]: any;
  }

  interface FlutterwaveVerifyPayload {
    id: string;
  }

  class PaymentLink {
    static create(payload: FlutterwavePaymentPayload): Promise<FlutterwaveResponse>;
  }

  class Transaction {
    static verify(payload: FlutterwaveVerifyPayload): Promise<FlutterwaveResponse>;
  }

  class Flutterwave {
    PaymentLink: typeof PaymentLink;
    Transaction: typeof Transaction;
    
    constructor(clientId: string, clientSecret: string);
  }

  export = Flutterwave;
}
