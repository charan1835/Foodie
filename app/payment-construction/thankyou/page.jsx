"use client";
import React, { useEffect, useState } from "react";
import Confetti from "react-confetti";

export default function ThankYou() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setDimensions({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 text-center">
      <Confetti width={dimensions.width} height={dimensions.height} />
      <h1 className="text-4xl font-extrabold text-green-500 mb-4">🎉 Order Confirmed!</h1>
      <p className="text-gray-700 text-lg mb-6">
        Thank you for your order! We’re prepping it fresh just for you.
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
