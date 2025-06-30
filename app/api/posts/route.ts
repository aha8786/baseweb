import { NextResponse } from "next/server"
import { verify } from "jsonwebtoken"
import { posts } from "@/lib/data"
import { Post } from "@/lib/types"

const JWT_SECRET = process.env.JWT_SECRET || "default-secret-key"

// 관리자 토큰 검증
function verifyAdminToken(token: string) {
  try {
    return verify(token, JWT_SECRET)
  } catch {
    return null
  }
}

// API 라우트에서 환경변수 로깅
console.log("API Route NEXT_PUBLIC_MANAGER_MODE:", process.env.NEXT_PUBLIC_MANAGER_MODE)

export async function POST(request: Request) {
  try {
    const token = request.headers.get("x-admin-token")
    if (!token || !verifyAdminToken(token)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, description, content, imageUrl } = body

    // 필수 필드 검증
    if (!title || !description || !content || !imageUrl) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // slug 생성
    const slug = title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .replace(/\s+/g, "-")

    // ID 생성
    const id = (posts.length + 1).toString()

    // 새 포스트 생성
    const newPost: Post = {
      id,
      slug,
      title,
      description,
      content,
      imageUrl,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    }

    // 실제로는 여기서 데이터베이스에 저장
    posts.push(newPost)

    return NextResponse.json(newPost)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    )
  }
}

export async function GET() {
  const posts = await getPosts()
  return NextResponse.json(posts)
} 