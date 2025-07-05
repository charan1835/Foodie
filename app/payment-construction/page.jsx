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
  Navigation,
  Loader2,
  Home,
  Building,
  User,
} from "lucide-react";
import GlobalApi from "@/_utils/GlobelApi";

export default function PaymentConstructionPage() {
  const { user } = useUser();
  const router = useRouter();
  const [orderData, setOrderData] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState("");
  const [loading, setLoading] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);
  const [addressType, setAddressType] = useState("home");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [landmark, setLandmark] = useState("");

  useEffect(() => {
    const storedOrderData = sessionStorage.getItem("orderData");
    const savedAddress = localStorage.getItem("deliveryAddress");
    const savedAddressType = localStorage.getItem("addressType");
    const savedCustomerName = localStorage.getItem("customerName");
    const savedCustomerPhone = localStorage.getItem("customerPhone");
    const savedLandmark = localStorage.getItem("landmark");

    if (storedOrderData) {
      setOrderData(JSON.parse(storedOrderData));
    } else {
      router.push("/cart");
    }
    
    if (savedAddress) setDeliveryAddress(savedAddress);
    if (savedAddressType) setAddressType(savedAddressType);
    if (savedCustomerName) setCustomerName(savedCustomerName);
    if (savedCustomerPhone) setCustomerPhone(savedCustomerPhone);
    if (savedLandmark) setLandmark(savedLandmark);

    // Set default user info if available
    if (user) {
      if (!savedCustomerName && user.fullName) {
        setCustomerName(user.fullName);
      }
      if (!savedCustomerPhone && user.phoneNumbers?.[0]?.phoneNumber) {
        setCustomerPhone(user.phoneNumbers[0].phoneNumber);
      }
    }
  }, [router, user]);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by this browser.");
      return;
    }

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Try multiple geocoding services with fallbacks
          let addressFound = false;
          
          // Method 1: OpenCage API (Replace YOUR_API_KEY with your actual key)
          try {
            const openCageResponse = await fetch(
              `https://api.opencagedata.com/geocode/v1/json?q=${latitude},${longitude}&key=3124ddf5e3c34be69c1924db299ba631&language=en&pretty=1`
            );
            
            if (openCageResponse.ok) {
              const openCageData = await openCageResponse.json();
              if (openCageData.results && openCageData.results.length > 0) {
                const result = openCageData.results[0];
                const address = result.formatted;
                setDeliveryAddress(address);
                toast.success("📍 Location detected successfully!");
                addressFound = true;
              }
            }
          } catch (openCageError) {
            console.log("OpenCage API failed:", openCageError);
          }
          
          // Method 2: BigDataCloud (Free, no API key needed)
          if (!addressFound) {
            try {
              const bigDataResponse = await fetch(
                `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
              );
              
              if (bigDataResponse.ok) {
                const bigDataData = await bigDataResponse.json();
                if (bigDataData.locality || bigDataData.city) {
                  const address = [
                    bigDataData.locality || bigDataData.city,
                    bigDataData.principalSubdivision,
                    bigDataData.countryName
                  ].filter(Boolean).join(", ");
                  
                  setDeliveryAddress(address);
                  toast.success("📍 Location detected successfully!");
                  addressFound = true;
                }
              }
            } catch (bigDataError) {
              console.log("BigDataCloud API failed:", bigDataError);
            }
          }
          
          // Method 3: Nominatim (OpenStreetMap) - Free
          if (!addressFound) {
            try {
              const nominatimResponse = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
                {
                  headers: {
                    'User-Agent': 'FoodieApp/1.0 (your-email@example.com)'
                  }
                }
              );
              
              if (nominatimResponse.ok) {
                const nominatimData = await nominatimResponse.json();
                if (nominatimData.display_name) {
                  setDeliveryAddress(nominatimData.display_name);
                  toast.success("📍 Location detected successfully!");
                  addressFound = true;
                }
              }
            } catch (nominatimError) {
              console.log("Nominatim API failed:", nominatimError);
            }
          }
          
          // Fallback: Use coordinates if all APIs fail
          if (!addressFound) {
            const address = `📍 Current Location\nLat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}\n\n(Please add your complete address details above)`;
            setDeliveryAddress(address);
            toast.success("📍 Location coordinates captured! Please add your full address details.");
          }
          
        } catch (error) {
          console.error("Geocoding error:", error);
          const address = `📍 Location: ${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}\n\n(Please add your complete address details above)`;
          setDeliveryAddress(address);
          toast.success("📍 Location coordinates captured! Please add your full address details.");
        } finally {
          setLocationLoading(false);
        }
      },
      (error) => {
        setLocationLoading(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            toast.error("Location access denied. Please enable location services.");
            break;
          case error.POSITION_UNAVAILABLE:
            toast.error("Location information unavailable.");
            break;
          case error.TIMEOUT:
            toast.error("Location request timed out.");
            break;
          default:
            toast.error("An unknown error occurred while fetching location.");
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000,
      }
    );
  };

  const handleSaveAddress = () => {
    if (!deliveryAddress.trim()) {
      toast.error("Please enter a valid address.");
      return;
    }
    if (!customerName.trim()) {
      toast.error("Please enter your name.");
      return;
    }
    if (!customerPhone.trim()) {
      toast.error("Please enter your phone number.");
      return;
    }

    localStorage.setItem("deliveryAddress", deliveryAddress.trim());
    localStorage.setItem("addressType", addressType);
    localStorage.setItem("customerName", customerName.trim());
    localStorage.setItem("customerPhone", customerPhone.trim());
    localStorage.setItem("landmark", landmark.trim());
    toast.success("Address details saved!");
  };

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

  const addressTypes = [
    { id: "home", label: "Home", icon: Home },
    { id: "work", label: "Work", icon: Building },
    { id: "other", label: "Other", icon: MapPin },
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

    const itemLines =
      items?.map((item, i) => `• ${item.name} — ₹${item.price}`).join("%0A") ||
      "No items listed";

    const message =
      `*🛒 COD Order Summary*\n\n` +
      `👤 *Customer:* ${customerName || user?.fullName || "Guest"}\n` +
      `📧 *Email:* ${user?.primaryEmailAddress?.emailAddress || "Not Provided"}\n` +
      `📱 *Phone:* ${customerPhone || user?.phoneNumbers?.[0]?.phoneNumber || "Not Provided"}\n` +
      `📦 *Total Items:* ${itemCount}\n\n` +
      `*🧾 Order Details:*\n${itemLines}\n\n` +
      `💵 *Subtotal:* ₹${subtotal.toFixed(2)}\n` +
      `🧮 *GST (12%):* ₹${gstAmount.toFixed(2)}\n` +
      `🚚 *Delivery Fee:* ₹${deliveryCharge.toFixed(2)}\n` +
      (appliedCoupon ? `🏷️ *Coupon Discount:* -₹${couponDiscount.toFixed(2)}\n` : "") +
      `\n🔐 *Total Payable:* ₹${totalAmount.toFixed(2)}\n\n` +
      `✅ *Payment Mode:* Cash on Delivery\n` +
      `🕐 *ETA:* 25–30 mins\n\n` +
      `📍 *Address Type:* ${addressType.charAt(0).toUpperCase() + addressType.slice(1)}\n` +
      `📍 *Address:* ${deliveryAddress}\n` +
      (landmark ? `🏷️ *Landmark:* ${landmark}\n` : "") +
      `📍 *App:* foodieeee\n\n` +
      `📍 *Please share your live location for smoother delivery.*`;

    return `https://wa.me/918688605760?text=${encodeURIComponent(message)}`;
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

      if (!deliveryAddress.trim() || !customerName.trim() || !customerPhone.trim()) {
        toast.error("Please fill in all required address details before placing order.");
        setLoading(false);
        return;
      }

      if (method.id === "cod") {
        toast.success("Order placed successfully! 🎉");

        const userEmail = user.primaryEmailAddress.emailAddress;
        const cartRes = await GlobalApi.GetUserCart(userEmail);
        const userCart = cartRes?.userCarts || [];

        for (let item of userCart) {
          await GlobalApi.deleteCartItem(item.id);
        }

        const waLink = generateWhatsAppMessage();
        toast("Redirecting to WhatsApp... ✅ Please make sure to hit *send*.");
        window.location.href = waLink;
        

        sessionStorage.removeItem("orderData");
        setTimeout(() => {
          router.push("/payment-construction/thankyou");
        }, 3000);
      }
    } catch (err) {
      toast.error("Something went wrong!");
      console.error("Payment error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-md mx-auto px-4 py-8">
        {/* Address Section */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <MapPin size={20} />
            Delivery Details
          </h3>

          {/* Customer Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User size={16} className="inline mr-1" />
              Full Name *
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 text-sm text-gray-900 bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-gray-500"
              placeholder="Enter your full name"
            />
          </div>

          {/* Customer Phone */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Smartphone size={16} className="inline mr-1" />
              Phone Number *
            </label>
            <input
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 text-sm text-gray-900 bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-gray-500"
              placeholder="Enter your phone number"
            />
          </div>

          {/* Address Type Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address Type
            </label>
            <div className="flex gap-2">
              {addressTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => setAddressType(type.id)}
                    className={`flex-1 p-3 rounded-lg border transition-all ${
                      addressType === type.id
                        ? "border-orange-500 bg-orange-50 text-orange-600"
                        : "border-gray-300 bg-white text-gray-600 hover:border-orange-300"
                    }`}
                  >
                    <IconComponent size={16} className="mx-auto mb-1" />
                    <span className="text-xs font-medium">{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Address Input */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Complete Address *
              </label>
              <button
                onClick={getCurrentLocation}
                disabled={locationLoading}
                className="flex items-center gap-1 px-3 py-1 text-xs bg-orange-100 text-orange-600 rounded-full hover:bg-orange-200 disabled:opacity-50"
              >
                {locationLoading ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <Navigation size={12} />
                )}
                {locationLoading ? "Getting..." : "Use Current Location"}
              </button>
            </div>
            <textarea
              rows={3}
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 text-sm text-gray-900 bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-gray-500"
              placeholder="House/Flat No, Street, Area, City, Pincode"
            />
          </div>

          {/* Landmark */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Landmark (Optional)
            </label>
            <input
              type="text"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 text-sm text-gray-900 bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-gray-500"
              placeholder="e.g., Near McDonald's, Behind City Mall"
            />
          </div>

          <button
            onClick={handleSaveAddress}
            className="w-full px-4 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors"
          >
            Save Address Details
          </button>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-4">Choose Payment Method</h2>

          <div className="space-y-3">
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
        </div>

        <div className="flex items-center justify-center gap-2 mt-6 text-xs text-gray-500">
          <Shield size={14} />
          <span>Your information is secure and encrypted</span>
        </div>
      </div>
    </div>
  );
}