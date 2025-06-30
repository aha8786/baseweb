"use client"

import { PostForm } from "@/components/post-form"
import { useAdmin } from "@/lib/hooks/use-admin"
import { redirect } from "next/navigation"
import { useEffect } from "react"

export default function NewPostPage() {
  const { isAdmin, isLoading } = useAdmin()

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      redirect("/")
    }
  }, [isAdmin, isLoading])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">새 글 작성</h1>
        <PostForm mode="create" />
      </div>
    </div>
  )
} 