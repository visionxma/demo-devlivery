"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { History, Clock, MapPin, CreditCard, Package, MessageCircle } from "lucide-react"

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

interface OrderHistoryProps {
  customerData: { name: string; phone: string; address: string } | null
}

export default function OrderHistory({ customerData }: OrderHistoryProps) {
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showOrderDetails, setShowOrderDetails] = useState(false)

  // Load order history from localStorage
  useEffect(() => {
    if (customerData) {
      const savedOrders = localStorage.getItem(`atacarejo-orders-${customerData.phone}`)
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders))
      }
    }
  }, [customerData])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case "pix":
        return "PIX"
      case "dinheiro":
        return "Dinheiro"
      case "cartao":
        return "Cartão"
      default:
        return method
    }
  }

  const getDeliveryTypeText = (type: string) => {
    switch (type) {
      case "entrega":
        return "Entrega"
      case "retirada":
        return "Retirada"
      default:
        return type
    }
  }

  const handleReorder = (order: Order) => {
    // Create WhatsApp message for reorder
    const itemsList = order.items
      .map((item) => `- ${item.quantity} ${item.name} ${item.brand} – ${formatPrice(item.price * item.quantity)}`)
      .join("\n")

    let message = `Olá Atacarejo São Manoel, gostaria de repetir meu pedido:\n${itemsList}\n\nTotal: ${formatPrice(order.total)}`
    message += `\n\n*Cliente:* ${order.customerName}\n*Telefone:* ${order.customerPhone}`
    message += `\n\n*Forma de pagamento:* ${getPaymentMethodText(order.paymentMethod)}`
    message += `\n*Tipo:* ${getDeliveryTypeText(order.deliveryType)}`

    if (order.deliveryType === "entrega" && order.deliveryAddress) {
      message += `\n*Endereço:* ${order.deliveryAddress}`
    }

    message += `\n\n*Obs:* Repetindo pedido do dia ${formatDate(order.date)}`

    const whatsappUrl = `https://wa.me/5599984201432?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order)
    setShowOrderDetails(true)
  }

  if (!customerData || orders.length === 0) {
    return null
  }

  return (
    <div className="mb-8 px-2">
      <Card className="shadow-lg border-0">
        <CardHeader className="pb-4 px-4">
          <CardTitle className="flex items-center gap-3 text-xl font-bold">
            <History className="h-6 w-6" style={{ color: "#4FA3D1" }} />
            Histórico de Pedidos ({orders.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4">
          <div className="space-y-4">
            {orders.slice(0, 3).map((order) => (
              <div
                key={order.id}
                className="p-4 bg-white rounded-xl border-2 border-gray-100 hover:border-blue-200 transition-all duration-200 shadow-sm"
              >
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-gray-500" />
                    <span className="text-base font-semibold text-gray-900">{formatDate(order.date)}</span>
                    <Badge variant="secondary" className="text-sm px-2 py-1">
                      {order.items.length} {order.items.length === 1 ? "item" : "itens"}
                    </Badge>
                  </div>
                  <div className="text-base text-gray-700">
                    Total:{" "}
                    <span className="font-bold text-lg" style={{ color: "#4FA3D1" }}>
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={() => handleViewDetails(order)}
                    variant="outline"
                    className="flex-1 h-12 text-base font-medium border-2 hover:bg-gray-50"
                  >
                    Ver Detalhes
                  </Button>
                  <Button
                    onClick={() => handleReorder(order)}
                    className="flex-1 h-12 text-base font-medium text-white shadow-md hover:shadow-lg transition-shadow"
                    style={{ backgroundColor: "#25D366" }}
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Repetir Pedido
                  </Button>
                </div>
              </div>
            ))}

            {orders.length > 3 && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full h-12 mt-4 text-base font-medium border-2 bg-white hover:bg-gray-50"
                  >
                    Ver Todos os Pedidos ({orders.length})
                  </Button>
                </DialogTrigger>
                <DialogContent className="mx-4 max-w-[calc(100vw-2rem)] sm:max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl">
                  <DialogHeader className="pb-4">
                    <DialogTitle className="flex items-center gap-3 text-xl">
                      <History className="h-6 w-6" style={{ color: "#4FA3D1" }} />
                      Histórico Completo
                    </DialogTitle>
                    <DialogDescription className="text-base">Todos os seus pedidos anteriores</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                        <div className="mb-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Clock className="h-5 w-5 text-gray-500" />
                            <span className="text-base font-semibold text-gray-900">{formatDate(order.date)}</span>
                            <Badge variant="secondary" className="text-sm">
                              {order.items.length} {order.items.length === 1 ? "item" : "itens"}
                            </Badge>
                          </div>
                          <div className="text-base text-gray-700">
                            Total:{" "}
                            <span className="font-bold" style={{ color: "#4FA3D1" }}>
                              {formatPrice(order.total)}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                          <Button
                            onClick={() => handleViewDetails(order)}
                            variant="outline"
                            className="flex-1 h-11 text-base border-2"
                          >
                            Detalhes
                          </Button>
                          <Button
                            onClick={() => handleReorder(order)}
                            className="flex-1 h-11 text-base text-white"
                            style={{ backgroundColor: "#25D366" }}
                          >
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Repetir
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showOrderDetails} onOpenChange={setShowOrderDetails}>
        <DialogContent className="mx-4 max-w-[calc(100vw-2rem)] sm:max-w-md max-h-[85vh] overflow-y-auto rounded-2xl">
          <DialogHeader className="pb-4">
            <DialogTitle className="flex items-center gap-3 text-xl">
              <Package className="h-6 w-6" style={{ color: "#4FA3D1" }} />
              Detalhes do Pedido
            </DialogTitle>
            <DialogDescription className="text-base">
              {selectedOrder && formatDate(selectedOrder.date)}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              {/* Items */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 text-lg">Itens do Pedido</h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                      <div>
                        <span className="font-semibold text-base">
                          {item.quantity}x {item.name}
                        </span>
                        <div className="text-sm text-gray-600 mt-1">{item.brand}</div>
                      </div>
                      <span className="font-bold text-base" style={{ color: "#4FA3D1" }}>
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center pt-4 border-t-2 mt-4">
                  <span className="font-bold text-lg">Total:</span>
                  <span className="font-bold text-xl" style={{ color: "#4FA3D1" }}>
                    {formatPrice(selectedOrder.total)}
                  </span>
                </div>
              </div>

              {/* Payment and Delivery Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <CreditCard className="h-5 w-5 text-gray-500" />
                  <span className="text-base">
                    <strong>Pagamento:</strong> {getPaymentMethodText(selectedOrder.paymentMethod)}
                  </span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Package className="h-5 w-5 text-gray-500" />
                  <span className="text-base">
                    <strong>Tipo:</strong> {getDeliveryTypeText(selectedOrder.deliveryType)}
                  </span>
                </div>
                {selectedOrder.deliveryAddress && (
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                    <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                    <span className="text-base">
                      <strong>Endereço:</strong> {selectedOrder.deliveryAddress}
                    </span>
                  </div>
                )}
              </div>

              <Button
                onClick={() => {
                  handleReorder(selectedOrder)
                  setShowOrderDetails(false)
                }}
                className="w-full h-14 text-lg font-semibold text-white shadow-lg hover:shadow-xl transition-shadow rounded-xl"
                style={{ backgroundColor: "#25D366" }}
              >
                <MessageCircle className="h-5 w-5 mr-3" />
                Repetir este Pedido
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
