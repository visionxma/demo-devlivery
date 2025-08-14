"use client"

import { useState, useEffect, useCallback } from "react"
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
import { Badge } from "@/components/ui/badge"
import { MapPin, Plus, Edit, Trash2, Home, Building } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

interface Address {
  id: string
  name: string
  address: string
  isDefault: boolean
}

interface AddressManagerProps {
  customerData: { name: string; phone: string; address: string } | null
  onAddressesChange: (addresses: Address[]) => void
}

export default function AddressManager({ customerData, onAddressesChange }: AddressManagerProps) {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    address: "",
  })

  const memoizedOnAddressesChange = useCallback(onAddressesChange, [])

  // Load addresses from localStorage
  useEffect(() => {
    if (customerData) {
      const savedAddresses = localStorage.getItem(`atacarejo-addresses-${customerData.phone}`)
      if (savedAddresses) {
        const parsedAddresses = JSON.parse(savedAddresses)
        setAddresses(parsedAddresses)
        memoizedOnAddressesChange(parsedAddresses)
      } else if (customerData.address) {
        // Migrate existing address to new system
        const defaultAddress: Address = {
          id: "default",
          name: "Principal",
          address: customerData.address,
          isDefault: true,
        }
        setAddresses([defaultAddress])
        memoizedOnAddressesChange([defaultAddress])
        localStorage.setItem(`atacarejo-addresses-${customerData.phone}`, JSON.stringify([defaultAddress]))
      }
    }
  }, [customerData]) // Fixed dependencies

  const saveAddresses = (newAddresses: Address[]) => {
    if (customerData) {
      setAddresses(newAddresses)
      memoizedOnAddressesChange(newAddresses) // Use memoized callback
      localStorage.setItem(`atacarejo-addresses-${customerData.phone}`, JSON.stringify(newAddresses))
    }
  }

  const handleAddAddress = () => {
    if (formData.name && formData.address && customerData) {
      const newAddress: Address = {
        id: `addr-${Date.now()}`,
        name: formData.name,
        address: formData.address,
        isDefault: addresses.length === 0,
      }
      const newAddresses = [...addresses, newAddress]
      saveAddresses(newAddresses)
      setFormData({ name: "", address: "" })
      setIsAddDialogOpen(false)
    }
  }

  const handleEditAddress = () => {
    if (formData.name && formData.address && editingAddress && customerData) {
      const newAddresses = addresses.map((addr) =>
        addr.id === editingAddress.id ? { ...addr, name: formData.name, address: formData.address } : addr,
      )
      saveAddresses(newAddresses)
      setFormData({ name: "", address: "" })
      setEditingAddress(null)
      setIsEditDialogOpen(false)
    }
  }

  const handleDeleteAddress = (addressId: string) => {
    const addressToDelete = addresses.find((addr) => addr.id === addressId)
    if (addressToDelete && addresses.length > 1) {
      const newAddresses = addresses.filter((addr) => addr.id !== addressId)

      // If deleting default address, make the first remaining address default
      if (addressToDelete.isDefault && newAddresses.length > 0) {
        newAddresses[0].isDefault = true
      }

      saveAddresses(newAddresses)
    }
  }

  const handleSetDefault = (addressId: string) => {
    const newAddresses = addresses.map((addr) => ({
      ...addr,
      isDefault: addr.id === addressId,
    }))
    saveAddresses(newAddresses)
  }

  const openEditDialog = (address: Address) => {
    setEditingAddress(address)
    setFormData({ name: address.name, address: address.address })
    setIsEditDialogOpen(true)
  }

  const openAddDialog = () => {
    setFormData({ name: "", address: "" })
    setIsAddDialogOpen(true)
  }

  const getAddressIcon = (name: string) => {
    const lowerName = name.toLowerCase()
    if (lowerName.includes("casa") || lowerName.includes("residência")) {
      return <Home className="h-4 w-4" />
    } else if (lowerName.includes("trabalho") || lowerName.includes("escritório") || lowerName.includes("empresa")) {
      return <Building className="h-4 w-4" />
    }
    return <MapPin className="h-4 w-4" />
  }

  if (!customerData) {
    return null
  }

  return (
    <div className="mb-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" style={{ color: "#4FA3D1" }} />
              <span className="text-lg">Meus Endereços ({addresses.length})</span>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={openAddDialog} size="sm" className="text-white" style={{ backgroundColor: "#4FA3D1" }}>
                  <Plus className="h-4 w-4 mr-1" />
                  Adicionar
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" style={{ color: "#4FA3D1" }} />
                    Adicionar Endereço
                  </DialogTitle>
                  <DialogDescription>Adicione um novo endereço para suas entregas</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="address-name">Nome do Endereço *</Label>
                    <Input
                      id="address-name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ex: Casa, Trabalho, Escritório"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="address-text">Endereço Completo *</Label>
                    <Textarea
                      id="address-text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Rua, número, bairro, referências..."
                      className="mt-1 min-h-[80px] resize-none"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={handleAddAddress}
                      disabled={!formData.name || !formData.address}
                      className="flex-1 text-white"
                      style={{ backgroundColor: "#4FA3D1" }}
                    >
                      Adicionar Endereço
                    </Button>
                    <Button onClick={() => setIsAddDialogOpen(false)} variant="outline" className="flex-1">
                      Cancelar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {addresses.map((address) => (
              <div
                key={address.id}
                className={`p-3 rounded-lg border ${
                  address.isDefault ? "border-blue-200 bg-blue-50" : "border-gray-200 bg-gray-50"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {getAddressIcon(address.name)}
                      <span className="font-medium text-gray-900">{address.name}</span>
                      {address.isDefault && (
                        <Badge
                          variant="secondary"
                          className="text-xs"
                          style={{ backgroundColor: "#4FA3D1", color: "white" }}
                        >
                          Padrão
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{address.address}</p>
                  </div>
                  <div className="flex gap-1 ml-2">
                    {!address.isDefault && (
                      <Button
                        onClick={() => handleSetDefault(address.id)}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-gray-400 hover:text-blue-600"
                        title="Definir como padrão"
                      >
                        <MapPin className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      onClick={() => openEditDialog(address)}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-gray-400 hover:text-blue-600"
                      title="Editar"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {addresses.length > 1 && (
                      <Button
                        onClick={() => handleDeleteAddress(address.id)}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-gray-400 hover:text-red-600"
                        title="Excluir"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Edit Address Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" style={{ color: "#4FA3D1" }} />
              Editar Endereço
            </DialogTitle>
            <DialogDescription>Modifique as informações do endereço</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-address-name">Nome do Endereço *</Label>
              <Input
                id="edit-address-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Casa, Trabalho, Escritório"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="edit-address-text">Endereço Completo *</Label>
              <Textarea
                id="edit-address-text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Rua, número, bairro, referências..."
                className="mt-1 min-h-[80px] resize-none"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleEditAddress}
                disabled={!formData.name || !formData.address}
                className="flex-1 text-white"
                style={{ backgroundColor: "#4FA3D1" }}
              >
                Salvar Alterações
              </Button>
              <Button onClick={() => setIsEditDialogOpen(false)} variant="outline" className="flex-1">
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
