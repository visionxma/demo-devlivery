"use client"
import { Card, CardContent } from "@/components/ui/card"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { MessageCircle } from "lucide-react"
import Image from "next/image"

export interface Product {
  id: string
  name: string
  brand: string
  price: number
  image: string
  category: "gas" | "water"
}

interface ProductCardProps {
  product: Product
  isSelected: boolean
  onSelectionChange: (productId: string, selected: boolean) => void
  onWhatsAppClick: (product: Product) => void
}

export default function ProductCard({ product, isSelected, onSelectionChange, onWhatsAppClick }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger selection if clicking on the WhatsApp button
    if ((e.target as HTMLElement).closest("button[data-whatsapp]")) {
      return
    }
    onSelectionChange(product.id, !isSelected)
  }

  return (
    <Card
      className={`overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer ${
        isSelected ? "ring-2 ring-blue-500 bg-blue-50" : ""
      }`}
      onClick={handleCardClick}
    >
      <CardContent className="p-0">
        {/* Product Image */}
        <div className="relative h-48 bg-gray-100">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={`${product.brand} - ${product.name}`}
            fill
            className="object-cover"
          />
          {isSelected && (
            <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">{product.name}</h3>
            <p className="text-gray-600">Marca: {product.brand}</p>
          </div>

          {/* Price */}
          <div className="text-2xl font-bold" style={{ color: "#4FA3D1" }}>
            {formatPrice(product.price)}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <Checkbox id={`select-${product.id}`} checked={isSelected} readOnly className="pointer-events-none" />
              <span className="text-sm font-medium text-gray-700">
                {isSelected ? "Selecionado" : "Clique para selecionar"}
              </span>
            </div>

            {/* WhatsApp Button */}
            <Button
              data-whatsapp="true"
              onClick={(e) => {
                e.stopPropagation()
                onWhatsAppClick(product)
              }}
              className="flex items-center space-x-2 text-white font-medium"
              style={{ backgroundColor: "#25D366" }}
            >
              <MessageCircle size={16} />
              <span className="hidden sm:inline">Comprar</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
