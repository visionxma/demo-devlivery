"use client"

import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import ProductGrid from "@/components/product-grid"
import CustomerRegistration from "@/components/customer-registration"
import OrderHistory from "@/components/order-history"
import RecurringOrder from "@/components/recurring-order"
import AddressManager from "@/components/address-manager"
import DeliveryLoading from "@/components/delivery-loading"
import { useState, useEffect, useCallback } from "react"

interface Address {
  id: string
  name: string
  address: string
  isDefault: boolean
}

export default function HomePage() {
  const [customerData, setCustomerData] = useState<{ name: string; phone: string; address: string } | null>(null)
  const [recurringOrderProducts, setRecurringOrderProducts] = useState<string[]>([])
  const [customerAddresses, setCustomerAddresses] = useState<Address[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const handleCustomerDataChange = useCallback((data: { name: string; phone: string; address: string } | null) => {
    setCustomerData(data)

    // Clear recurring order when customer changes
    if (!data) {
      setRecurringOrderProducts([])
      setCustomerAddresses([])
    }
  }, [])

  const handleRecurringOrder = useCallback((productIds: string[]) => {
    setRecurringOrderProducts(productIds)

    setTimeout(() => {
      const productsSection = document.querySelector("[data-products-section]")
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }, 100)
  }, [])

  const handleAddressesChange = useCallback((addresses: Address[]) => {
    setCustomerAddresses(addresses)
  }, [])

  if (isLoading) {
    return <DeliveryLoading />
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* Hero Section */}
        <section className="text-center mb-6 sm:mb-12">
          <div className="mb-3 sm:mb-6">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-2">
              <span style={{ color: "#E63946" }}>Atacarejo</span> <span style={{ color: "#4FA3D1" }}>São Manoel</span>
            </h1>
            <div className="w-12 sm:w-24 h-1 mx-auto mb-2 sm:mb-4" style={{ backgroundColor: "#4FA3D1" }}></div>
          </div>
          <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">
            Delivery de <span style={{ color: "#4FA3D1" }}>Gás</span> e <span style={{ color: "#4FA3D1" }}>Água</span>
          </h2>
          <p className="text-sm sm:text-lg text-gray-600 max-w-2xl mx-auto mb-3 sm:mb-6 px-2">
            Receba seus botijões de gás e galões de água no conforto da sua casa. Entrega rápida e segura em São Manoel!
          </p>
        </section>

        {/* Customer Registration Component */}
        <CustomerRegistration onCustomerData={handleCustomerDataChange} />

        {customerData && (
          <div className="space-y-4 sm:space-y-6">
            <AddressManager customerData={customerData} onAddressesChange={handleAddressesChange} />

            <RecurringOrder customerData={customerData} onRecurringOrder={handleRecurringOrder} />
          </div>
        )}

        <div data-products-section>
          <ProductGrid
            customerData={customerData}
            recurringOrderProducts={recurringOrderProducts}
            customerAddresses={customerAddresses}
          />
        </div>

        {customerData && (
          <div className="mt-6 sm:mt-12">
            <OrderHistory customerData={customerData} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
