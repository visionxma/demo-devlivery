"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Repeat, Clock, ShoppingCart, X, Sparkles } from "lucide-react"

interface OrderItem {
  id: string
  name: string
  brand: string
  price: number
  quantity: number
}

interface Order {
  id: string
  date: string
  items: OrderItem[]
  total: number
  paymentMethod: string
  deliveryType: string
  deliveryAddress?: string
  customerName: string
  customerPhone: string
  status: "completed"
}

interface RecurringOrderProps {
  customerData: { name: string; phone: string; address: string } | null
  onRecurringOrder: (productIds: string[]) => void
}

export default function RecurringOrder({ customerData, onRecurringOrder }: RecurringOrderProps) {
  const [lastOrder, setLastOrder] = useState<Order | null>(null)
  const [showRecurringDialog, setShowRecurringDialog] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (customerData && !dismissed) {
      const savedOrders = localStorage.getItem(`atacarejo-orders-${customerData.phone}`)
      if (savedOrders) {
        try {
          const orders: Order[] = JSON.parse(savedOrders)
          if (orders.length > 0) {
            const mostRecentOrder = orders[0]
            // Only show if the last order was more than 1 hour ago
            const lastOrderDate = new Date(mostRecentOrder.date)
            const now = new Date()
            const hoursDiff = (now.getTime() - lastOrderDate.getTime()) / (1000 * 60 * 60)

            if (hoursDiff >= 1) {
              setLastOrder(mostRecentOrder)
              // Auto-show dialog after 2 seconds
              setTimeout(() => {
                setShowRecurringDialog(true)
              }, 2000)
            }
          }
        } catch (error) {
          console.error("Error loading order history:", error)
        }
      }
    }
  }, [customerData, dismissed])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const daysDiff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (daysDiff === 0) {
      return "Hoje"
    } else if (daysDiff === 1) {
      return "Ontem"
    } else if (daysDiff < 7) {
      return `${daysDiff} dias atrás`
    } else {
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    }
  }

  const handleRepeatOrder = () => {
    if (lastOrder) {
      setIsAnimating(true)

      const productIds = lastOrder.items.map((item) => item.id)
      onRecurringOrder(productIds)
      setShowRecurringDialog(false)
      setDismissed(true)

      setTimeout(() => setIsAnimating(false), 1000)
    }
  }

  const handleDismiss = () => {
    setDismissed(true)
    setShowRecurringDialog(false)
  }

  if (!customerData || !lastOrder || dismissed) {
    return null
  }

  return (
    <>
      {/* Quick Reorder Card */}
      <Card
        className={`mb-6 border-2 transition-all duration-300 ${isAnimating ? "scale-105 shadow-lg" : ""}`}
        style={{ borderColor: "#25D366" }}
      >
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Repeat className="h-5 w-5" style={{ color: "#25D366" }} />
                <Sparkles className="h-3 w-3 absolute -top-1 -right-1 text-yellow-500 animate-pulse" />
              </div>
              <span className="text-lg">Repetir Último Pedido?</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>Último pedido: {formatDate(lastOrder.date)}</span>
              <Badge variant="secondary" className="text-xs">
                {lastOrder.items.length} {lastOrder.items.length === 1 ? "item" : "itens"}
              </Badge>
            </div>

            <div className="text-sm space-y-1">
              {lastOrder.items.slice(0, 2).map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span>
                    {item.quantity}x {item.name} {item.brand}
                  </span>
                  <span className="font-semibold" style={{ color: "#4FA3D1" }}>
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
              {lastOrder.items.length > 2 && (
                <div className="text-gray-500 text-xs">
                  +{lastOrder.items.length - 2} {lastOrder.items.length - 2 === 1 ? "item" : "itens"}
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-2 border-t">
              <span className="font-semibold">Total:</span>
              <span className="font-bold text-lg" style={{ color: "#4FA3D1" }}>
                {formatPrice(lastOrder.total)}
              </span>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleRepeatOrder}
                className={`flex-1 text-white font-medium transition-all duration-200 ${isAnimating ? "scale-95" : ""}`}
                style={{ backgroundColor: "#25D366" }}
                disabled={isAnimating}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {isAnimating ? "Adicionando..." : "Repetir Pedido"}
              </Button>
              <Button onClick={() => setShowRecurringDialog(true)} variant="outline" className="bg-transparent">
                Ver Detalhes
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recurring Order Dialog */}
      <Dialog open={showRecurringDialog} onOpenChange={setShowRecurringDialog}>
        <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Repeat className="h-5 w-5" style={{ color: "#25D366" }} />
              Repetir Último Pedido
            </DialogTitle>
            <DialogDescription>Pedido realizado em {formatDate(lastOrder.date)}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Order Items */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Itens do Pedido</h4>
              <div className="space-y-2">
                {lastOrder.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div>
                      <span className="font-medium">
                        {item.quantity}x {item.name}
                      </span>
                      <div className="text-sm text-gray-600">{item.brand}</div>
                    </div>
                    <span className="font-semibold" style={{ color: "#4FA3D1" }}>
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center pt-2 border-t mt-2">
                <span className="font-semibold">Total:</span>
                <span className="font-bold text-lg" style={{ color: "#4FA3D1" }}>
                  {formatPrice(lastOrder.total)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button
                onClick={handleRepeatOrder}
                className="w-full text-white font-medium"
                style={{ backgroundColor: "#25D366" }}
                disabled={isAnimating}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {isAnimating ? "Adicionando ao Carrinho..." : "Adicionar ao Carrinho"}
              </Button>
              <p className="text-xs text-gray-500 text-center">
                Os itens serão adicionados ao seu carrinho. Você poderá modificar antes de finalizar.
              </p>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleDismiss} variant="outline" className="flex-1 bg-transparent">
                Não, obrigado
              </Button>
              <Button onClick={() => setShowRecurringDialog(false)} variant="outline" className="flex-1 bg-transparent">
                Decidir depois
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
