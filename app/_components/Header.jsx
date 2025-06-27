"use client"

import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs"
import { useContext, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Home } from "lucide-react"
import { CartupdateContext } from "../_context/CartProvider"
import GlobelApi from "../_utils/GlobelApi"

const Header = () => {
  const { isSignedIn, user } = useUser()
  const inputRef = useRef(null)
  const [inputValue, setInputValue] = useState("")
  const [suggestionsVisible, setSuggestionsVisible] = useState(false)
  const [userCart, setUserCart] = useState([])
  const { updateCart } = useContext(CartupdateContext)
  const router = useRouter()

  const handleCartClick = () => {
    router.push("/Cartpage") // Navigate to your cart page
  }

  const handleHomeClick = () => {
    router.push("/") // Navigate to home page
  }

  // 🛒 Fetch user cart
  const fetchUserCart = async () => {
    try {
      if (!user?.primaryEmailAddress?.emailAddress) return
      const res = await GlobelApi.GetUserCart(user.primaryEmailAddress.emailAddress)
      console.log("Cart fetched:", res?.userCarts || []) // Debug log
      console.log("Cart items structure:", res?.userCarts?.[0]) // Debug: Check item structure
      setUserCart(res?.userCarts || [])
    } catch (err) {
      console.error("Cart fetch error:", err)
    }
  }

  // ✅ Effect for initial load and user changes
  useEffect(() => {
    if (isSignedIn && user?.primaryEmailAddress?.emailAddress) {
      fetchUserCart()
    }
  }, [isSignedIn, user?.primaryEmailAddress?.emailAddress])

  // ✅ Effect specifically for cart updates
  useEffect(() => {
    if (updateCart && isSignedIn && user?.primaryEmailAddress?.emailAddress) {
      console.log("Cart update triggered, refetching...") // Debug log
      // Small delay to ensure the backend has processed the update
      const timer = setTimeout(() => {
        fetchUserCart()
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [updateCart, isSignedIn, user?.primaryEmailAddress?.emailAddress])

  // 🔍 Handle search
  const handleSubmit = (e) => {
    e.preventDefault()
    const searchQuery = inputRef.current.value.trim()
    if (searchQuery) router.push(`/search?q=${searchQuery}`)
  }

  return (
    <header className="bg-white shadow-sm fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto py-3 px-4 flex items-center justify-between gap-4">
        {/* Logo and Home Icon */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <img src="/image.png" alt="logo" className="h-10 w-10 object-contain" />
            <h1 className="text-xl font-bold text-blue-600 hover:text-orange-600 whitespace-nowrap">Foodieeee</h1>
          </div>

          {/* Home Icon */}
          <button
            onClick={handleHomeClick}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            aria-label="Go to Home"
          >
            <Home className="h-5 w-5 text-gray-600 hover:text-blue-600" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 justify-center relative">
          <form onSubmit={handleSubmit} className="w-full max-w-lg">
            <div className="relative">
              <input
                type="text"
                ref={inputRef}
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value)
                  setSuggestionsVisible(e.target.value.length > 0)
                }}
                placeholder="Search restaurants or foods..."
                className="w-full pl-4 pr-10 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <Search
                onClick={handleSubmit}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
              />
            </div>

            {/* Suggestions */}
            {suggestionsVisible && (
              <div className="absolute z-10 mt-2 w-full bg-white border rounded-lg shadow-lg">
                {CategoryList.map((item) => (
                  <div
                    key={item.slug}
                    onClick={() => {
                      inputRef.current.value = item.name
                      setInputValue(item.name)
                      setSuggestionsVisible(false)
                      router.push(`/search?q=${item.name}`)
                    }}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {item.name}
                  </div>
                  ))}
              </div>
            )}
          </form>
        </div>

        {/* Cart + Auth Buttons */}
        <div className="flex items-center gap-4">
          {/* Cart for signed-in users */}
          {isSignedIn && (
            <button className="relative w-10 h-10" aria-label="Cart" onClick={handleCartClick}>
              <img
                src="https://images.ctfassets.net/wtodlh47qxpt/6qtBVFuno7pdwOQ9RIvYm9/d13e9b7242980972cf49beddde2cc295/bucket_cart_icon.svg"
                className="h-full w-full object-contain"
                alt="Cart Icon"
              />
              {userCart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                  {userCart.reduce((total, item) => total + (item.quantity || 1), 0)}
                </span>
              )}
            </button>
          )}

          {/* Clerk buttons */}
          {isSignedIn ? (
            <UserButton />
          ) : (
            <>
              <SignInButton mode="modal">
                <button className="px-3 py-1.5 text-sm rounded-md text-blue-600 hover:bg-blue-50 border border-blue-600">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="px-3 py-1.5 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700">
                  Sign Up
                </button>
              </SignUpButton>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
