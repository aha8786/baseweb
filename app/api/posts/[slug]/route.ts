import { NextResponse } from "next/server"
import { verify } from "jsonwebtoken"
import { posts } from "@/lib/data"

const JWT_SECRET = process.env.JWT_SECRET || "default-secret-key"

// 관리자 토큰 검증
function verifyAdminToken(token: string) {
  try {
    return verify(token, JWT_SECRET)
  } catch {
    return null
  }
}

// 권한 검증 미들웨어
async function validateRequest(request: Request) {
  const token = request.headers.get("x-admin-token")
  if (!token || !verifyAdminToken(token)) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }
  return null
}

export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const authError = await validateRequest(request)
    if (authError) return authError

    const postIndex = posts.findIndex((p) => p.slug === params.slug)
    if (postIndex === -1) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
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

    // 포스트 업데이트
    const updatedPost = {
      ...posts[postIndex],
      title,
      description,
      content,
      imageUrl,
      updatedAt: new Date().toISOString().split("T")[0],
    }

    // 실제로는 여기서 데이터베이스에 저장
    posts[postIndex] = updatedPost

    return NextResponse.json(updatedPost)
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const authError = await validateRequest(request)
    if (authError) return authError

    const postIndex = posts.findIndex((p) => p.slug === params.slug)
    if (postIndex === -1) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      )
    }

    // 실제로는 여기서 데이터베이스에서 삭제
    posts.splice(postIndex, 1)

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    )
  }
} 