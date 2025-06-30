"use client"

import { Post } from "@/lib/types"
import Link from "next/link"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import { useAdmin } from "@/lib/hooks/use-admin"
import { AdminAuthDialog } from "./admin-auth-dialog"
import { useState } from "react"

interface PostCardProps {
  post: Post
  isManagerMode: boolean
}

export default function PostCard({ post, isManagerMode }: PostCardProps) {
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const [actionType, setActionType] = useState<"edit" | "delete" | null>(null)
  const { isAdmin, setAdminStatus } = useAdmin()

  const handleAuthSuccess = () => {
    setAdminStatus(true)
    if (actionType === "edit") {
      window.location.href = `/posts/${post.slug}/edit`
    } else if (actionType === "delete") {
      handleDelete()
    }
  }

  const handleDelete = async () => {
    if (!window.confirm("정말로 이 포스트를 삭제하시겠습니까?")) {
      return
    }

    try {
      const token = localStorage.getItem("admin-token")
      const response = await fetch(`/api/posts/${post.slug}`, {
        method: "DELETE",
        headers: {
          "x-admin-token": token || "",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to delete post")
      }

      window.location.reload()
    } catch (error) {
      if (error instanceof Error) {
        alert(`포스트 삭제에 실패했습니다. ${error.message}`)
      } else {
        alert("포스트 삭제에 실패했습니다.")
      }
    }
  }

  const handleAction = (type: "edit" | "delete") => {
    if (!isAdmin) {
      setActionType(type)
      setShowAuthDialog(true)
    } else {
      if (type === "edit") {
        window.location.href = `/posts/${post.slug}/edit`
      } else {
        handleDelete()
      }
    }
  }

  return (
    <>
      <Card className="group relative overflow-hidden rounded-lg">
        <Link href={`/posts/${post.slug}`}>
          {/* 이미지 컨테이너 */}
          <div className="relative aspect-[16/9] w-full">
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {/* 오버레이 + 텍스트 컨테이너 */}
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 to-transparent opacity-0 transition-all duration-300 group-hover:opacity-100">
              <div className="translate-y-4 p-6 transition-transform duration-300 group-hover:translate-y-0">
                <h3 className="mb-2 text-xl font-bold text-white">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-200">
                  {post.description}
                </p>
              </div>
            </div>
          </div>
        </Link>
        {isManagerMode && (
          <div className="absolute right-2 top-2 flex gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleAction("edit")}
              className="bg-white/80 hover:bg-white"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleAction("delete")}
              className="bg-white/80 text-red-500 hover:bg-white hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </Card>
      <AdminAuthDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
        onAuthSuccess={handleAuthSuccess}
      />
    </>
  )
} 