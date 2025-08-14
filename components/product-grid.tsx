"use client"

import { useState, useEffect } from "react"
import ProductCard, { type Product } from "./product-card"
import { Button } from "@/components/ui/button"
import {
  MessageCircle,
  ShoppingCart,
  CreditCard,
  Banknote,
  Smartphone,
  Truck,
  Store,
  MapPin,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const PRODUCTS: Product[] = [
  // Gas Products
  {
    id: "gas-ultragaz-13kg",
    name: "Botijão de Gás 13kg",
    brand: "Ultragaz",
    price: 120.0,
    image: "/ultragaz-blue-gas-cylinder.png",
    category: "gas",
  },
  {
    id: "gas-liquigas-13kg",
    name: "Botijão de Gás 13kg",
    brand: "Liquigás",
    price: 118.0,
    image: "/botijao-gas-liquigas-laranja.png",
    category: "gas",
  },
  {
    id: "gas-copagaz-13kg",
    name: "Botijão de Gás 13kg",
    brand: "Copagaz",
    price: 115.0,
    image: "/botijao-gas-copagaz-verde.png",
    category: "gas",
  },
  // Water Products
  {
    id: "water-cristalina-20l",
    name: "Galão de Água 20L",
    brand: "Cristalina",
    price: 8.0,
    image: "/galao-agua-cristalina-20-litros.png",
    category: "water",
  },
  {
    id: "water-indaia-20l",
    name: "Galão de Água 20L",
    brand: "Indaiá",
    price: 9.0,
    image: "/galao-agua-indaia-20-litros.png",
    category: "water",
  },
  {
    id: "water-bonafont-20l",
    name: "Galão de Água 20L",
    brand: "Bonafont",
    price: 8.5,
    image: "/bonafont-20-litros-galao.png",
    category: "water",
  },
]

interface CustomerData {
  name: string
  phone: string
  address: string
}

interface Address {
  id: string
  name: string
  address: string
  isDefault: boolean
}

interface ProductGridProps {
  customerData: CustomerData | null
  recurringOrderProducts?: string[]
  customerAddresses?: Address[]
}

const saveOrderToHistory = (
  customerData: CustomerData,
  selectedProducts: Set<string>,
  paymentMethod: string,
  deliveryType: string,
  deliveryAddress: string,
  isIndividual = false,
  individualProduct?: Product,
) => {
  if (!customerData) return

  const orderItems =
    isIndividual && individualProduct
      ? [
          {
            id: individualProduct.id,
            name: individualProduct.name,
            brand: individualProduct.brand,
            price: individualProduct.price,
            quantity: 1,
          },
        ]
      : (Array.from(selectedProducts)
          .map((productId) => {
            const product = PRODUCTS.find((p) => p.id === productId)
            return product
              ? {
                  id: product.id,
                  name: product.name,
                  brand: product.brand,
                  price: product.price,
                  quantity: 1,
                }
              : null
          })
          .filter(Boolean) as any[])

  const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const order = {
    id: `order-${Date.now()}`,
    date: new Date().toISOString(),
    items: orderItems,
    total,
    paymentMethod,
    deliveryType,
    deliveryAddress: deliveryType === "entrega" ? deliveryAddress : undefined,
    customerName: customerData.name,
    customerPhone: customerData.phone,
    status: "completed" as const,
  }

  // Save to localStorage using customer phone as key
  const existingOrders = localStorage.getItem(`atacarejo-orders-${customerData.phone}`)
  const orders = existingOrders ? JSON.parse(existingOrders) : []
  orders.unshift(order) // Add to beginning of array (most recent first)

  // Keep only last 20 orders to prevent localStorage from getting too large
  if (orders.length > 20) {
    orders.splice(20)
  }

  localStorage.setItem(`atacarejo-orders-${customerData.phone}`, JSON.stringify(orders))
}

export default function ProductGrid({
  customerData,
  recurringOrderProducts = [],
  customerAddresses = [],
}: ProductGridProps) {
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set())
  const [paymentMethod, setPaymentMethod] = useState<string>("pix")
  const [deliveryType, setDeliveryType] = useState<string>("entrega")
  const [selectedAddressId, setSelectedAddressId] = useState<string>("")
  const [customAddress, setCustomAddress] = useState<string>("")
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false)
  const [showLoadingDialog, setShowLoadingDialog] = useState(false)
  const [showIndividualDialog, setShowIndividualDialog] = useState(false)
  const [selectedIndividualProduct, setSelectedIndividualProduct] = useState<Product | null>(null)

  useEffect(() => {
    if (customerAddresses.length > 0 && selectedAddressId === "") {
      const defaultAddress = customerAddresses.find((addr) => addr.isDefault) || customerAddresses[0]
      setSelectedAddressId(defaultAddress.id)
    }
  }, [customerAddresses])

  useEffect(() => {
    if (recurringOrderProducts.length > 0) {
      const newSelection = new Set(recurringOrderProducts)
      // Only update if the selection actually changed
      if (
        newSelection.size !== selectedProducts.size ||
        !Array.from(newSelection).every((id) => selectedProducts.has(id))
      ) {
        setSelectedProducts(newSelection)
      }
    }
  }, [recurringOrderProducts])

  const handleSelectionChange = (productId: string, selected: boolean) => {
    const newSelected = new Set(selectedProducts)
    if (selected) {
      newSelected.add(productId)
    } else {
      newSelected.delete(productId)
    }
    setSelectedProducts(newSelected)
  }

  const handleSingleWhatsApp = (product: Product) => {
    setSelectedIndividualProduct(product)
    // Reset address selection for individual purchase
    if (customerAddresses.length > 0) {
      const defaultAddress = customerAddresses.find((addr) => addr.isDefault) || customerAddresses[0]
      setSelectedAddressId(defaultAddress.id)
    }
    setCustomAddress("")
    setShowIndividualDialog(true)
  }

  const getDeliveryAddress = () => {
    if (deliveryType === "retirada") return ""

    if (selectedAddressId === "custom") {
      return customAddress
    }

    const selectedAddress = customerAddresses.find((addr) => addr.id === selectedAddressId)
    return selectedAddress ? selectedAddress.address : customAddress
  }

  const handleIndividualPurchase = () => {
    if (!selectedIndividualProduct) return

    const deliveryAddress = getDeliveryAddress()

    let message = `Olá Atacarejo São Manoel, gostaria de comprar:\n- 1 ${selectedIndividualProduct.name} ${selectedIndividualProduct.brand} – ${formatPrice(selectedIndividualProduct.price)}`

    if (customerData) {
      message += `\n\n*Cliente:* ${customerData.name}\n*Telefone:* ${customerData.phone}`
    }

    message += `\n\n*Forma de pagamento:* ${getPaymentMethodText(paymentMethod)}\n*Tipo:* ${getDeliveryTypeText(deliveryType)}`

    if (deliveryType === "entrega" && deliveryAddress.trim()) {
      message += `\n*Endereço:* ${deliveryAddress.trim()}`
    }

    setShowIndividualDialog(false)
    setShowLoadingDialog(true)

    setTimeout(() => {
      const whatsappUrl = `https://wa.me/5599984201432?text=${encodeURIComponent(message)}`
      window.open(whatsappUrl, "_blank")
      setShowLoadingDialog(false)
      setShowConfirmationDialog(true)
    }, 3000)
  }

  const handleBulkWhatsApp = () => {
    if (selectedProducts.size === 0) return

    const deliveryAddress = getDeliveryAddress()

    const selectedItems = Array.from(selectedProducts)
      .map((productId) => {
        const product = PRODUCTS.find((p) => p.id === productId)
        return product ? `- 1 ${product.name} ${product.brand} – ${formatPrice(product.price)}` : ""
      })
      .filter(Boolean)

    const total = Array.from(selectedProducts).reduce((sum, productId) => {
      const product = PRODUCTS.find((p) => p.id === productId)
      return sum + (product?.price || 0)
    }, 0)

    let message = `Olá Atacarejo São Manoel, gostaria de comprar:\n${selectedItems.join("\n")}\n\nTotal: ${formatPrice(total)}`

    if (customerData) {
      message += `\n\n*Cliente:* ${customerData.name}\n*Telefone:* ${customerData.phone}`
    }

    message += `\n\n*Forma de pagamento:* ${getPaymentMethodText(paymentMethod)}\n*Tipo:* ${getDeliveryTypeText(deliveryType)}`

    if (deliveryType === "entrega" && deliveryAddress.trim()) {
      message += `\n*Endereço:* ${deliveryAddress.trim()}`
    }

    setShowPaymentDialog(false)
    setShowLoadingDialog(true)

    setTimeout(() => {
      const whatsappUrl = `https://wa.me/5599984201432?text=${encodeURIComponent(message)}`
      window.open(whatsappUrl, "_blank")
      setShowLoadingDialog(false)
      setShowConfirmationDialog(true)
    }, 3000)
  }

  const handleOrderComplete = () => {
    if (customerData) {
      const deliveryAddress = getDeliveryAddress()

      if (selectedIndividualProduct) {
        saveOrderToHistory(
          customerData,
          new Set(),
          paymentMethod,
          deliveryType,
          deliveryAddress,
          true,
          selectedIndividualProduct,
        )
      } else {
        saveOrderToHistory(customerData, selectedProducts, paymentMethod, deliveryType, deliveryAddress)
      }
    }

    setSelectedProducts(new Set())
    setShowConfirmationDialog(false)
    setPaymentMethod("pix")
    setDeliveryType("entrega")
    setCustomAddress("")
    if (customerAddresses.length > 0) {
      const defaultAddress = customerAddresses.find((addr) => addr.isDefault) || customerAddresses[0]
      setSelectedAddressId(defaultAddress.id)
    }
    setSelectedIndividualProduct(null)
  }

  const handleOpenPaymentDialog = () => {
    // Reset address selection for bulk purchase
    if (customerAddresses.length > 0) {
      const defaultAddress = customerAddresses.find((addr) => addr.isDefault) || customerAddresses[0]
      setSelectedAddressId(defaultAddress.id)
    }
    setCustomAddress("")
    setShowPaymentDialog(true)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
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
        return "PIX"
    }
  }

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case "pix":
        return <Smartphone size={20} />
      case "dinheiro":
        return <Banknote size={20} />
      case "cartao":
        return <CreditCard size={20} />
      default:
        return <Smartphone size={20} />
    }
  }

  const getDeliveryTypeText = (type: string) => {
    switch (type) {
      case "entrega":
        return "Entrega"
      case "retirada":
        return "Retirada no local"
      default:
        return "Entrega"
    }
  }

  const getDeliveryIcon = (type: string) => {
    switch (type) {
      case "entrega":
        return <Truck size={20} />
      case "retirada":
        return <Store size={20} />
      default:
        return <Truck size={20} />
    }
  }

  const renderAddressSelection = (dialogType: "bulk" | "individual") => {
    const currentDeliveryAddress = getDeliveryAddress()
    const isAddressRequired =
      deliveryType === "entrega" && (!currentDeliveryAddress || currentDeliveryAddress.trim() === "")

    return (
      <>
        {deliveryType === "entrega" && (
          <div className="space-y-2">
            <Label className="flex items-center gap-2 font-medium text-gray-900">
              <MapPin size={16} />
              Endereço para Entrega
            </Label>

            {customerAddresses.length > 0 ? (
              <div className="space-y-3">
                <Select value={selectedAddressId} onValueChange={setSelectedAddressId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um endereço" />
                  </SelectTrigger>
                  <SelectContent>
                    {customerAddresses.map((address) => (
                      <SelectItem key={address.id} value={address.id}>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{address.name}</span>
                          {address.isDefault && <span className="text-xs text-blue-600">(Padrão)</span>}
                        </div>
                      </SelectItem>
                    ))}
                    <SelectItem value="custom">
                      <div className="flex items-center gap-2">
                        <MapPin size={14} />
                        <span>Outro endereço</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>

                {selectedAddressId === "custom" && (
                  <Textarea
                    placeholder="Digite seu endereço completo (rua, número, bairro, referências...)"
                    value={customAddress}
                    onChange={(e) => setCustomAddress(e.target.value)}
                    className="min-h-[80px] resize-none"
                  />
                )}

                {selectedAddressId && selectedAddressId !== "custom" && (
                  <div className="p-3 bg-gray-50 rounded-lg border">
                    <p className="text-sm text-gray-700">
                      {customerAddresses.find((addr) => addr.id === selectedAddressId)?.address}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <Textarea
                placeholder="Digite seu endereço completo (rua, número, bairro, referências...)"
                value={customAddress}
                onChange={(e) => setCustomAddress(e.target.value)}
                className="min-h-[80px] resize-none"
              />
            )}

            <p className="text-xs text-gray-500">Atendemos apenas a região de Bernardo do Mearim</p>
          </div>
        )}
      </>
    )
  }

  const gasProducts = PRODUCTS.filter((p) => p.category === "gas")
  const waterProducts = PRODUCTS.filter((p) => p.category === "water")

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* Gas Section */}
      <section>
        <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
          <div
            className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "#E63946" }}
          >
            <span className="text-white font-bold text-xs sm:text-sm">G</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Botijões de Gás</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {gasProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isSelected={selectedProducts.has(product.id)}
              onSelectionChange={handleSelectionChange}
              onWhatsAppClick={handleSingleWhatsApp}
            />
          ))}
        </div>
      </section>

      {/* Water Section */}
      <section>
        <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
          <div
            className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "#4FA3D1" }}
          >
            <span className="text-white font-bold text-xs sm:text-sm">A</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Galões de Água</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {waterProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isSelected={selectedProducts.has(product.id)}
              onSelectionChange={handleSelectionChange}
              onWhatsAppClick={handleSingleWhatsApp}
            />
          ))}
        </div>
      </section>

      {/* Bulk Purchase Button */}
      {selectedProducts.size > 0 && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-1/2 sm:right-auto sm:transform sm:-translate-x-1/2 z-50">
          <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
            <DialogTrigger asChild>
              <Button
                size="lg"
                className="w-full sm:w-auto shadow-xl text-white font-bold px-6 sm:px-8 py-4 rounded-full text-base sm:text-lg hover:shadow-2xl transition-all duration-300"
                style={{ backgroundColor: "#25D366" }}
                onClick={handleOpenPaymentDialog}
              >
                <ShoppingCart size={20} className="mr-3" />
                Finalizar Pedido ({selectedProducts.size})
                <MessageCircle size={20} className="ml-3" />
              </Button>
            </DialogTrigger>
            <DialogContent className="mx-4 sm:mx-auto sm:max-w-lg max-h-[85vh] flex flex-col rounded-xl border-0 shadow-2xl">
              <DialogHeader className="text-center pb-4 flex-shrink-0">
                <DialogTitle className="flex items-center justify-center gap-3 text-xl font-bold">
                  <ShoppingCart size={24} style={{ color: "#4FA3D1" }} />
                  Finalizar Pedido
                </DialogTitle>
                <DialogDescription className="text-base text-gray-600 mt-2">
                  Escolha a forma de pagamento e tipo de entrega
                </DialogDescription>
              </DialogHeader>

              <div className="flex-1 overflow-y-auto px-2">
                <div className="space-y-4">
                  <div className="space-y-3">
                    <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                      <Truck size={18} style={{ color: "#4FA3D1" }} />
                      Tipo de Entrega
                    </h3>
                    <RadioGroup value={deliveryType} onValueChange={setDeliveryType} className="space-y-2">
                      <div className="flex items-center space-x-3 p-3 rounded-lg border-2 hover:bg-blue-50 cursor-pointer transition-colors">
                        <RadioGroupItem value="entrega" id="entrega" />
                        <Label htmlFor="entrega" className="flex items-center gap-2 cursor-pointer flex-1">
                          <Truck size={20} style={{ color: "#4FA3D1" }} />
                          <div className="flex-1">
                            <span className="font-semibold">Entrega</span>
                            <p className="text-xs text-gray-500">Em até 30 minutos</p>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 rounded-lg border-2 hover:bg-red-50 cursor-pointer transition-colors">
                        <RadioGroupItem value="retirada" id="retirada" />
                        <Label htmlFor="retirada" className="flex items-center gap-2 cursor-pointer flex-1">
                          <Store size={20} style={{ color: "#E63946" }} />
                          <div className="flex-1">
                            <span className="font-semibold">Retirada no local</span>
                            <p className="text-xs text-gray-500">Retire na loja</p>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {renderAddressSelection("bulk")}

                  <div className="space-y-3">
                    <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                      <CreditCard size={18} style={{ color: "#4FA3D1" }} />
                      Forma de Pagamento
                    </h3>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-2">
                      <div className="flex items-center space-x-3 p-3 rounded-lg border-2 hover:bg-blue-50 cursor-pointer transition-colors">
                        <RadioGroupItem value="pix" id="pix" />
                        <Label htmlFor="pix" className="flex items-center gap-2 cursor-pointer flex-1">
                          <Smartphone size={20} style={{ color: "#4FA3D1" }} />
                          <div className="flex-1">
                            <span className="font-semibold">PIX</span>
                            <p className="text-xs text-gray-500">Instantâneo</p>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 rounded-lg border-2 hover:bg-red-50 cursor-pointer transition-colors">
                        <RadioGroupItem value="dinheiro" id="dinheiro" />
                        <Label htmlFor="dinheiro" className="flex items-center gap-2 cursor-pointer flex-1">
                          <Banknote size={20} style={{ color: "#E63946" }} />
                          <div className="flex-1">
                            <span className="font-semibold">Dinheiro</span>
                            <p className="text-xs text-gray-500">Na entrega</p>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 rounded-lg border-2 hover:bg-blue-50 cursor-pointer transition-colors">
                        <RadioGroupItem value="cartao" id="cartao" />
                        <Label htmlFor="cartao" className="flex items-center gap-2 cursor-pointer flex-1">
                          <CreditCard size={20} style={{ color: "#4FA3D1" }} />
                          <div className="flex-1">
                            <span className="font-semibold">Cartão</span>
                            <p className="text-xs text-gray-500">Débito/crédito</p>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0 pt-4 px-2 border-t bg-white">
                <Button
                  onClick={handleBulkWhatsApp}
                  className="w-full text-white font-bold text-base py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  style={{ backgroundColor: "#25D366" }}
                  disabled={deliveryType === "entrega" && !getDeliveryAddress().trim()}
                >
                  <MessageCircle size={18} className="mr-2" />
                  Enviar Pedido via WhatsApp
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}

      <Dialog open={showIndividualDialog} onOpenChange={setShowIndividualDialog}>
        <DialogContent className="mx-4 sm:mx-auto sm:max-w-lg max-h-[85vh] flex flex-col rounded-xl border-0 shadow-2xl">
          <DialogHeader className="text-center pb-4 flex-shrink-0">
            <DialogTitle className="flex items-center justify-center gap-3 text-xl font-bold">
              <ShoppingCart size={24} style={{ color: "#4FA3D1" }} />
              Comprar Produto
            </DialogTitle>
            <DialogDescription className="text-base text-gray-600 mt-2">
              {selectedIndividualProduct &&
                `${selectedIndividualProduct.name} ${selectedIndividualProduct.brand} - ${formatPrice(selectedIndividualProduct.price)}`}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-2">
            <div className="space-y-4">
              <div className="space-y-3">
                <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                  <Truck size={18} style={{ color: "#4FA3D1" }} />
                  Tipo de Entrega
                </h3>
                <RadioGroup value={deliveryType} onValueChange={setDeliveryType} className="space-y-2">
                  <div className="flex items-center space-x-3 p-3 rounded-lg border-2 hover:bg-blue-50 cursor-pointer transition-colors">
                    <RadioGroupItem value="entrega" id="entrega-individual" />
                    <Label htmlFor="entrega-individual" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Truck size={20} style={{ color: "#4FA3D1" }} />
                      <div className="flex-1">
                        <span className="font-semibold">Entrega</span>
                        <p className="text-xs text-gray-500">Em até 30 minutos</p>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg border-2 hover:bg-red-50 cursor-pointer transition-colors">
                    <RadioGroupItem value="retirada" id="retirada-individual" />
                    <Label htmlFor="retirada-individual" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Store size={20} style={{ color: "#E63946" }} />
                      <div className="flex-1">
                        <span className="font-semibold">Retirada no local</span>
                        <p className="text-xs text-gray-500">Retire na loja</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {renderAddressSelection("individual")}

              <div className="space-y-3">
                <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                  <CreditCard size={18} style={{ color: "#4FA3D1" }} />
                  Forma de Pagamento
                </h3>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-2">
                  <div className="flex items-center space-x-3 p-3 rounded-lg border-2 hover:bg-blue-50 cursor-pointer transition-colors">
                    <RadioGroupItem value="pix" id="pix-individual" />
                    <Label htmlFor="pix-individual" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Smartphone size={20} style={{ color: "#4FA3D1" }} />
                      <div className="flex-1">
                        <span className="font-semibold">PIX</span>
                        <p className="text-xs text-gray-500">Instantâneo</p>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg border-2 hover:bg-red-50 cursor-pointer transition-colors">
                    <RadioGroupItem value="dinheiro" id="dinheiro-individual" />
                    <Label htmlFor="dinheiro-individual" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Banknote size={20} style={{ color: "#E63946" }} />
                      <div className="flex-1">
                        <span className="font-semibold">Dinheiro</span>
                        <p className="text-xs text-gray-500">Na entrega</p>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg border-2 hover:bg-blue-50 cursor-pointer transition-colors">
                    <RadioGroupItem value="cartao" id="cartao-individual" />
                    <Label htmlFor="cartao-individual" className="flex items-center gap-2 cursor-pointer flex-1">
                      <CreditCard size={20} style={{ color: "#4FA3D1" }} />
                      <div className="flex-1">
                        <span className="font-semibold">Cartão</span>
                        <p className="text-xs text-gray-500">Débito/crédito</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 pt-4 px-2 border-t bg-white">
            <Button
              onClick={handleIndividualPurchase}
              className="w-full text-white font-bold text-base py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              style={{ backgroundColor: "#25D366" }}
              disabled={deliveryType === "entrega" && !getDeliveryAddress().trim()}
            >
              <MessageCircle size={18} className="mr-2" />
              Enviar Pedido via WhatsApp
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showLoadingDialog} onOpenChange={() => {}}>
        <DialogContent className="mx-4 sm:mx-auto sm:max-w-md rounded-xl border-0 shadow-2xl" hideCloseButton>
          <DialogHeader className="text-center">
            <DialogTitle className="flex items-center justify-center gap-3 text-xl font-bold">
              <MessageCircle size={24} style={{ color: "#25D366" }} />
              Preparando seu pedido...
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-6">
            <div className="flex flex-col items-center space-y-6">
              <div
                className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-4"
                style={{ borderTopColor: "#25D366" }}
              ></div>

              <div className="text-center space-y-3">
                <p className="text-lg font-semibold text-gray-900">Aguarde um momento...</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Estamos preparando sua mensagem e você será redirecionado para o WhatsApp em instantes.
                </p>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="h-3 rounded-full transition-all duration-3000 ease-linear"
                  style={{
                    backgroundColor: "#25D366",
                    width: "100%",
                    animation: "progress 3s linear forwards",
                  }}
                ></div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showConfirmationDialog} onOpenChange={setShowConfirmationDialog}>
        <DialogContent className="mx-4 sm:mx-auto sm:max-w-md rounded-xl border-0 shadow-2xl">
          <DialogHeader className="text-center">
            <DialogTitle className="flex items-center justify-center gap-3 text-xl font-bold">
              <MessageCircle size={24} style={{ color: "#25D366" }} />
              Confirmar Envio
            </DialogTitle>
            <DialogDescription className="text-base text-gray-600 mt-2">
              Seu pedido foi enviado para o WhatsApp. Certifique-se de que a mensagem foi enviada com sucesso.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="flex items-start gap-4 p-4 bg-green-50 rounded-xl border-2 border-green-200">
              <AlertCircle size={24} className="text-green-600 flex-shrink-0 mt-1" />
              <div className="text-sm text-green-800">
                <p className="font-semibold text-base mb-1">Verifique se a mensagem foi enviada</p>
                <p>Confirme que sua mensagem chegou ao WhatsApp do Atacarejo São Manoel</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowConfirmationDialog(false)}
                className="flex-1 font-semibold py-3 rounded-xl border-2"
              >
                Tentar Novamente
              </Button>
              <Button
                onClick={handleOrderComplete}
                className="flex-1 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                style={{ backgroundColor: "#25D366" }}
              >
                <CheckCircle size={18} className="mr-2" />
                Mensagem Enviada
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
