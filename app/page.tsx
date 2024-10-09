"use client"

import { useState } from 'react'

export default function Component() {
  const [id, setId] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle the ID submission here
    console.log('Submitted ID:', id)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden relative bg-black">
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute inset-0 w-full h-full animate-pulse-slow">
          <div className="absolute inset-0 bg-gradient-radial from-red-900/20 to-transparent rounded-full transform translate-x-1/2 translate-y-1/2"></div>
          <div className="absolute inset-0 bg-gradient-radial from-red-900/20 to-transparent rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
      </div>

      {/* Content */}
      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="flex flex-col items-center">
          <svg className="h-16 w-16 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
          </svg>
          <h1 className="text-3xl font-bold text-center text-white">Welcome to Elicit 24</h1>
          <p className="mt-2 text-center text-gray-400">
            Please verify your status and collect your digital tax ID.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <input
              id="id"
              name="id"
              type="text"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white bg-black/50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
              placeholder="Enter your ID"
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out"
          >
            Verify Status
          </button>
        </form>
      </div>
    </div>
  )
}