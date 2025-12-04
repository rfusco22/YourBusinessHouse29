import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BlogHero } from "@/components/blog-hero"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { getAllBlogPosts } from "@/lib/blog-data"
import Link from "next/link"

export default function BlogPage() {
  const BLOG_POSTS = getAllBlogPosts()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <BlogHero />

        {/* Blog Posts Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" id="blog-posts">
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Artículos Recientes</h2>
            <p className="text-lg text-muted-foreground">
              Conoce las tendencias y estrategias más recientes en el mercado inmobiliario
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {BLOG_POSTS.map((post, index) => (
              <Card
                key={post.id}
                className="overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group animate-in fade-in slide-in-from-bottom-4"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                {/* Image */}
                <Link href={`/blog/${post.slug}`} className="block">
                  <div className="h-56 bg-muted overflow-hidden relative">
                    <img
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </Link>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="mb-4">
                    <span className="inline-block bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
                      {post.category}
                    </span>
                  </div>

                  <Link href={`/blog/${post.slug}`}>
                    <h3 className="text-xl font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors cursor-pointer">
                      {post.title}
                    </h3>
                  </Link>
                  <p className="text-muted-foreground mb-6 flex-1 line-clamp-3">{post.excerpt}</p>

                  {/* Read More */}
                  <Link href={`/blog/${post.slug}`} className="w-full mt-auto">
                    <Button
                      variant="outline"
                      className="w-full gap-2 bg-transparent group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300"
                    >
                      Leer más
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-16 px-4 sm:px-6 lg:px-8 mt-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Suscríbete a Nuestro Newsletter</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Recibe las últimas actualizaciones y consejos inmobiliarios directamente en tu correo
            </p>
            <div className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="tu@email.com"
                className="flex-1 px-4 py-3 rounded-lg border-2 border-border bg-background focus:outline-none focus:border-primary transition-colors"
              />
              <Button className="px-8">Suscribirse</Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
