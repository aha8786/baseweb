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

// 다음 사용 가능한 숫자 기반 slug 생성 함수
async function generateNextSlug(): Promise<string> {
  try {
    // 현재 존재하는 모든 숫자 기반 slug를 가져옴
    const { data: portfolios, error } = await supabase
      .from('portfolio')
      .select('slug')
      .like('slug', 'post-%')
      .order('slug', { ascending: false })

    if (error) {
      console.error('기존 slug 조회 중 오류:', error)
      return 'post-1' // 오류 시 기본값
    }

    if (!portfolios || portfolios.length === 0) {
      return 'post-1' // 첫 번째 포스트
    }

    // 가장 큰 숫자 찾기
    let maxNumber = 0
    for (const portfolio of portfolios) {
      const match = portfolio.slug.match(/^post-(\d+)$/)
      if (match) {
        const num = parseInt(match[1], 10)
        if (num > maxNumber) {
          maxNumber = num
        }
      }
    }

    return `post-${maxNumber + 1}`
  } catch (error) {
    console.error('slug 생성 중 오류:', error)
    return 'post-1'
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
    const { title, description, content, imageUrl, tags } = body

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

    // 다음 사용 가능한 slug 생성
    const slug = await generateNextSlug()

    // Supabase에 새 포스트 저장
    const { data: newPortfolio, error } = await supabase
      .from('portfolio')
      .insert({
        title,
        slug, // 생성된 slug 저장
        description: description, // 설명 필드 저장
        content: content, // 마크다운 본문
        author_id: USER_UID,
        tags: tags || [], // 전달받은 태그 사용
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
      slug: newPortfolio.slug, // DB에서 저장된 slug 사용
      title: newPortfolio.title,
      description: newPortfolio.description,
      content: newPortfolio.content,
      imageUrl: newPortfolio.thumbnail || imageUrl,
      tags: newPortfolio.tags || [],
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