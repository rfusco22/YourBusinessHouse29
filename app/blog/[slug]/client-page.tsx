"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getAllBlogPosts, type getBlogPostBySlug } from "@/lib/blog-data"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight, Share2, CheckCircle2, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface BlogPostPageProps {
  post: ReturnType<typeof getBlogPostBySlug>
  slug: string
}

export function BlogPostClientPage({ post, slug }: BlogPostPageProps) {
  if (!post) {
    notFound()
  }

  const allPosts = getAllBlogPosts()
  const currentIndex = allPosts.findIndex((p) => p.slug === slug)
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section with Featured Image */}
        <div className="relative w-full h-[40vh] sm:h-[50vh] md:h-[60vh] min-h-[300px] max-h-[600px] overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${post.image})`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />

          <div className="relative h-full flex items-end">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-8 sm:pb-12">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-4 sm:mb-6 transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-medium">Volver al blog</span>
              </Link>

              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 text-balance leading-tight">
                {post.title}
              </h1>

              <span className="inline-block bg-primary text-primary-foreground px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold shadow-lg">
                {post.category}
              </span>
            </div>
          </div>
        </div>

        {/* Article Content - Removed IntersectionObserver that was hiding content */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="blog-content">
            <style jsx global>{`
              .blog-content h2 {
                font-size: 1.5rem;
                font-weight: 700;
                margin-top: 2rem;
                margin-bottom: 1rem;
                color: hsl(var(--foreground));
                position: relative;
                padding-left: 1rem;
                border-left: 4px solid hsl(var(--primary));
              }
              
              @media (min-width: 640px) {
                .blog-content h2 {
                  font-size: 1.75rem;
                  margin-top: 2.5rem;
                  margin-bottom: 1.25rem;
                }
              }
              
              @media (min-width: 768px) {
                .blog-content h2 {
                  font-size: 2rem;
                  margin-top: 3rem;
                  margin-bottom: 1.5rem;
                }
              }

              .blog-content h3 {
                font-size: 1.25rem;
                font-weight: 600;
                margin-top: 1.5rem;
                margin-bottom: 0.75rem;
                color: hsl(var(--foreground));
              }
              
              @media (min-width: 640px) {
                .blog-content h3 {
                  font-size: 1.375rem;
                  margin-top: 1.75rem;
                  margin-bottom: 0.875rem;
                }
              }
              
              @media (min-width: 768px) {
                .blog-content h3 {
                  font-size: 1.5rem;
                  margin-top: 2rem;
                  margin-bottom: 1rem;
                }
              }

              .blog-content p {
                font-size: 1rem;
                line-height: 1.75;
                color: hsl(var(--muted-foreground));
                margin-bottom: 1.25rem;
              }
              
              @media (min-width: 640px) {
                .blog-content p {
                  font-size: 1.0625rem;
                  margin-bottom: 1.375rem;
                }
              }
              
              @media (min-width: 768px) {
                .blog-content p {
                  font-size: 1.125rem;
                  margin-bottom: 1.5rem;
                }
              }

              .blog-content ul {
                margin: 1.25rem 0;
                padding-left: 1.25rem;
              }
              
              @media (min-width: 768px) {
                .blog-content ul {
                  margin: 1.5rem 0;
                  padding-left: 1.5rem;
                }
              }

              .blog-content li {
                font-size: 1rem;
                line-height: 1.75;
                color: hsl(var(--muted-foreground));
                margin: 0.5rem 0;
                position: relative;
                padding-left: 0.5rem;
              }
              
              @media (min-width: 768px) {
                .blog-content li {
                  font-size: 1.125rem;
                  margin: 0.75rem 0;
                }
              }

              .blog-content li::marker {
                color: hsl(var(--primary));
              }

              .blog-content strong {
                color: hsl(var(--foreground));
                font-weight: 600;
              }

              .callout-box {
                background: linear-gradient(135deg, hsl(var(--primary) / 0.05) 0%, hsl(var(--secondary) / 0.05) 100%);
                border-left: 4px solid hsl(var(--primary));
                border-radius: 0.5rem;
                padding: 1rem;
                margin: 1.5rem 0;
                box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
              }
              
              @media (min-width: 640px) {
                .callout-box {
                  padding: 1.25rem;
                  margin: 1.75rem 0;
                }
              }
              
              @media (min-width: 768px) {
                .callout-box {
                  padding: 1.5rem;
                  margin: 2rem 0;
                }
              }
            `}</style>

            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>

          <div className="callout-box mt-8 sm:mt-12">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-semibold text-foreground mb-2">
                  Consejo de Your Business House
                </h4>
                <p className="text-sm sm:text-base text-muted-foreground">
                  ¿Necesitas asesoría personalizada? Nuestro equipo de expertos está listo para ayudarte a tomar las
                  mejores decisiones inmobiliarias. Contáctanos para una consulta gratuita.
                </p>
              </div>
            </div>
          </div>

          {/* Share Section */}
          <div className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-border">
            <div className="flex items-center gap-2 mb-4">
              <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              <p className="text-base sm:text-lg font-semibold text-foreground">Comparte este artículo</p>
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <Button
                variant="outline"
                size="sm"
                className="hover:bg-green-500 hover:text-white hover:border-green-500 transition-all duration-300 bg-transparent text-xs sm:text-sm"
                onClick={() => {
                  const url = window.location.href
                  const text = `${post.title} - Your Business House`
                  window.open(
                    `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`,
                    "_blank",
                    "width=600,height=400",
                  )
                }}
              >
                WhatsApp
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300 bg-transparent text-xs sm:text-sm"
                onClick={() => {
                  const url = window.location.href
                  const text = post.title
                  window.open(
                    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`,
                    "_blank",
                    "width=600,height=400",
                  )
                }}
              >
                Facebook
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="hover:bg-sky-500 hover:text-white hover:border-sky-500 transition-all duration-300 bg-transparent text-xs sm:text-sm"
                onClick={() => {
                  const url = window.location.href
                  const text = post.title
                  window.open(
                    `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
                    "_blank",
                    "width=600,height=400",
                  )
                }}
              >
                Twitter
              </Button>
            </div>
          </div>
        </article>

        {/* Navigation to Previous/Next Posts */}
        <div className="bg-muted/30 py-8 sm:py-12 mt-8 sm:mt-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {prevPost && (
                <Link
                  href={`/blog/${prevPost.slug}`}
                  className="group p-4 sm:p-6 bg-card border border-border rounded-lg hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mb-2">
                    <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Artículo anterior</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {prevPost.title}
                  </h3>
                </Link>
              )}

              {nextPost && (
                <Link
                  href={`/blog/${nextPost.slug}`}
                  className="group p-4 sm:p-6 bg-card border border-border rounded-lg hover:shadow-lg transition-all duration-300 hover:-translate-y-1 md:col-start-2 text-right"
                >
                  <div className="flex items-center justify-end gap-2 text-xs sm:text-sm text-muted-foreground mb-2">
                    <span>Siguiente artículo</span>
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {nextPost.title}
                  </h3>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full mb-4 sm:mb-6">
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              ¿Te gustó este artículo?
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8">
              Suscríbete para recibir más contenido como este directamente en tu correo
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="tu@email.com"
                className="flex-1 px-4 py-3 rounded-lg border-2 border-border bg-background focus:outline-none focus:border-primary transition-colors text-sm sm:text-base"
              />
              <Button className="px-6 sm:px-8 hover:scale-105 transition-transform">Suscribirse</Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default BlogPostClientPage
