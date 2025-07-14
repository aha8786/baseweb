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
    tags: post?.tags || [],
  })

  const [tagInput, setTagInput] = useState("")

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      addTag()
    }
  }

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setTagInput(value)
    
    // # 으로 시작하고 공백이나 엔터를 누르면 태그 추가
    if (value.endsWith(' ') || value.endsWith('\n')) {
      addTag()
    }
  }

  const addTag = () => {
    const tag = tagInput.trim()
    if (tag && !formData.tags.includes(tag)) {
      // # 으로 시작하면 제거
      const cleanTag = tag.startsWith('#') ? tag.substring(1) : tag
      if (cleanTag) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, cleanTag]
        }))
      }
    }
    setTagInput("")
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

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
        body: JSON.stringify({
          ...formData,
          tags: formData.tags
        }),
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
        <label htmlFor="tags" className="text-sm font-medium">
          태그
        </label>
        <div className="space-y-2">
          {/* 기존 태그 표시 */}
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
          {/* 태그 입력 필드 */}
          <Input
            id="tags"
            placeholder="태그를 입력하세요 (# 으로 시작하거나 스페이스바로 구분)"
            value={tagInput}
            onChange={handleTagInputChange}
            onKeyDown={handleTagInput}
          />
          <p className="text-xs text-muted-foreground">
            #태그명 형태로 입력하거나 스페이스바를 눌러 태그를 추가하세요
          </p>
        </div>
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