import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, MapPin, MessageCircle, Mail, Clock } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Entre em <span style={{ color: "#4FA3D1" }}>Contato</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Estamos aqui para ajudar! Entre em contato conosco através dos canais abaixo
          </p>
        </section>

        {/* Contact Methods */}
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* WhatsApp - Primary */}
            <Card className="border-2" style={{ borderColor: "#25D366" }}>
              <CardContent className="p-8 text-center">
                <div
                  className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "#25D366" }}
                >
                  <MessageCircle className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">WhatsApp</h3>
                <p className="text-gray-600 mb-4">Nosso canal principal de atendimento</p>
                <p className="text-lg font-semibold text-gray-900 mb-4">+55 99 8420-1432</p>
                <Button asChild className="w-full text-white font-semibold" style={{ backgroundColor: "#25D366" }}>
                  <a href="https://wa.me/5599984201432" target="_blank" rel="noopener noreferrer">
                    Conversar no WhatsApp
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Phone */}
            <Card>
              <CardContent className="p-8 text-center">
                <div
                  className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "#4FA3D1" }}
                >
                  <Phone className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Telefone</h3>
                <p className="text-gray-600 mb-4">Ligue para fazer seu pedido</p>
                <p className="text-lg font-semibold text-gray-900 mb-4">+55 99 8420-1432</p>
                <Button
                  asChild
                  variant="outline"
                  className="w-full bg-transparent"
                  style={{ borderColor: "#4FA3D1", color: "#4FA3D1" }}
                >
                  <a href="tel:+5599984201432">Ligar Agora</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Additional Info */}
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Address */}
            <Card>
              <CardContent className="p-6 text-center">
                <div
                  className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "#E63946" }}
                >
                  <MapPin className="text-white" size={24} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Localização</h3>
                <p className="text-gray-600 text-sm">
                  Bernardo do Mearim
                  <br />
                  Maranhão - MA
                </p>
              </CardContent>
            </Card>

            {/* Email */}
            <Card>
              <CardContent className="p-6 text-center">
                <div
                  className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "#4FA3D1" }}
                >
                  <Mail className="text-white" size={24} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">WhatsApp</h3>
                <p className="text-gray-600 text-sm">
                  +55 99 8420-1432
                  <br />
                  Atendimento rápido
                </p>
              </CardContent>
            </Card>

            {/* Hours */}
            <Card>
              <CardContent className="p-6 text-center">
                <div
                  className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "#E63946" }}
                >
                  <Clock className="text-white" size={24} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Horário</h3>
                <p className="text-gray-600 text-sm">
                  Segunda a Sábado: 7h às 18h
                  <br />
                  Domingo: Fechado
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Perguntas Frequentes</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Qual o prazo de entrega?</h3>
                  <p className="text-gray-600">
                    Realizamos entregas em até 30 minutos na região de Bernardo do Mearim.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Qual o valor do frete?</h3>
                  <p className="text-gray-600">
                    Entre em contato conosco pelo WhatsApp para consultar o valor do frete para seu endereço.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Quais formas de pagamento vocês aceitam?</h3>
                  <p className="text-gray-600">
                    Aceitamos dinheiro, cartão de débito, cartão de crédito e PIX. O pagamento é feito na entrega.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Fazem troca de botijão vazio?</h3>
                  <p className="text-gray-600">
                    Sim! Fazemos a troca do seu botijão vazio por um cheio. O desconto é aplicado automaticamente no
                    valor final.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  )
}
