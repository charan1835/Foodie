"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  CreditCard,
  Smartphone,
  Wallet,
  Banknote,
  ArrowLeft,
  Shield,
  CheckCircle,
  Clock,
  MapPin,
} from "lucide-react";
import GlobalApi from "@/_utils/GlobelApi";

export default function PaymentConstructionPage() {
  const { user } = useUser();
  const router = useRouter();
  const [orderData, setOrderData] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedOrderData = sessionStorage.getItem("orderData");
    if (storedOrderData) {
      setOrderData(JSON.parse(storedOrderData));
    } else {
      router.push("/cart");
    }
  }, [router]);

  const paymentMethods = [
    {
      id: "card",
      name: "Credit/Debit Card",
      icon: CreditCard,
      description: "Visa, Mastercard, RuPay",
      status: "online",
    },
    {
      id: "upi",
      name: "UPI Payment",
      icon: Smartphone,
      description: "PhonePe, Google Pay, Paytm",
      status: "online",
    },
    {
      id: "wallet",
      name: "Digital Wallet",
      icon: Wallet,
      description: "Paytm, Amazon Pay, Mobikwik",
      status: "online",
    },
    {
      id: "cod",
      name: "Cash on Delivery",
      icon: Banknote,
      description: "Pay when your order arrives",
      status: "available",
    },
  ];

  const generateWhatsAppMessage = () => {
    if (!orderData) return "";

    const {
      itemCount,
      subtotal,
      gstAmount,
      deliveryCharge,
      totalAmount,
      appliedCoupon,
      couponDiscount,
      items,
    } = orderData;

    const itemLines = items
      ?.map((item, index) => `${index + 1}. ${item.name} - ₹${item.price}`)
      .join("%0A") || "No items listed";

    const message =
      `📦 *New COD Order!*%0A%0A` +
      `👤 *User*: ${user?.primaryEmailAddress?.emailAddress || "Guest"}%0A` +
      `🛍️ *Items (${itemCount}):*%0A${itemLines}%0A%0A` +
      `💰 *Subtotal*: ₹${subtotal.toFixed(2)}%0A` +
      `🧾 *GST (12%)*: ₹${gstAmount.toFixed(2)}%0A` +
      `🚚 *Delivery Fee*: ₹${deliveryCharge.toFixed(2)}%0A` +
      (appliedCoupon
        ? `🏷️ *Coupon*: -₹${couponDiscount.toFixed(2)}%0A`
        : "") +
      `🔐 *Total*: ₹${totalAmount.toFixed(2)}%0A%0A` +
      `✅ *Payment*: Cash on Delivery`;

    return `https://wa.me/918688605760?text=${encodeURI(message)}`;
  };

  const handlePaymentSelect = async (method) => {
    setSelectedPayment(method.id);
    setLoading(true);

    try {
      if (method.status === "online") {
        toast.error(`${method.name} is currently unavailable.`);
        setSelectedPayment("");
        setLoading(false);
        return;
      }

      if (method.id === "cod") {
        toast.success("Order placed successfully! 🎉");

        // Clear cart from Hygraph
        const userEmail = user.primaryEmailAddress.emailAddress;
        const cartRes = await GlobalApi.GetUserCart(userEmail);
        const userCart = cartRes?.userCarts || [];

        for (let item of userCart) {
          await GlobalApi.deleteCartItem(item.id);
        }

        // 🔥 Send order summary to WhatsApp
        const waLink = generateWhatsAppMessage();
        window.open(waLink, "_blank");

        sessionStorage.removeItem("orderData");

        setTimeout(() => {
          router.push("/payment-construction/thankyou");
        }, 1500);
      }
    } catch (err) {
      toast.error("Something went wrong!");
      console.error("Payment error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-md mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600">Loading payment options...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-md mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Payment Options</h1>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <CheckCircle size={18} className="text-green-500" />
            Order Summary
          </h2>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Items ({orderData.itemCount})</span>
              <span>₹{orderData.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">GST (12%)</span>
              <span>₹{orderData.gstAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery Fee</span>
              <span>₹{orderData.deliveryCharge.toFixed(2)}</span>
            </div>
            {orderData.appliedCoupon && (
              <div className="flex justify-between text-green-600">
                <span>Coupon Discount</span>
                <span>-₹{orderData.couponDiscount.toFixed(2)}</span>
              </div>
            )}
            <div className="border-t pt-2 mt-3">
              <div className="flex justify-between font-bold text-lg">
                <span>Total Amount</span>
                <span>₹{orderData.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Info */}
        <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-100">
          <div className="flex items-start gap-3">
            <div className="flex items-center gap-2 text-blue-700">
              <Clock size={16} />
              <MapPin size={16} />
            </div>
            <div>
              <p className="font-medium text-blue-800 text-sm">Estimated Delivery</p>
              <p className="text-blue-600 text-sm">25-30 minutes to your location</p>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-4">
          <h2 className="font-semibold text-gray-800 mb-4">Choose Payment Method</h2>

          {paymentMethods.map((method) => {
            const IconComponent = method.icon;
            const isDisabled = method.status === "online";
            const isSelected = selectedPayment === method.id;

            return (
              <button
                key={method.id}
                onClick={() => !loading && handlePaymentSelect(method)}
                disabled={loading}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                  isSelected
                    ? "border-orange-500 bg-orange-50"
                    : isDisabled
                    ? "border-gray-200 bg-gray-50 cursor-not-allowed opacity-60"
                    : "border-gray-200 bg-white hover:border-orange-300 hover:bg-orange-50"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-3 rounded-lg ${
                      isSelected
                        ? "bg-orange-100 text-orange-600"
                        : isDisabled
                        ? "bg-gray-100 text-gray-400"
                        : method.id === "cod"
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <IconComponent size={20} />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3
                        className={`font-semibold ${
                          isDisabled ? "text-gray-400" : "text-gray-900"
                        }`}
                      >
                        {method.name}
                      </h3>
                      {isDisabled && (
                        <span className="text-xs text-red-500 bg-red-100 px-2 py-1 rounded-full">
                          Unavailable
                        </span>
                      )}
                      {method.id === "cod" && (
                        <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                          Available
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-sm ${
                        isDisabled ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {method.description}
                    </p>
                  </div>

                  {loading && isSelected && (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-orange-500 border-t-transparent"></div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Security Info */}
        <div className="flex items-center justify-center gap-2 mt-8 text-xs text-gray-500">
          <Shield size={14} />
          <span>Your payment information is secure and encrypted</span>
        </div>

        {/* Note for COD */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-6">
          <div className="flex items-start gap-3">
            <Banknote className="text-amber-600 mt-0.5" size={16} />
            <div>
              <p className="font-medium text-amber-800 text-sm">Cash on Delivery</p>
              <p className="text-amber-700 text-xs mt-1">
                Please keep exact change ready. Our delivery partner will collect ₹
                {orderData.totalAmount.toFixed(2)} at your doorstep.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
