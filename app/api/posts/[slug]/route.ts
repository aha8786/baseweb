import { NextResponse } from "next/server"
import { verify } from "jsonwebtoken"
// import { posts } from "@/lib/data" // 더미 데이터 주석 처리
import { getPostBySlug } from "@/lib/data"
import { supabase } from "@/lib/supabaseClient"

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
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const authError = await validateRequest(request)
    if (authError) return authError

    const resolvedParams = await params
    const existingPost = await getPostBySlug(resolvedParams.slug)
    if (!existingPost) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { title, description, content, imageUrl, tags } = body

    // 필수 필드 검증
    if (!title || !description || !content || !imageUrl) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Supabase에서 포스트 업데이트
    const { data: updatedPortfolio, error } = await supabase
      .from('portfolio')
      .update({
        title,
        description: description, // 설명 필드 저장
        content: content, // 마크다운 본문
        thumbnail: imageUrl,
        tags: tags || [], // 전달받은 태그 사용
        // updated_at은 트리거로 자동 업데이트되므로 설정하지 않음
      })
      .eq('id', existingPost.id)
      .select()
      .single()

    if (error) {
      console.error("포스트 업데이트 중 DB 오류:", error)
      return NextResponse.json(
        { error: "Failed to update post in database" },
        { status: 500 }
      )
    }

    // 업데이트된 포트폴리오 데이터를 Post 형태로 변환
    const updatedPost = {
      id: updatedPortfolio.id,
      slug: updatedPortfolio.slug, // DB에서 저장된 slug 사용
      title: updatedPortfolio.title,
      description: updatedPortfolio.description,
      content: updatedPortfolio.content,
      imageUrl: updatedPortfolio.thumbnail || imageUrl,
      tags: updatedPortfolio.tags || [],
      createdAt: new Date(updatedPortfolio.created_at).toISOString().split('T')[0],
      updatedAt: new Date(updatedPortfolio.updated_at).toISOString().split('T')[0]
    }

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
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const authError = await validateRequest(request)
    if (authError) return authError

    const resolvedParams = await params
    const existingPost = await getPostBySlug(resolvedParams.slug)
    if (!existingPost) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      )
    }

    // Supabase에서 포스트 삭제
    const { error } = await supabase
      .from('portfolio')
      .delete()
      .eq('id', existingPost.id)

    if (error) {
      console.error("포스트 삭제 중 DB 오류:", error)
      return NextResponse.json(
        { error: "Failed to delete post from database" },
        { status: 500 }
      )
    }

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