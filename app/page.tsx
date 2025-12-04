import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/hero-section"
import { FeaturedProperties } from "@/components/featured-properties"
import { CTASection } from "@/components/cta-section"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturedProperties />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
