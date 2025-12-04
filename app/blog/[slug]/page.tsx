import { BlogPostClientPage } from "./client-page"
import { getBlogPostBySlug, getAllBlogPosts } from "@/lib/blog-data"
import type { Metadata } from "next"

export async function generateStaticParams() {
  const posts = getAllBlogPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await props.params
  const { slug } = params
  const post = getBlogPostBySlug(slug)

  if (!post) {
    return {
      title: "Post no encontrado",
    }
  }

  return {
    title: `${post.title} | Your Business House`,
    description: post.excerpt,
  }
}

export default async function BlogPostServerPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params
  const { slug } = params
  const post = getBlogPostBySlug(slug)

  return <BlogPostClientPage post={post} slug={slug} />
}
