"use client"

import { PostForm } from "@/components/post-form"
import { useAdmin } from "@/lib/hooks/use-admin"
import { getPostBySlug } from "@/lib/data"
import { notFound, redirect } from "next/navigation"
import { useEffect, useState } from "react"
import { Post } from "@/lib/types"

interface EditPostPageProps {
  params: Promise<{
    slug: string
  }>
}

export default function EditPostPage({ params }: EditPostPageProps) {
  const { isAdmin, isLoading } = useAdmin()
  const [post, setPost] = useState<Post | null>(null)
  const [paramsLoaded, setParamsLoaded] = useState(false)

  useEffect(() => {
    const loadParams = async () => {
      const resolvedParams = await params
      const foundPost = await getPostBySlug(resolvedParams.slug)
      setPost(foundPost || null)
      setParamsLoaded(true)
    }
    loadParams()
  }, [params])

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      redirect("/")
    }
  }, [isAdmin, isLoading])

  if (isLoading || !paramsLoaded) {
    return <div>Loading...</div>
  }

  if (!post) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">글 수정</h1>
        <PostForm mode="edit" post={post} />
      </div>
    </div>
  )
} 