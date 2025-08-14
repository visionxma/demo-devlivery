"use client"

export default function DeliveryLoading() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        {/* Road Animation */}
        <div className="relative w-80 h-20 mb-8 mx-auto overflow-hidden">
          {/* Road */}
          <div className="absolute bottom-0 w-full h-2 bg-gray-400 rounded-full">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-yellow-400 transform -translate-y-1/2 animate-pulse"></div>
          </div>

          {/* Delivery Bike */}
          <div className="absolute bottom-2 animate-bike-ride">
            <div className="relative">
              {/* Bike Body */}
              <div className="w-12 h-8 bg-red-500 rounded-lg relative">
                {/* Delivery Box */}
                <div className="absolute -top-3 -right-1 w-6 h-6 bg-blue-500 rounded border-2 border-white shadow-sm">
                  <div className="absolute top-1 left-1 w-1 h-1 bg-white rounded-full"></div>
                </div>

                {/* Headlight */}
                <div className="absolute left-0 top-2 w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
              </div>

              {/* Wheels */}
              <div className="absolute -bottom-2 left-1 w-4 h-4 bg-gray-800 rounded-full animate-spin-slow">
                <div className="absolute top-1 left-1 w-2 h-2 bg-gray-600 rounded-full"></div>
              </div>
              <div className="absolute -bottom-2 right-1 w-4 h-4 bg-gray-800 rounded-full animate-spin-slow">
                <div className="absolute top-1 left-1 w-2 h-2 bg-gray-600 rounded-full"></div>
              </div>

              {/* Rider */}
              <div className="absolute -top-4 left-2 w-3 h-4 bg-orange-400 rounded-t-full">
                {/* Helmet */}
                <div className="absolute -top-1 -left-0.5 w-4 h-3 bg-red-600 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Speed Lines */}
          <div className="absolute top-4 left-0 w-full">
            <div className="animate-speed-lines">
              <div className="absolute top-0 w-8 h-0.5 bg-gray-300 opacity-60"></div>
              <div className="absolute top-2 w-6 h-0.5 bg-gray-300 opacity-40"></div>
              <div className="absolute top-4 w-10 h-0.5 bg-gray-300 opacity-50"></div>
            </div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="space-y-3">
          <h2 className="text-2xl font-bold">
            <span style={{ color: "#E63946" }}>Atacarejo</span> <span style={{ color: "#4FA3D1" }}>São Manoel</span>
          </h2>
          <p className="text-lg text-gray-600 animate-pulse">Preparando sua entrega...</p>
          <div className="flex justify-center space-x-1 mt-4">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}
