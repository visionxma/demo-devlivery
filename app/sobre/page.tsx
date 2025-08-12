import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Sobre o <span style={{ color: "#4FA3D1" }}>Atacarejo São Manoel</span>
          </h1>
          <Card>
            <CardContent className="p-8">
              <p className="text-lg text-gray-600">
                O Atacarejo São Manoel é sua empresa de confiança para delivery de gás e água na região de Bernardo do
                Mearim. Trabalhamos com as principais marcas do mercado, garantindo qualidade e rapidez na entrega.
              </p>
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  )
}
