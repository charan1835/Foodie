"use client"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Star, MapPin, Clock, ArrowRight } from "lucide-react"

function BusinessItem({ business }) {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/restaurent/${business.slug}`)
  }

  return (
    <div
      className="group relative bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer border border-gray-100 hover:border-gray-200"
      onClick={handleClick}
    >
      {/* Image Container with Overlay */}
      <div className="relative overflow-hidden">
        {business.banner?.[0]?.url ? (
          <Image
            src={business.banner[0].url || "/placeholder.svg"}
            alt={business.name}
            width={400}
            height={240}
            className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-56 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <div className="text-gray-400 text-lg font-medium">No Image</div>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Rating Badge */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1 shadow-lg">
          <Star size={14} className="text-amber-400 fill-amber-400" />
          <span className="text-sm font-semibold text-gray-800">4.5</span>
        </div>

       
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
            {business.name}
          </h3>

          {/* Business Types */}
          <div className="flex flex-wrap gap-2 mb-3">
            {business.types?.slice(0, 2).map((type, index) => (
              <span
                key={index}
                className="inline-block bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full"
              >
                {type}
              </span>
            ))}
            {business.types?.length > 2 && (
              <span className="inline-block bg-blue-50 text-blue-600 text-xs font-medium px-2.5 py-1 rounded-full">
                +{business.types.length - 2} more
              </span>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Clock size={14} className="text-gray-400" />
            <span className={(() => {
              const date = new Date()
              const hour = date.getHours() % 12 || 12
              const openTime = new Date(business.open_time)
              const closeTime = new Date(business.close_time)
              if (hour >= openTime.getHours() % 12 || 12 && hour < closeTime.getHours() % 12 || 12) {
                return "text-green-600"
              } else {
                return "text-red-600"
              }
            })()}>
              {(() => {
                const date = new Date()
                const hour = date.getHours() % 12 || 12
                const openTime = new Date(business.open_time)
                const closeTime = new Date(business.close_time)
                if (hour >= openTime.getHours() % 12 || 12 && hour < closeTime.getHours() % 12 || 12) {
                  return "Open Now"
                } else {
                  return "Closed"
                }
              })()}
            </span>
          </div>
        </div>
              
        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className={`${i < 4 ? "text-amber-400 fill-amber-400" : "text-gray-300"}`} />
              ))}
            </div>
            <span className="text-sm text-gray-600">(4)</span>
          </div>

          <div className="flex items-center gap-1 text-blue-600 font-medium text-sm group-hover:gap-2 transition-all duration-200">
            <span>View Details</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
          </div>
        </div>
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 rounded-2xl border-2 border-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  )
}

export default BusinessItem
