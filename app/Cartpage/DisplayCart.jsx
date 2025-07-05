"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import Image from "next/image"
import { Trash2, Tag, Gift, ShoppingBag, Percent, Clock, Shield } from "lucide-react"
import { toast } from "react-hot-toast"
import GlobalApi from "@/_utils/GlobelApi"
import { useRouter } from "next/navigation";


export default function DisplayCart() {
  const { user } = useUser()
  const [userCart, setUserCart] = useState([])
  const [loading, setLoading] = useState(true)
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [showCouponInput, setShowCouponInput] = useState(false)
  const router = useRouter();

  // Available coupons
  const availableCoupons = {
    FIRSTTYM: { discount: 15, type: "percentage", description: "First Time User - 15% OFF" },
    WELCOME: { discount: 50, type: "flat", description: "Welcome Bonus - ₹50 OFF" },
    SAVE10: { discount: 10, type: "percentage", description: "Save 10% on your order" },
    FLAT100: { discount: 100, type: "flat", description: "Flat ₹100 OFF" },
    STUDENT: { discount: 20, type: "percentage", description: "Student Special - 20% OFF" },
  }

  const fetchCart = async () => {
    try {
      if (!user?.primaryEmailAddress?.emailAddress) return
      setLoading(true)
      const res = await GlobalApi.GetUserCart(user.primaryEmailAddress.emailAddress)
      setUserCart(res?.userCarts || [])
    } catch (err) {
      console.error("Cart fetch error:", err)
      toast.error("Failed to load cart")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await GlobalApi.deleteCartItem(id)
      toast.success("Item removed from cart")
      fetchCart()
    } catch (err) {
      console.error("Delete error:", err)
      toast.error("Failed to remove item")
    }
  }

  const applyCoupon = () => {
    const coupon = availableCoupons[couponCode.toUpperCase()]
    if (coupon) {
      setAppliedCoupon({ code: couponCode.toUpperCase(), ...coupon })
      toast.success(`Coupon applied! ${coupon.description}`)
      setShowCouponInput(false)
      setCouponCode("")
    } else {
      toast.error("Invalid coupon code")
    }
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
    toast.success("Coupon removed")
  }

  useEffect(() => {
    fetchCart()
  }, [user])

  // Calculations
  const subtotal = userCart.reduce((total, item) => total + item.price, 0)
  const deliveryCharge = subtotal > 0 ? 30 : 0
  const gstRate = 0.12 // 12% GST
  const gstAmount = subtotal * gstRate

  let couponDiscount = 0
  if (appliedCoupon) {
    if (appliedCoupon.type === "percentage") {
      couponDiscount = (subtotal * appliedCoupon.discount) / 100
    } else {
      couponDiscount = appliedCoupon.discount
    }
  }

  const totalAmount = subtotal + gstAmount + deliveryCharge - couponDiscount

  // Redirect to payment page
  const handleCheckout = async () => {
    try {
      // Prepare items data for WhatsApp message
      const items = userCart.map(item => ({
        id: item.id,
        name: item.productName,
        price: item.price,
        description: item.productDescription,
        image: item.productimg
      }));

      // Calculate and pass data to payment page
      const orderData = {
        items: items, // ✅ Now includes actual cart items
        subtotal: subtotal,
        gstAmount: gstAmount,
        deliveryCharge: deliveryCharge,
        couponDiscount: couponDiscount,
        totalAmount: totalAmount,
        appliedCoupon: appliedCoupon?.code || null,
        itemCount: userCart.length,
        userEmail: user.primaryEmailAddress.emailAddress
      };

      // Store order data in sessionStorage for payment page
      sessionStorage.setItem('orderData', JSON.stringify(orderData));
      
      // Redirect to payment construction page
      router.push("/payment-construction");

    } catch (err) {
      toast.error("Something went wrong!");
      console.error("Checkout error", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[500px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Loading your cart...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!userCart.length) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-20">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 max-w-md mx-auto">
              <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-12 h-12 text-orange-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
              <p className="text-gray-600 mb-6">Looks like you haven't added any delicious items to your cart yet.</p>
              <button onClick={() => router.push("/")} className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-semibold transition-colors">
                Start Odering
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Cart</h1>
          <p className="text-gray-600">
            {userCart.length} {userCart.length === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items - Left Side */}
          <div className="lg:col-span-2 space-y-4">
            {userCart.map((item, index) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 group"
              >
                <div className="flex items-start gap-6">
                  <div className="relative flex-shrink-0">
                    <Image
                      src={item.productimg || "/placeholder.svg?height=120&width=120"}
                      alt={item.productName}
                      width={120}
                      height={120}
                      className="rounded-xl object-cover shadow-sm"
                    />
                    <div className="absolute -top-2 -left-2 bg-orange-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                      {index + 1}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-semibold text-gray-900 leading-tight">{item.productName}</h3>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                        title="Remove item"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">{item.productDescription}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-green-600">₹{item.price}</span>
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Qty: 1</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock size={14} />
                        <span>25-30 mins</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary - Right Side */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 sticky top-24">
              {/* Header */}
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <ShoppingBag size={20} className="text-orange-500" />
                  Order Summary
                </h2>
              </div>

              {/* Coupon Section */}
              <div className="p-6 border-b border-gray-100">
                {!appliedCoupon ? (
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 border border-orange-100">
                    <div className="flex items-center gap-2 mb-3">
                      <Gift className="text-orange-600" size={18} />
                      <span className="font-semibold text-gray-800">Apply Coupon</span>
                    </div>

                    {!showCouponInput ? (
                      <button
                        onClick={() => setShowCouponInput(true)}
                        className="text-orange-600 hover:text-orange-700 font-medium text-sm flex items-center gap-1 transition-colors"
                      >
                        <Tag size={14} />
                        Enter coupon code
                      </button>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Enter code"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          />
                          <button
                            onClick={applyCoupon}
                            className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600 transition-colors font-medium"
                          >
                            Apply
                          </button>
                        </div>
                        <button
                          onClick={() => setShowCouponInput(false)}
                          className="text-gray-500 text-sm hover:text-gray-700 transition-colors"
                        >
                          Cancel
                        </button>

                        {/* Available Coupons */}
                        <div className="bg-white rounded-lg p-3 border border-gray-200">
                          <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                            <Percent size={12} />
                            Available Codes:
                          </p>
                          <div className="grid grid-cols-2 gap-1">
                            {Object.entries(availableCoupons).map(([code, details]) => (
                              <button
                                key={code}
                                onClick={() => setCouponCode(code)}
                                className="text-xs text-orange-600 hover:text-orange-700 text-left p-1 hover:bg-orange-50 rounded transition-colors"
                                title={details.description}
                              >
                                {code}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Tag className="text-green-600" size={16} />
                          <span className="font-semibold text-green-700">{appliedCoupon.code}</span>
                        </div>
                        <p className="text-xs text-green-600">{appliedCoupon.description}</p>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="p-6 space-y-4">
                <div className="space-y-3 text-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Subtotal</span>
                    <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm">GST (12%)</span>
                    <span className="font-medium">₹{gstAmount.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Delivery Fee</span>
                    <span className="font-medium">₹{deliveryCharge.toFixed(2)}</span>
                  </div>

                  {appliedCoupon && (
                    <div className="flex justify-between items-center text-green-600">
                      <span className="text-sm">Coupon Discount</span>
                      <span className="font-medium">-₹{couponDiscount.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total Amount</span>
                    <span className="text-2xl font-bold text-gray-900">₹{totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                {/* Savings Badge */}
                {appliedCoupon && (
                  <div className="bg-green-100 text-green-800 text-sm font-medium px-3 py-2 rounded-lg text-center">
                    🎉 You saved ₹{couponDiscount.toFixed(2)}!
                  </div>
                )}
              </div>

              {/* Checkout Button */}
              <div className="p-6 pt-0">
                <button onClick={handleCheckout} className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-4 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl ">
                  Proceed to Payment
                </button>

                {/* Security Info */}
                <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-500">
                  <Shield size={14} />
                  <span>Secure checkout • GST included</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}