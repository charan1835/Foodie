"use client"

import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs"
import { useContext, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Home } from "lucide-react"
import { CartupdateContext } from "../_context/CartupdateContext"
import GlobelApi from "../_utils/GlobelApi"

// Add CategoryList if it doesn't exist elsewhere
const CategoryList = [
  { slug: "pizza", name: "Pizza" },
  { slug: "burger", name: "Burger" },
  { slug: "pasta", name: "Pasta" },
  { slug: "chinese", name: "Chinese" },
  { slug: "indian", name: "Indian" },
]

const Header = () => {
  const { isSignedIn, user } = useUser()
  const inputRef = useRef(null)
  const [inputValue, setInputValue] = useState("")
  const [suggestionsVisible, setSuggestionsVisible] = useState(false)
  const [userCart, setUserCart] = useState([])
  const router = useRouter()

  // Safe context usage with error handling
  const cartContext = useContext(CartupdateContext)
  const updateCart = cartContext?.updateCart

  const handleCartClick = () => {
    router.push("/Cartpage") // Navigate to your cart page
  }

  const handleHomeClick = () => {
    router.push("/") // Navigate to home page
  }

  // 🛒 Fetch user cart with better error handling
  const fetchUserCart = async () => {
    try {
      if (!user?.primaryEmailAddress?.emailAddress) {
        console.log("No user email available")
        return
      }
      
      console.log("Fetching cart for:", user.primaryEmailAddress.emailAddress)
      const res = await GlobelApi.GetUserCart(user.primaryEmailAddress.emailAddress)
      console.log("Cart API response:", res) // Debug log
      
      // Handle different response structures
      const cartData = res?.userCarts || res?.data || res || []
      console.log("Processed cart data:", cartData)
      setUserCart(Array.isArray(cartData) ? cartData : [])
      
    } catch (err) {
      console.error("Cart fetch error:", err)
      // Set empty cart on error to prevent UI issues
      setUserCart([])
    }
  }

  // ✅ Effect for initial load and user changes
  useEffect(() => {
    if (isSignedIn && user?.primaryEmailAddress?.emailAddress) {
      fetchUserCart()
    } else {
      // Clear cart when user signs out
      setUserCart([])
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

  // 🔍 Handle search with better validation
  const handleSubmit = (e) => {
    e.preventDefault()
    const searchQuery = inputRef.current?.value?.trim()
    if (searchQuery) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      setSuggestionsVisible(false) // Hide suggestions after search
    }
  }

  // Handle suggestion click
  const handleSuggestionClick = (categoryName) => {
    if (inputRef.current) {
      inputRef.current.value = categoryName
      setInputValue(categoryName)
      setSuggestionsVisible(false)
      router.push(`/search?q=${encodeURIComponent(categoryName)}`)
    }
  }

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setSuggestionsVisible(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Calculate total cart items safely
  const totalCartItems = userCart.reduce((total, item) => {
    const quantity = Number(item?.quantity) || 1
    return total + quantity
  }, 0)

  return (
    <header className="bg-white shadow-sm fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto py-3 px-4 flex items-center justify-between gap-4">
        {/* Logo and Home Icon */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <img 
              src="/image.png" 
              alt="logo" 
              className="h-10 w-10 object-contain"
              onError={(e) => {
                e.target.style.display = 'none' // Hide if image fails to load
              }}
            />
            <h1 className="text-xl font-bold text-blue-600 hover:text-orange-600 whitespace-nowrap">
              Foodieeee
            </h1>
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
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Search"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>

            {/* Suggestions */}
            {suggestionsVisible && inputValue && (
              <div className="absolute z-10 mt-2 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {CategoryList
                  .filter(item => 
                    item.name.toLowerCase().includes(inputValue.toLowerCase())
                  )
                  .map((item) => (
                    <div
                      key={item.slug}
                      onClick={() => handleSuggestionClick(item.name)}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                    >
                      {item.name}
                    </div>
                  ))}
                {CategoryList.filter(item => 
                  item.name.toLowerCase().includes(inputValue.toLowerCase())
                ).length === 0 && (
                  <div className="px-4 py-2 text-gray-500">
                    No suggestions found
                  </div>
                )}
              </div>
            )}
          </form>
        </div>

        {/* Cart + Auth Buttons */}
        <div className="flex items-center gap-4">
          {/* Cart for signed-in users */}
          {isSignedIn && (
            <button 
              className="relative w-10 h-10" 
              aria-label="Cart" 
              onClick={handleCartClick}
            >
              <img
                src="https://images.ctfassets.net/wtodlh47qxpt/6qtBVFuno7pdwOQ9RIvYm9/d13e9b7242980972cf49beddde2cc295/bucket_cart_icon.svg"
                className="h-full w-full object-contain"
                alt="Cart Icon"
                onError={(e) => {
                  // Fallback to text if image fails
                  e.target.style.display = 'none'
                  e.target.parentElement.innerHTML = '🛒'
                }}
              />
              {totalCartItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                  {totalCartItems > 99 ? '99+' : totalCartItems}
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