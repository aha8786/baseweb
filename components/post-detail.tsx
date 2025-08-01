"use client"

import { Post } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import { AdminAuthDialog } from "@/components/admin-auth-dialog"
import { useState } from "react"
import { useAdmin } from "@/lib/hooks/use-admin"
import Image from "next/image"
import { motion } from "framer-motion"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import rehypeRaw from "rehype-raw"

// highlight.js 스타일 동적 로드
import "highlight.js/styles/github-dark.css"

interface PostDetailProps {
  post: Post
}

interface ClientAdminButtonsProps {
  slug: string
}

function ClientAdminButtons({ slug }: ClientAdminButtonsProps) {
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const [actionType, setActionType] = useState<"edit" | "delete" | null>(null)
  const { isAdmin, setAdminStatus } = useAdmin()

  const handleAuthSuccess = () => {
    setAdminStatus(true)
    if (actionType === "edit") {
      window.location.href = `/posts/${slug}/edit`
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
      const response = await fetch(`/api/posts/${slug}`, {
        method: "DELETE",
        headers: {
          "x-admin-token": token || "",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to delete post")
      }

      window.location.href = "/"
    } catch (error) {
      if (error instanceof Error) {
        alert(`포스트 삭제에 실패했습니다: ${error.message}`)
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
        window.location.href = `/posts/${slug}/edit`
      } else {
        handleDelete()
      }
    }
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleAction("edit")}
        className="bg-background/80 backdrop-blur-sm hover:bg-background"
      >
        <Pencil className="w-4 h-4 mr-2" />
        수정
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleAction("delete")}
        className="bg-background/80 backdrop-blur-sm hover:bg-background text-red-500 hover:text-red-600"
      >
        <Trash2 className="w-4 h-4 mr-2" />
        삭제
      </Button>
      <AdminAuthDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
        onAuthSuccess={handleAuthSuccess}
      />
    </>
  )
}

const isManagerMode = process.env.NEXT_PUBLIC_MANAGER_MODE === "true"

export function PostDetail({ post }: PostDetailProps) {
  return (
    <article className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto relative">
        {isManagerMode ? (
          <div className="absolute right-0 -top-2 z-10 flex gap-4">
            <ClientAdminButtons slug={post.slug} />
          </div>
        ) : null}
        
        {/* 제목 */}
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        
        {/* 날짜 */}
        <div className="text-sm text-muted-foreground mb-4">
          {post.updatedAt && post.updatedAt !== post.createdAt ? (
            <span>
              {new Date(post.updatedAt).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })} (최근 수정일)
            </span>
          ) : (
            <span>
              {new Date(post.createdAt).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          )}
        </div>
        
        {/* 태그 */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        {/* 대표 이미지 */}
        <div className="relative aspect-[16/9] mb-8 rounded-lg overflow-hidden">
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover w-full h-full rounded-lg"
          />
        </div>

        {/* 설명 */}
        <p className="text-lg text-muted-foreground mb-8">
          {post.description}
        </p>
        
        {/* 내용 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="prose max-w-none"
        >
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeHighlight]}
            components={{
              // span 태그에 대한 특별 처리 추가
              span: ({style, ...props}) => {
                if (style?.color) {
                  return <span style={{...style, '--color': style.color}} {...props} />
                }
                return <span style={style} {...props} />
              }
            }}
          >
            {post.content}
          </ReactMarkdown>
        </motion.div>
      </div>
    </article>
  )
} 