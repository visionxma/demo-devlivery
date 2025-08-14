"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import Image from "next/image"

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <header className="shadow-sm border-b" style={{ backgroundColor: "#4FA3D1" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="./atacarejo-sao-manoel-logo.png"
              alt="Atacarejo São Manoel"
              width={120}
              height={60}
              className="h-12 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-white hover:text-blue-100 transition-colors font-medium">
              Home
            </Link>
            <Link href="/sobre" className="text-white hover:text-blue-100 transition-colors font-medium">
              Sobre
            </Link>
            <Link href="/contato" className="text-white hover:text-blue-100 transition-colors font-medium">
              Contato
            </Link>
            <Link href="/politica-entrega" className="text-white hover:text-blue-100 transition-colors font-medium">
              Política de Entrega
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button onClick={toggleMenu} className="md:hidden p-2 rounded-md text-white hover:text-blue-100">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-blue-300">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-white hover:text-blue-100 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/sobre"
                className="text-white hover:text-blue-100 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Sobre
              </Link>
              <Link
                href="/contato"
                className="text-white hover:text-blue-100 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Contato
              </Link>
              <Link
                href="/politica-entrega"
                className="text-white hover:text-blue-100 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Política de Entrega
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
