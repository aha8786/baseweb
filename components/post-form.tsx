"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Post } from "@/lib/types"
import { MarkdownEditor } from "./markdown-editor"

interface PostFormProps {
  post?: Post
  mode: "create" | "edit"
}

export function PostForm({ post, mode }: PostFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState({
    title: post?.title || "",
    description: post?.description || "",
    content: post?.content || "",
    imageUrl: post?.imageUrl || "",
  })

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = "제목을 입력해주세요."
    }
    if (!formData.description.trim()) {
      newErrors.description = "설명을 입력해주세요."
    }
    if (!formData.content.trim()) {
      newErrors.content = "내용을 입력해주세요."
    } else if (formData.content.trim().length < 10) {
      newErrors.content = "내용은 최소 10자 이상 입력해주세요."
    }
    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = "이미지 URL을 입력해주세요."
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    // 수정 모드에서 slug 검증
    if (mode === "edit" && (!post || !post.slug)) {
      alert("포스트 정보가 올바르지 않습니다.")
      return
    }

    setIsLoading(true)

    try {
      const token = localStorage.getItem("admin-token")
      
      // 토큰 검증
      if (!token) {
        alert("관리자 인증이 필요합니다. 다시 로그인해주세요.")
        localStorage.removeItem("admin-token")
        router.push("/")
        return
      }

      const url = mode === "create" ? "/api/posts" : `/api/posts/${post!.slug}`
      const method = mode === "create" ? "POST" : "PUT"

      console.log("요청 URL:", url) // 디버깅용
      console.log("요청 방식:", method) // 디버깅용

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token,
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
        console.error("API 응답 오류:", errorData) // 디버깅용
        
        if (response.status === 401) {
          alert("관리자 인증이 만료되었습니다. 다시 로그인해주세요.")
          localStorage.removeItem("admin-token")
          router.push("/")
          return
        }
        
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      const data = await response.json()
      router.push(`/posts/${data.slug}`)
    } catch (error) {
      console.error("포스트 저장 오류:", error) // 디버깅용
      if (error instanceof Error) {
        alert(`포스트 저장에 실패했습니다. ${error.message}`)
      } else {
        alert("포스트 저장에 실패했습니다.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">
          제목
        </label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
          required
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          설명
        </label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          required
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="content" className="text-sm font-medium">
          내용
        </label>
        <MarkdownEditor
          value={formData.content}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, content: value }))
          }
          required
          error={errors.content}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="imageUrl" className="text-sm font-medium">
          이미지 URL
        </label>
        <Input
          id="imageUrl"
          type="url"
          value={formData.imageUrl}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, imageUrl: e.target.value }))
          }
          required
        />
        {errors.imageUrl && (
          <p className="text-sm text-red-500">{errors.imageUrl}</p>
        )}
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          취소
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "저장 중..." : mode === "create" ? "작성" : "수정"}
        </Button>
      </div>
    </form>
  )
} 