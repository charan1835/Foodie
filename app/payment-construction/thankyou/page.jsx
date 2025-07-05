"use client"
import { useEffect, useState } from "react"
import Confetti from "react-confetti"

export default function ThankYou() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [timeLeft, setTimeLeft] = useState(30 * 60) // 30 minutes in seconds
  const [currentStep, setCurrentStep] = useState(0)
  const [cookingEmojis, setCookingEmojis] = useState([])

  const steps = [
    { label: "Order Received", emoji: "📋", completed: true },
    { label: "Preparing", emoji: "👨‍🍳", completed: false },
    { label: "Cooking", emoji: "🔥", completed: false },
    { label: "Quality Check", emoji: "✅", completed: false },
    { label: "Out for Delivery", emoji: "🚴‍♂️", completed: false },
    { label: "Delivered", emoji: "🎉", completed: false },
  ]

  const cookingEmojisArray = ["🍳", "🥘", "🍲", "🔥", "👨‍🍳", "🥄", "🍽️"]

  useEffect(() => {
    setDimensions({ width: window.innerWidth, height: window.innerHeight })

    // Timer countdown
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    // Progress simulation
    const progressTimer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1
        }
        clearInterval(progressTimer)
        return prev
      })
    }, 5000) // Change step every 5 seconds for demo

    // Floating cooking emojis
    const emojiInterval = setInterval(() => {
      setCookingEmojis((prev) => [
        ...prev.slice(-10), // Keep only last 10 emojis
        {
          id: Date.now(),
          emoji: cookingEmojisArray[Math.floor(Math.random() * cookingEmojisArray.length)],
          x: Math.random() * 100,
          y: Math.random() * 100,
        },
      ])
    }, 2000)

    return () => {
      clearInterval(timer)
      clearInterval(progressTimer)
      clearInterval(emojiInterval)
    }
  }, [])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const progressPercentage = ((currentStep + 1) / steps.length) * 100

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 to-yellow-50 px-6 text-center relative overflow-hidden">
      <Confetti width={dimensions.width} height={dimensions.height} numberOfPieces={50} />

      {/* Floating cooking emojis */}
      {cookingEmojis.map((item) => (
        <div
          key={item.id}
          className="absolute text-2xl animate-bounce pointer-events-none"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            animationDuration: `${2 + Math.random() * 2}s`,
            animationDelay: `${Math.random()}s`,
          }}
        >
          {item.emoji}
        </div>
      ))}

      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-auto relative z-10">
        <h1 className="text-4xl font-extrabold text-green-500 mb-4">🎉 Order Confirmed!</h1>

        {/* Countdown Timer */}
        <div className="mb-6">
          <p className="text-gray-700 text-lg mb-2">Your delicious meal is being prepared!</p>
          <div className="bg-orange-100 rounded-lg p-4 mb-4">
            <p className="text-orange-800 font-semibold">Estimated Time:</p>
            <p className="text-3xl font-bold text-orange-600">{formatTime(timeLeft)}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Order Progress</span>
            <span className="text-sm font-medium text-gray-700">{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div
              className="bg-gradient-to-r from-orange-400 to-red-500 h-3 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Order Steps */}
        <div className="space-y-3 mb-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex items-center p-3 rounded-lg transition-all duration-500 ${
                index <= currentStep ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-500"
              }`}
            >
              <span className="text-2xl mr-3">{step.emoji}</span>
              <span className="font-medium">{step.label}</span>
              {index <= currentStep && <span className="ml-auto text-green-600">✓</span>}
              {index === currentStep && index > 0 && (
                <div className="ml-auto">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Delivery Tracking */}
        {currentStep >= 4 && (
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center mb-2">
              <span className="text-3xl animate-bounce">🚴‍♂️</span>
              <span className="ml-2 text-blue-800 font-semibold">Out for Delivery!</span>
            </div>
            <p className="text-blue-600 text-sm">Your rider is on the way!</p>
          </div>
        )}

        <a
          href="/"
          className="inline-block px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-105 font-semibold"
        >
          Back to Home
        </a>
      </div>

      {/* Cooking animation in background */}
      <div className="absolute bottom-10 right-10 text-6xl animate-pulse">👨‍🍳</div>
      <div className="absolute top-20 left-10 text-4xl animate-spin" style={{ animationDuration: "3s" }}>
        🍳
      </div>
    </div>
  )
}
