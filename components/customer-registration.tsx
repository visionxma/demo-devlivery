"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { User, UserPlus, Edit, CheckCircle } from "lucide-react"

interface CustomerData {
  name: string
  phone: string
  address: string
}

interface CustomerRegistrationProps {
  onCustomerData: (data: CustomerData | null) => void
}

export default function CustomerRegistration({ onCustomerData }: CustomerRegistrationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [customerData, setCustomerData] = useState<CustomerData | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  })
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    const savedData = localStorage.getItem("atacarejo-customer")
    if (savedData) {
      try {
        const data = JSON.parse(savedData)
        setCustomerData(data)
        onCustomerData(data)
      } catch (error) {
        console.error("Error loading customer data:", error)
        localStorage.removeItem("atacarejo-customer")
      }
    }
  }, []) // Removed onCustomerData from dependency array to prevent infinite loop

  useEffect(() => {
    onCustomerData(customerData)
  }, [customerData, onCustomerData])

  const handleSave = () => {
    if (formData.name && formData.phone) {
      const newCustomerData = { ...formData }
      setCustomerData(newCustomerData)
      localStorage.setItem("atacarejo-customer", JSON.stringify(newCustomerData))
      setIsOpen(false)

      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    }
  }

  const handleEdit = () => {
    if (customerData) {
      setFormData(customerData)
      setIsOpen(true)
    }
  }

  const handleClear = () => {
    const phoneKey = customerData?.phone
    setCustomerData(null)
    setFormData({ name: "", phone: "", address: "" })
    localStorage.removeItem("atacarejo-customer")

    if (phoneKey) {
      localStorage.removeItem(`atacarejo-orders-${phoneKey}`)
      localStorage.removeItem(`atacarejo-addresses-${phoneKey}`)
    }
  }

  return (
    <div className="mb-6">
      {showSuccess && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <span className="text-green-800 font-medium">Dados salvos com sucesso!</span>
        </div>
      )}

      {customerData ? (
        <Card className="border-2" style={{ borderColor: "#4FA3D1" }}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5" style={{ color: "#4FA3D1" }} />
              Cliente Cadastrado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Nome:</strong> {customerData.name}
              </p>
              <p>
                <strong>Telefone:</strong> {customerData.phone}
              </p>
              {customerData.address && (
                <p>
                  <strong>Endereço:</strong> {customerData.address}
                </p>
              )}
            </div>
            <div className="flex gap-2 mt-4">
              <Button
                onClick={handleEdit}
                variant="outline"
                size="sm"
                className="flex items-center gap-1 bg-transparent"
              >
                <Edit className="h-4 w-4" />
                Editar
              </Button>
              <Button
                onClick={handleClear}
                variant="outline"
                size="sm"
                style={{ color: "#E63946", borderColor: "#E63946" }}
              >
                Limpar
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="w-full mb-4 h-12 text-white font-medium" style={{ backgroundColor: "#4FA3D1" }}>
              <UserPlus className="h-5 w-5 mr-2" />
              Cadastro Rápido - Agilize seus pedidos!
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" style={{ color: "#4FA3D1" }} />
                Cadastro Rápido
              </DialogTitle>
              <DialogDescription>Salve seus dados para agilizar pedidos futuros</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Seu nome completo"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="phone">Telefone *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(99) 99999-9999"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="address">Endereço (opcional)</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Rua, número, bairro"
                  className="mt-1"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  onClick={handleSave}
                  disabled={!formData.name || !formData.phone}
                  className="flex-1 text-white"
                  style={{ backgroundColor: "#4FA3D1" }}
                >
                  Salvar Dados
                </Button>
                <Button onClick={() => setIsOpen(false)} variant="outline" className="flex-1">
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
