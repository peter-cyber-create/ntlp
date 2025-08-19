// Payment Instructions Page
'use client';

import React from 'react';

export default function PaymentInstructionsPage() {
  return (
    <div className="section-padding bg-yellow-50 min-h-screen flex items-center justify-center">
      <div className="container">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-yellow-300">
            <h2 className="text-2xl font-bold text-yellow-800 mb-4 flex items-center">
              <span className="mr-2">💳</span> Manual Payment Instructions
            </h2>
            <p className="mb-4 text-gray-700">Please make your payment using the following bank details. After payment, email your proof of payment to <b>conference@health.go.ug</b> with your full name and abstract/registration details.</p>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">UGX Account (Local Payments)</h3>
              <ul className="text-gray-700 text-base ml-4">
                <li><b>Beneficiary Customer:</b> MUSPH RESEARCH ACCOUNT</li>
                <li><b>Beneficiary Customer Account Number:</b> 9030008175062</li>
                <li><b>Name of local Bank:</b> Stanbic Bank Uganda Limited</li>
                <li><b>Address:</b> P.O BOX 7131 Kampala</li>
                <li><b>Swift Code:</b> SBICUGKX</li>
                <li><b>IBAN:</b> Not applicable</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Corresponding US Bank Information</h3>
              <ul className="text-gray-700 text-base ml-4">
                <li><b>Name of intermediary Financial Institution in US:</b> Citibank New York</li>
                <li><b>Address:</b> New York, NY</li>
                <li><b>USD Account number:</b> 36110279</li>
                <li><b>SWIFT CODE:</b> CITIUS33</li>
                <li><b>ABA Number:</b> 021000089</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
