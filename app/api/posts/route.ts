import { NextResponse } from "next/server"
import { verify } from "jsonwebtoken"
// import { posts } from "@/lib/data" // 더미 데이터 주석 처리
import { getPosts } from "@/lib/data"
import { Post } from "@/lib/types"
import { supabase } from "@/lib/supabaseClient"

const JWT_SECRET = process.env.JWT_SECRET || "default-secret-key"
const USER_UID = process.env.USER_UID

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

    // USER_UID 환경변수 확인
    if (!USER_UID) {
      return NextResponse.json(
        { error: "USER_UID가 .env.local 파일에 설정되지 않았습니다." },
        { status: 500 }
      )
    }

    // Supabase에 새 포스트 저장
    const { data: newPortfolio, error } = await supabase
      .from('portfolio')
      .insert({
        title,
        content: content, // description은 content에서 자동 생성되므로 content만 저장
        author_id: USER_UID,
        tags: [], // 기본값
        thumbnail: imageUrl,
        is_published: true
      })
      .select()
      .single()

    if (error) {
      console.error("포스트 생성 중 DB 오류:", error)
      return NextResponse.json(
        { error: "Failed to create post in database" },
        { status: 500 }
      )
    }

    // 포트폴리오 데이터를 Post 형태로 변환
    const newPost: Post = {
      id: newPortfolio.id,
      slug: title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      title: newPortfolio.title,
      description: content.substring(0, 150) + '...',
      content: newPortfolio.content,
      imageUrl: newPortfolio.thumbnail || imageUrl,
      createdAt: new Date(newPortfolio.created_at).toISOString().split('T')[0],
      updatedAt: new Date(newPortfolio.created_at).toISOString().split('T')[0]
    }

    return NextResponse.json(newPost)
  } catch (error) {
    console.error("포스트 생성 중 오류:", error)
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