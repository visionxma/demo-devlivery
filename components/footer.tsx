import { Phone, MapPin, MessageCircle } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Contato</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Phone size={16} className="text-primary" />
                <span className="text-gray-600">+55 99 8420-1432</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin size={16} className="text-primary" />
                <span className="text-gray-600">Bernardo do Mearim, MA</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Links Rápidos</h3>
            <div className="space-y-2">
              <a href="/sobre" className="block text-gray-600 hover:text-primary transition-colors">
                Sobre Nós
              </a>
              <a href="/contato" className="block text-gray-600 hover:text-primary transition-colors">
                Contato
              </a>
              <a href="/politica-entrega" className="block text-gray-600 hover:text-primary transition-colors">
                Política de Entrega
              </a>
            </div>
          </div>

          {/* WhatsApp */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Atendimento</h3>
            <a
              href="https://wa.me/5599984201432"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              <MessageCircle size={16} />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        <div className="border-t mt-8 pt-8">
          <div className="text-center text-gray-600 mb-4">
            <p>&copy; 2024 Atacarejo São Manoel. Todos os direitos reservados.</p>
          </div>

          <div className="flex items-center justify-center space-x-3">
            <span className="text-sm text-gray-500">Desenvolvido por</span>
            <a
              href="https://visionxma.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <img src="/visionx-logo.png" alt="VisionX - Desenvolvedora de Software" className="h-6 w-auto" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
