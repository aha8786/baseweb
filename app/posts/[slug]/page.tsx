import { PostDetail } from "@/components/post-detail"
import { getPosts, getPostBySlug } from "@/lib/data"
import { notFound } from "next/navigation"

interface PostPageProps {
  params: Promise<{
    slug: string
  }>
}

// 서버 사이드에서 환경변수 로깅
console.log("Server-side NEXT_PUBLIC_MANAGER_MODE:", process.env.NEXT_PUBLIC_MANAGER_MODE)

export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function PostPage({ params }: PostPageProps) {
  const resolvedParams = await params
  const post = await getPostBySlug(resolvedParams.slug)

  if (!post) {
    notFound()
  }

  return <PostDetail post={post} />
} 