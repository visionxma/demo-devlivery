import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import ProductGrid from "@/components/product-grid"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <div className="mb-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              <span style={{ color: "#E63946" }}>Atacarejo</span> <span style={{ color: "#4FA3D1" }}>São Manoel</span>
            </h1>
            <div className="w-24 h-1 mx-auto mb-4" style={{ backgroundColor: "#4FA3D1" }}></div>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Delivery de <span style={{ color: "#4FA3D1" }}>Gás</span> e <span style={{ color: "#4FA3D1" }}>Água</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            Receba seus botijões de gás e galões de água no conforto da sua casa. Entrega rápida e segura em São Manoel!
          </p>
        </section>

        <ProductGrid />
      </main>

      <Footer />
    </div>
  )
}
