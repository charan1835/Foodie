import React from 'react'

export default function PaymentConstructionPage() {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 text-center">
        <h1 className="text-4xl font-extrabold text-yellow-500 mb-4">🚧 Payment Gateway Coming Soon!</h1>
        <p className="text-gray-700 text-lg mb-6">
          Our secure payment gateway is under construction. You'll be able to pay soon with UPI, Cards, and Wallets!
        </p>
        <a
          href="/"
          className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all"
        >
          Back to Home
        </a>
      </div>
    );
  }
  