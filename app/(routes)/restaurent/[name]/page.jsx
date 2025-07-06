"use client"

import { useContext, useEffect, useState, use } from "react"
import GlobalApi from "@/_utils/GlobelApi"
import Image from "next/image"
import { Loader2, Plus, Clock, MapPin, Star, Heart, Share2 } from "lucide-react"
import { useUser } from "@clerk/nextjs"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"
import { CartupdateContext } from "../../../_context/CartupdateContext"

function RestaurantDetails({ params }) {
  const { name: slug } = use(params)
  const [restaurant, setRestaurant] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState("")
  const [addingToCart, setAddingToCart] = useState(null)
  const { user } = useUser()
  const router = useRouter()
  const { updateCart, setUpdateCart } = useContext(CartupdateContext)

  useEffect(() => {
    if (slug) {
      GlobalApi.GetBusinessdetail(slug).then((res) => {
        setRestaurant(res.restaurant)
        setLoading(false)
        if (res.restaurant?.menu?.length > 0) {
          setActiveCategory(res.restaurant.menu[0].catagory)
        }
      })
    }
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-orange-50 pt-20">
        <div className="flex justify-center items-center min-h-[500px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading restaurant details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="flex justify-center items-center min-h-[500px]">
          <div className="text-center bg-white rounded-2xl p-12 shadow-sm border border-gray-100">
            <div className="text-6xl mb-4">🍽️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Restaurant not found</h2>
            <p className="text-gray-600">The restaurant you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    )
  }

  const addToCartHandler = async (item) => {
    if (!user?.primaryEmailAddress?.emailAddress) {
      toast.error("Please login to add item to cart")
      return
    }

    setAddingToCart(item.id)

    const data = {
      email: user?.primaryEmailAddress?.emailAddress,
      productName: item?.name,
      productDescription: item?.description,
      productimg: item?.productimage?.[0]?.url,
      price: item?.price,
      phoneNumber: user?.primaryPhoneNumber?.phoneNumber || "",
    }

    try {
      const res = await GlobalApi.addToCart(data)
      toast.success("Item added to cart")
      setUpdateCart((prev) => prev + 1)
    } catch (err) {
      console.error("Add to cart failed:", err)
      toast.error("Failed to add item to cart")
    } finally {
      setAddingToCart(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Restaurant Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8 items-center">
            {/* Restaurant Image */}
            <div className="md:col-span-1">
              <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src={restaurant.banner?.[0]?.url || "/placeholder.svg?height=300&width=300"}
                  alt={restaurant.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Restaurant Info */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{restaurant.name}</h1>
                  <div className="flex items-center gap-4 text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Star size={16} className="text-yellow-500 fill-yellow-500" />
                      <span className="font-medium">4.5</span>
                      <span className="text-sm">(124 reviews)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      <span className="text-sm">{restaurant.workinghours || "9:00 AM - 11:00 PM"}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                    <Heart size={20} className="text-gray-600" />
                  </button>
                  <button className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                    <Share2 size={20} className="text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <MapPin size={16} />
                <span>{restaurant.address}</span>
              </div>

              {restaurant.aboutUs && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">About</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">{restaurant.aboutUs}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Menu</h2>

          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-8">
            {restaurant.menu?.map((menu) => (
              <button
                key={menu.id}
                onClick={() => setActiveCategory(menu.catagory)}
                className={`px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
                  activeCategory === menu.catagory
                    ? "bg-orange-500 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                {menu.catagory}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items Grid */}
        {restaurant.menu?.map(
          (menu) =>
            activeCategory === menu.catagory && (
              <div key={menu.id} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menu.menuitems?.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 group"
                  >
                    {/* Item Image */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={item.productimage?.[0]?.url || "/placeholder.svg?height=200&width=300"}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">{item.name}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">{item.description}</p>

                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-green-600">₹{item.price}</span>
                        <button
                          onClick={() => addToCartHandler(item)}
                          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                        >
                          {addingToCart === item.id ? (
                            <>
                              <Loader2 size={16} className="animate-spin" />
                              Adding...
                            </>
                          ) : (
                            <>
                              <Plus size={16} />
                              Add
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ),
        )}

        {/* Empty State */}
        {restaurant.menu?.find((menu) => menu.catagory === activeCategory)?.menuitems?.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No items available</h3>
            <p className="text-gray-600">This category doesn't have any items yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default RestaurantDetails
