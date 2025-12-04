"use client"

export function PropertiesHero() {
  return (
    <div className="relative w-full h-screen min-h-[600px] max-h-[800px] overflow-hidden">
      {/* Background image with high quality */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url(/luxury-property-hero.png)",
          backgroundAttachment: "fixed",
        }}
      />

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>

      {/* Bottom light gradient for smooth transition */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-white to-transparent opacity-10"></div>

      {/* Content container */}
      <div className="relative h-full flex items-center justify-start">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl space-y-6">
            {/* Accent badge */}
            <div className="inline-block">
              <span className="text-sm font-semibold text-white/80 uppercase tracking-widest bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                Nuestro Catálogo de Propiedades
              </span>
            </div>

            {/* Main heading */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-serif font-bold text-white text-balance leading-tight drop-shadow-lg">
              Descubre tu
              <br />
              hogar de lujo
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-white/90 max-w-xl font-light leading-relaxed drop-shadow">
              Explora nuestro completo catálogo de propiedades premium en las mejores ubicaciones. Encuentra el lugar
              perfecto para vivir.
            </p>

            {/* CTA Button */}
            <div className="pt-4">
              <button className="inline-block bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                Explorar Propiedades
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative corner accent */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-primary/20 to-transparent blur-3xl pointer-events-none"></div>
    </div>
  )
}
