"use client"

import { useState } from "react"
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

const PRODUCTS: Product[] = [
  // Gas Products
  {
    id: "gas-ultragaz-13kg",
    name: "Botijão de Gás 13kg",
    brand: "Ultragaz",
    price: 120.0,
    image: "./ultragaz-blue-gas-cylinder.png",
    category: "gas",
  },
  {
    id: "gas-liquigas-13kg",
    name: "Botijão de Gás 13kg",
    brand: "Liquigás",
    price: 118.0,
    image: "./botijao-gas-liquigas-laranja.png",
    category: "gas",
  },
  {
    id: "gas-copagaz-13kg",
    name: "Botijão de Gás 13kg",
    brand: "Copagaz",
    price: 115.0,
    image: "./botijao-gas-copagaz-verde.png",
    category: "gas",
  },
  // Water Products
  {
    id: "water-cristalina-20l",
    name: "Galão de Água 20L",
    brand: "Cristalina",
    price: 8.0,
    image: "./galao-agua-cristalina-20-litros.png",
    category: "water",
  },
  {
    id: "water-indaia-20l",
    name: "Galão de Água 20L",
    brand: "Indaiá",
    price: 9.0,
    image: "./galao-agua-indaia-20-litros.png",
    category: "water",
  },
  {
    id: "water-bonafont-20l",
    name: "Galão de Água 20L",
    brand: "Bonafont",
    price: 8.5,
    image: "./bonafont-20-litros-galao.png",
    category: "water",
  },
]

export default function ProductGrid() {
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set())
  const [paymentMethod, setPaymentMethod] = useState<string>("pix")
  const [deliveryType, setDeliveryType] = useState<string>("entrega")
  const [deliveryAddress, setDeliveryAddress] = useState<string>("")
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false)
  const [showLoadingDialog, setShowLoadingDialog] = useState(false)
  const [showIndividualDialog, setShowIndividualDialog] = useState(false)
  const [selectedIndividualProduct, setSelectedIndividualProduct] = useState<Product | null>(null)

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
    setShowIndividualDialog(true)
  }

  const handleIndividualPurchase = () => {
    if (!selectedIndividualProduct) return

    let message = `Olá Atacarejo São Manoel, gostaria de comprar:\n- 1 ${selectedIndividualProduct.name} ${selectedIndividualProduct.brand} – ${formatPrice(selectedIndividualProduct.price)}\n\n*Forma de pagamento:* ${getPaymentMethodText(paymentMethod)}\n*Tipo:* ${getDeliveryTypeText(deliveryType)}`

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

    let message = `Olá Atacarejo São Manoel, gostaria de comprar:\n${selectedItems.join("\n")}\n\nTotal: ${formatPrice(total)}\n\n*Forma de pagamento:* ${getPaymentMethodText(paymentMethod)}\n*Tipo:* ${getDeliveryTypeText(deliveryType)}`

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
    setSelectedProducts(new Set())
    setShowConfirmationDialog(false)
    setPaymentMethod("pix")
    setDeliveryType("entrega")
    setDeliveryAddress("")
    setSelectedIndividualProduct(null)
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

  const gasProducts = PRODUCTS.filter((p) => p.category === "gas")
  const waterProducts = PRODUCTS.filter((p) => p.category === "water")

  return (
    <div className="space-y-12">
      {/* Gas Section */}
      <section>
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: "#E63946" }}>
            <span className="text-white font-bold text-sm">G</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Botijões de Gás</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: "#4FA3D1" }}>
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Galões de Água</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
            <DialogTrigger asChild>
              <Button
                size="lg"
                className="shadow-lg text-white font-semibold px-6 py-3 rounded-full"
                style={{ backgroundColor: "#25D366" }}
              >
                <ShoppingCart size={20} className="mr-2" />
                Finalizar Compra ({selectedProducts.size} {selectedProducts.size === 1 ? "item" : "itens"})
                <MessageCircle size={20} className="ml-2" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <ShoppingCart size={20} />
                  Finalizar Pedido
                </DialogTitle>
                <DialogDescription>Escolha a forma de pagamento e tipo de entrega</DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                {/* Delivery Type Selection */}
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-900">Tipo de Entrega</h3>
                  <RadioGroup value={deliveryType} onValueChange={setDeliveryType}>
                    <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer">
                      <RadioGroupItem value="entrega" id="entrega" />
                      <Label htmlFor="entrega" className="flex items-center gap-2 cursor-pointer flex-1">
                        <Truck size={20} style={{ color: "#4FA3D1" }} />
                        <span className="font-medium">Entrega</span>
                        <span className="text-sm text-gray-500 ml-auto">30 minutos</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer">
                      <RadioGroupItem value="retirada" id="retirada" />
                      <Label htmlFor="retirada" className="flex items-center gap-2 cursor-pointer flex-1">
                        <Store size={20} style={{ color: "#E63946" }} />
                        <span className="font-medium">Retirada no local</span>
                        <span className="text-sm text-gray-500 ml-auto">Imediato</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Address Input for Delivery */}
                {deliveryType === "entrega" && (
                  <div className="space-y-2">
                    <Label htmlFor="address" className="flex items-center gap-2 font-medium text-gray-900">
                      <MapPin size={16} />
                      Endereço para Entrega
                    </Label>
                    <Textarea
                      id="address"
                      placeholder="Digite seu endereço completo (rua, número, bairro, referências...)"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="min-h-[80px] resize-none"
                    />
                    <p className="text-xs text-gray-500">Atendemos apenas a região de Bernardo do Mearim</p>
                  </div>
                )}

                {/* Payment Method Selection */}
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-900">Forma de Pagamento</h3>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer">
                      <RadioGroupItem value="pix" id="pix" />
                      <Label htmlFor="pix" className="flex items-center gap-2 cursor-pointer flex-1">
                        <Smartphone size={20} style={{ color: "#4FA3D1" }} />
                        <span className="font-medium">PIX</span>
                        <span className="text-sm text-gray-500 ml-auto">Instantâneo</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer">
                      <RadioGroupItem value="dinheiro" id="dinheiro" />
                      <Label htmlFor="dinheiro" className="flex items-center gap-2 cursor-pointer flex-1">
                        <Banknote size={20} style={{ color: "#E63946" }} />
                        <span className="font-medium">Dinheiro</span>
                        <span className="text-sm text-gray-500 ml-auto">Na entrega</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer">
                      <RadioGroupItem value="cartao" id="cartao" />
                      <Label htmlFor="cartao" className="flex items-center gap-2 cursor-pointer flex-1">
                        <CreditCard size={20} style={{ color: "#4FA3D1" }} />
                        <span className="font-medium">Cartão</span>
                        <span className="text-sm text-gray-500 ml-auto">Débito/Crédito</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Confirm Button */}
                <Button
                  onClick={handleBulkWhatsApp}
                  className="w-full text-white font-semibold"
                  style={{ backgroundColor: "#25D366" }}
                  disabled={deliveryType === "entrega" && !deliveryAddress.trim()}
                >
                  {getDeliveryIcon(deliveryType)}
                  <span className="ml-2">Enviar Pedido via WhatsApp</span>
                  <MessageCircle size={20} className="ml-2" />
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}

      <Dialog open={showIndividualDialog} onOpenChange={setShowIndividualDialog}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingCart size={20} />
              Comprar Produto
            </DialogTitle>
            <DialogDescription>
              {selectedIndividualProduct &&
                `${selectedIndividualProduct.name} ${selectedIndividualProduct.brand} - ${formatPrice(selectedIndividualProduct.price)}`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {/* Delivery Type Selection */}
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900">Tipo de Entrega</h3>
              <RadioGroup value={deliveryType} onValueChange={setDeliveryType}>
                <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="entrega" id="entrega-individual" />
                  <Label htmlFor="entrega-individual" className="flex items-center gap-2 cursor-pointer flex-1">
                    <Truck size={20} style={{ color: "#4FA3D1" }} />
                    <span className="font-medium">Entrega</span>
                    <span className="text-sm text-gray-500 ml-auto">30 minutos</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="retirada" id="retirada-individual" />
                  <Label htmlFor="retirada-individual" className="flex items-center gap-2 cursor-pointer flex-1">
                    <Store size={20} style={{ color: "#E63946" }} />
                    <span className="font-medium">Retirada no local</span>
                    <span className="text-sm text-gray-500 ml-auto">Imediato</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Address Input for Delivery */}
            {deliveryType === "entrega" && (
              <div className="space-y-2">
                <Label htmlFor="address-individual" className="flex items-center gap-2 font-medium text-gray-900">
                  <MapPin size={16} />
                  Endereço para Entrega
                </Label>
                <Textarea
                  id="address-individual"
                  placeholder="Digite seu endereço completo (rua, número, bairro, referências...)"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="min-h-[80px] resize-none"
                />
                <p className="text-xs text-gray-500">Atendemos apenas a região de Bernardo do Mearim</p>
              </div>
            )}

            {/* Payment Method Selection */}
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900">Forma de Pagamento</h3>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="pix" id="pix-individual" />
                  <Label htmlFor="pix-individual" className="flex items-center gap-2 cursor-pointer flex-1">
                    <Smartphone size={20} style={{ color: "#4FA3D1" }} />
                    <span className="font-medium">PIX</span>
                    <span className="text-sm text-gray-500 ml-auto">Instantâneo</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="dinheiro" id="dinheiro-individual" />
                  <Label htmlFor="dinheiro-individual" className="flex items-center gap-2 cursor-pointer flex-1">
                    <Banknote size={20} style={{ color: "#E63946" }} />
                    <span className="font-medium">Dinheiro</span>
                    <span className="text-sm text-gray-500 ml-auto">Na entrega</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="cartao" id="cartao-individual" />
                  <Label htmlFor="cartao-individual" className="flex items-center gap-2 cursor-pointer flex-1">
                    <CreditCard size={20} style={{ color: "#4FA3D1" }} />
                    <span className="font-medium">Cartão</span>
                    <span className="text-sm text-gray-500 ml-auto">Débito/Crédito</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Confirm Button */}
            <Button
              onClick={handleIndividualPurchase}
              className="w-full text-white font-semibold"
              style={{ backgroundColor: "#25D366" }}
              disabled={deliveryType === "entrega" && !deliveryAddress.trim()}
            >
              {getDeliveryIcon(deliveryType)}
              <span className="ml-2">Enviar Pedido via WhatsApp</span>
              <MessageCircle size={20} className="ml-2" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Loading Dialog */}
      <Dialog open={showLoadingDialog} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md" hideCloseButton>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 justify-center">
              <MessageCircle size={20} style={{ color: "#25D366" }} />
              Preparando seu pedido...
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="flex flex-col items-center space-y-4">
              {/* Loading spinner */}
              <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: "#25D366" }}></div>

              <div className="text-center space-y-2">
                <p className="text-lg font-medium text-gray-900">Aguarde um momento...</p>
                <p className="text-sm text-gray-600">
                  Estamos preparando sua mensagem e você será redirecionado para o WhatsApp em instantes.
                </p>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-3000 ease-linear"
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

      {/* WhatsApp Confirmation Dialog */}
      <Dialog open={showConfirmationDialog} onOpenChange={setShowConfirmationDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle size={20} style={{ color: "#25D366" }} />
              Confirmar Envio
            </DialogTitle>
            <DialogDescription>
              Seu pedido foi enviado para o WhatsApp. Certifique-se de que a mensagem foi enviada com sucesso.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
              <AlertCircle size={20} className="text-green-600 flex-shrink-0" />
              <div className="text-sm text-green-800">
                <p className="font-medium">Verifique se a mensagem foi enviada</p>
                <p>Confirme que sua mensagem chegou ao WhatsApp do Atacarejo São Manoel</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowConfirmationDialog(false)} className="flex-1">
                Tentar Novamente
              </Button>
              <Button
                onClick={handleOrderComplete}
                className="flex-1 text-white"
                style={{ backgroundColor: "#25D366" }}
              >
                <CheckCircle size={16} className="mr-2" />
                Mensagem Enviada
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
