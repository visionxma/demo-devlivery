import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, MapPin, Shield, CreditCard } from "lucide-react"

export default function DeliveryPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Política de <span style={{ color: "#4FA3D1" }}>Entrega</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Informações sobre nossa área de cobertura, prazos e condições de entrega
          </p>
        </section>

        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="p-6">
                <div
                  className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "#4FA3D1" }}
                >
                  <Clock className="text-white" size={24} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Prazo</h3>
                <p className="text-gray-600 text-sm">Entrega em até 30 minutos</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div
                  className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "#E63946" }}
                >
                  <MapPin className="text-white" size={24} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Cobertura</h3>
                <p className="text-gray-600 text-sm">Região de Bernardo do Mearim</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div
                  className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "#4FA3D1" }}
                >
                  <Shield className="text-white" size={24} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Segurança</h3>
                <p className="text-gray-600 text-sm">Produtos certificados e entrega segura</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div
                  className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "#E63946" }}
                >
                  <CreditCard className="text-white" size={24} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Pagamento</h3>
                <p className="text-gray-600 text-sm">Dinheiro, PIX ou cartão</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="space-y-8">
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center space-x-3 mb-6">
                <MapPin size={24} style={{ color: "#E63946" }} />
                <h2 className="text-2xl font-bold text-gray-900">Área de Cobertura</h2>
              </div>
              <p className="text-gray-600 mb-4">
                Atendemos exclusivamente a região de <strong>Bernardo do Mearim</strong> e arredores.
              </p>
              <p className="text-sm text-gray-500">
                Para confirmar se sua localização está na nossa área de entrega, entre em contato pelo nosso WhatsApp:
              </p>
              <div className="mt-3">
                <p className="text-sm font-medium text-gray-700">+55 99 8420-1432</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <div className="flex items-center space-x-3 mb-6">
                <Clock size={24} style={{ color: "#4FA3D1" }} />
                <h2 className="text-2xl font-bold text-gray-900">Prazo de Entrega</h2>
              </div>
              <p className="text-gray-600 mb-4">
                <strong>Entrega em até 30 minutos</strong> após a confirmação do pedido.
              </p>
              <p className="text-sm text-gray-500">Horário de funcionamento: Segunda a sábado, das 7h às 18h.</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <div className="flex items-center space-x-3 mb-6">
                <CreditCard size={24} style={{ color: "#E63946" }} />
                <h2 className="text-2xl font-bold text-gray-900">Formas de Pagamento</h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">Dinheiro (com troco)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">PIX</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">Cartão de Débito e Crédito</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <div className="flex items-center space-x-3 mb-6">
                <Shield size={24} style={{ color: "#4FA3D1" }} />
                <h2 className="text-2xl font-bold text-gray-900">Segurança</h2>
              </div>
              <div className="space-y-3">
                <p className="text-gray-600">• Entregadores identificados e uniformizados</p>
                <p className="text-gray-600">• Produtos certificados pelo INMETRO</p>
                <p className="text-gray-600">• Manuseio seguro de botijões de gás</p>
                <p className="text-gray-600">• Água mineral com registro sanitário</p>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  )
}
