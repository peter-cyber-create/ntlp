// Payment configuration and utilities for NTLP Conference
import Flutterwave from 'flutterwave-node-v3';
import { v4 as uuidv4 } from 'uuid';
import CryptoJS from 'crypto-js';

// Flutterwave Configuration
const FLW_CLIENT_ID = process.env.FLW_CLIENT_ID || '2eca8c76-cdbd-414e-8688-23baed2f2d24';
const FLW_CLIENT_SECRET = process.env.FLW_CLIENT_SECRET || '07Ul34a76TxNLrdmquZ3qPaJ8g0yJqCs';
const FLW_ENCRYPTION_KEY = process.env.FLW_ENCRYPTION_KEY || 'lHFBFY5RPZLGsk4t7ht9iTnvqxbjD+bbc1BYQxWDWuI=';

// Bank Account Information for Direct Bank Transfers
export const BANK_DETAILS = {
  accountTitle: 'MU SPH Research Account',
  accountNumber: '9030005611449',
  bank: 'Stanbic Bank Uganda Limited',
  address: 'P.O. BOX 7131, KAMPALA UGANDA\nCrested Towers Building, Block D',
  tel: '256 (031) 2224 600',
  branch: 'Corporate Branch',
  swiftCode: 'SBICUGKX',
  correspondingBank: {
    name: 'Citibank New York',
    address: 'New York, NY',
    usdAccountNumber: '36110279',
    swiftCode: 'CITIUS33',
    abaNumber: '021000089'
  }
};

// Initialize Flutterwave
const flw = new Flutterwave(FLW_CLIENT_ID, FLW_CLIENT_SECRET);

// Payment Types
export enum PaymentType {
  REGISTRATION = 'registration',
  SPONSORSHIP = 'sponsorship'
}

// Registration Pricing
export const REGISTRATION_PRICES = {
  undergrad: { amount: 100000, currency: 'UGX', description: 'Undergraduate Student' },
  grad: { amount: 150000, currency: 'UGX', description: 'Graduate Student' },
  local: { amount: 350000, currency: 'UGX', description: 'Local Professional' },
  intl: { amount: 300, currency: 'USD', description: 'International Professional' },
  online: { amount: 50, currency: 'USD', description: 'Virtual Attendance' }
};

// Sponsorship Packages
export const SPONSORSHIP_PACKAGES = {
  bronze: { amount: 2000, currency: 'USD', description: 'Bronze Sponsor' },
  silver: { amount: 5000, currency: 'USD', description: 'Silver Sponsor' },
  gold: { amount: 10000, currency: 'USD', description: 'Gold Sponsor' },
  platinum: { amount: 20000, currency: 'USD', description: 'Platinum Sponsor' },
  diamond: { amount: 50000, currency: 'USD', description: 'Diamond Sponsor' }
};

// Payment Interface
export interface PaymentRequest {
  amount: number;
  currency: string;
  email: string;
  name: string;
  phone?: string;
  description: string;
  paymentType: PaymentType;
  referenceId: string;
  metadata?: Record<string, any>;
  redirectUrl?: string;
}

// Payment Response Interface
export interface PaymentResponse {
  status: 'success' | 'error';
  data?: any;
  message: string;
  paymentUrl?: string;
  reference?: string;
}

// Payment Status Interface
export interface PaymentStatus {
  status: 'pending' | 'successful' | 'failed' | 'cancelled';
  reference: string;
  amount: number;
  currency: string;
  gatewayResponse: any;
}

/**
 * Generate a unique payment reference
 */
export function generatePaymentReference(type: PaymentType, id?: string): string {
  const timestamp = Date.now();
  const uuid = uuidv4().slice(0, 8);
  const prefix = type === PaymentType.REGISTRATION ? 'REG' : 'SPON';
  return `${prefix}_${timestamp}_${uuid}${id ? `_${id}` : ''}`;
}

/**
 * Get pricing information for registration types
 */
export function getRegistrationPrice(registrationType: string) {
  return REGISTRATION_PRICES[registrationType as keyof typeof REGISTRATION_PRICES] || REGISTRATION_PRICES.local;
}

/**
 * Get pricing information for sponsorship packages
 */
export function getSponsorshipPrice(packageType: string) {
  return SPONSORSHIP_PACKAGES[packageType as keyof typeof SPONSORSHIP_PACKAGES] || SPONSORSHIP_PACKAGES.bronze;
}

/**
 * Create a payment link using Flutterwave
 */
export async function createPaymentLink(paymentRequest: PaymentRequest): Promise<PaymentResponse> {
  try {
    const payload = {
      tx_ref: paymentRequest.referenceId,
      amount: paymentRequest.amount,
      currency: paymentRequest.currency,
      redirect_url: paymentRequest.redirectUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/payment/callback`,
      customer: {
        email: paymentRequest.email,
        name: paymentRequest.name,
        phonenumber: paymentRequest.phone || ''
      },
      customizations: {
        title: 'NTLP Conference 2025',
        description: paymentRequest.description,
        logo: `${process.env.NEXT_PUBLIC_BASE_URL}/images/idi-logo.png`
      },
      meta: {
        paymentType: paymentRequest.paymentType,
        referenceId: paymentRequest.referenceId,
        ...paymentRequest.metadata
      }
    };

    const response = await flw.PaymentLink.create(payload);

    if (response.status === 'success') {
      return {
        status: 'success',
        data: response.data,
        message: 'Payment link created successfully',
        paymentUrl: response.data.link,
        reference: paymentRequest.referenceId
      };
    } else {
      return {
        status: 'error',
        message: response.message || 'Failed to create payment link'
      };
    }
  } catch (error: any) {
    console.error('Payment link creation error:', error);
    return {
      status: 'error',
      message: error.message || 'An error occurred while creating payment link'
    };
  }
}

/**
 * Verify payment status
 */
export async function verifyPayment(transactionId: string): Promise<PaymentStatus> {
  try {
    const response = await flw.Transaction.verify({ id: transactionId });
    
    if (response.status === 'success' && response.data) {
      const transaction = response.data;
      return {
        status: transaction.status === 'successful' ? 'successful' : 
                transaction.status === 'failed' ? 'failed' : 'pending',
        reference: transaction.tx_ref,
        amount: transaction.amount,
        currency: transaction.currency,
        gatewayResponse: transaction
      };
    } else {
      return {
        status: 'failed',
        reference: '',
        amount: 0,
        currency: '',
        gatewayResponse: response
      };
    }
  } catch (error: any) {
    console.error('Payment verification error:', error);
    return {
      status: 'failed',
      reference: '',
      amount: 0,
      currency: '',
      gatewayResponse: { error: error.message }
    };
  }
}

/**
 * Create a standard payment for registration
 */
export async function createRegistrationPayment(
  registrationType: string,
  userEmail: string,
  userName: string,
  userPhone: string,
  registrationId?: string
): Promise<PaymentResponse> {
  const pricing = getRegistrationPrice(registrationType);
  const reference = generatePaymentReference(PaymentType.REGISTRATION, registrationId);
  
  return createPaymentLink({
    amount: pricing.amount,
    currency: pricing.currency,
    email: userEmail,
    name: userName,
    phone: userPhone,
    description: `Conference Registration - ${pricing.description}`,
    paymentType: PaymentType.REGISTRATION,
    referenceId: reference,
    metadata: {
      registrationId: registrationId || null,
      registrationType,
      userId: registrationId || null
    }
  });
}

/**
 * Create a sponsorship payment
 */
export async function createSponsorshipPayment(
  packageType: string,
  companyEmail: string,
  companyName: string,
  contactPhone: string,
  sponsorshipId?: string
): Promise<PaymentResponse> {
  const pricing = getSponsorshipPrice(packageType);
  const reference = generatePaymentReference(PaymentType.SPONSORSHIP, sponsorshipId);
  
  return createPaymentLink({
    amount: pricing.amount,
    currency: pricing.currency,
    email: companyEmail,
    name: companyName,
    phone: contactPhone,
    description: `Conference Sponsorship - ${pricing.description}`,
    paymentType: PaymentType.SPONSORSHIP,
    referenceId: reference,
    metadata: {
      sponsorshipId: sponsorshipId || null,
      packageType,
      companyName
    }
  });
}

/**
 * Webhook signature verification
 */
export function verifyWebhookSignature(payload: string, signature: string): boolean {
  try {
    const hash = CryptoJS.HmacSHA256(payload, FLW_CLIENT_SECRET).toString();
    return hash === signature;
  } catch (error) {
    console.error('Webhook signature verification error:', error);
    return false;
  }
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number, currency: string): string {
  if (currency === 'UGX') {
    return `UGX ${amount.toLocaleString()}`;
  } else if (currency === 'USD') {
    return `$${amount.toFixed(2)}`;
  }
  return `${currency} ${amount}`;
}

/**
 * Convert USD to UGX (approximate rate)
 */
export function convertUSDToUGX(usdAmount: number, rate: number = 3700): number {
  return Math.round(usdAmount * rate);
}

/**
 * Get payment methods available for currency
 */
export function getAvailablePaymentMethods(currency: string): string[] {
  if (currency === 'UGX') {
    return ['card', 'mobilemoney', 'banktransfer'];
  } else {
    return ['card', 'banktransfer'];
  }
}

export default {
  createPaymentLink,
  verifyPayment,
  createRegistrationPayment,
  createSponsorshipPayment,
  verifyWebhookSignature,
  formatCurrency,
  convertUSDToUGX,
  getAvailablePaymentMethods,
  generatePaymentReference,
  getRegistrationPrice,
  getSponsorshipPrice,
  BANK_DETAILS,
  REGISTRATION_PRICES,
  SPONSORSHIP_PACKAGES
};
