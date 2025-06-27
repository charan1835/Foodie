// app/(auth)/sign-up/page.jsx  OR  pages/sign-up.jsx
"use client"; // only for App Router apps!

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Create an Account 🚀</h1>
          <p className="text-sm text-gray-600">Join us and get started</p>
        </div>
        <SignUp
          path="/sign-up"
          routing="path"
          signInUrl="/sign-in"
          appearance={{
            elements: {
              formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded",
              card: "shadow-none",
            },
          }}
        />
      </div>
    </div>
  );
}
