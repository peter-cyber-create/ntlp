import React from 'react';

declare global {
  interface Window {
    FlutterwaveCheckout: (config: any) => void;
  }
}

interface InlinePaymentProps {
  amount: number;
  currency: string;
  email: string;
  name: string;
  phone?: string;
  description: string;
  reference: string;
  onSuccess: (response: any) => void;
  onCancel: () => void;
  onError: (error: any) => void;
}

export const InlinePayment: React.FC<InlinePaymentProps> = ({
  amount,
  currency,
  email,
  name,
  phone,
  description,
  reference,
  onSuccess,
  onCancel,
  onError
}) => {
  const handlePayment = () => {
    // Check if Flutterwave script is loaded
    if (typeof window === 'undefined' || !window.FlutterwaveCheckout) {
      onError(new Error('Payment service is not available. Please try again later.'));
      return;
    }

    const config = {
      public_key: process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY || 'FLWPUBK_TEST-2eca8c76cdbd414e8688-X',
      tx_ref: reference,
      amount: amount,
      currency: currency,
      payment_options: currency === 'UGX' ? "card,mobilemoney,ussd,banktransfer" : "card,banktransfer",
      customer: {
        email: email,
        phone_number: phone || '',
        name: name,
      },
      customizations: {
          logo: "",
        },
        title: "NACNDC & JASHConference 2025",
        description: description,
      callback: function (data: any) {
        console.log('Payment completed:', data);
        if (data.status === 'successful') {
          onSuccess(data);
        } else {
          onError(new Error('Payment was not successful'));
        }
      },
      onclose: function () {
        console.log('Payment modal closed');
        onCancel();
      },
    };

    try {
      window.FlutterwaveCheckout(config);
    } catch (error) {
      console.error('Error launching payment:', error);
      onError(error);
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
    >
      Pay Now - {currency === 'UGX' ? `UGX ${amount.toLocaleString()}` : `$${amount}`}
    </button>
  );
};

export default InlinePayment;
