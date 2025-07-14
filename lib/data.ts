import { Post, Portfolio } from "./types"
import { supabase } from "./supabaseClient"

// 데이터 로직에서 환경변수 로깅
console.log("Data Layer NEXT_PUBLIC_MANAGER_MODE:", process.env.NEXT_PUBLIC_MANAGER_MODE)

// 더미 데이터 (주석 처리)
/*
export const posts: Post[] = [
  {
    id: "1",
    slug: "nextjs-app-router",
    title: "Next.js App Router 시작하기",
    description: "Next.js 13의 새로운 App Router 기능을 알아봅니다.",
    content: "Next.js 13에서 도입된 App Router는 기존의 Pages Router와는 다른 방식으로 동작합니다...",
    imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
    createdAt: "2024-03-15",
    updatedAt: "2024-03-15"
  },
  {
    id: "2",
    slug: "typescript-best-practices",
    title: "TypeScript 모범 사례",
    description: "TypeScript를 효과적으로 사용하는 방법을 알아봅니다.",
    content: "TypeScript를 사용할 때 알아야 할 중요한 모범 사례들을 소개합니다...",
    imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97",
    createdAt: "2024-03-14",
    updatedAt: "2024-03-14"
  },
  {
    id: "3",
    slug: "responsive-design-principles",
    title: "반응형 디자인 원칙",
    description: "모든 디바이스에서 완벽한 사용자 경험 제공하기",
    content: "반응형 디자인은 현대 웹 개발에서...",
    imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop",
    createdAt: "2024-03-13",
    updatedAt: "2024-03-13"
  },
  {
    id: "4",
    slug: "tailwind-css-tips",
    title: "TailwindCSS 활용 팁",
    description: "효율적인 스타일링을 위한 베스트 프랙티스",
    content: "TailwindCSS는 유틸리티 우선 CSS 프레임워크로...",
    imageUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=2055&auto=format&fit=crop",
    createdAt: "2024-03-12",
    updatedAt: "2024-03-12"
  }
]
*/

// Portfolio 데이터를 Post 형태로 변환하는 함수
function portfolioToPost(portfolio: Portfolio): Post {
  // 기본 이미지 URL (이미지가 없는 경우에만 사용)
  const defaultImageUrl = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c'
  
  return {
    id: portfolio.id,
    slug: portfolio.slug, // DB에서 가져온 slug 사용
    title: portfolio.title,
    description: portfolio.description || portfolio.content, // description 필드가 있으면 사용, 없으면 content 사용
    content: portfolio.content,
    imageUrl: portfolio.thumbnail || defaultImageUrl, // 썸네일이 있으면 그대로 사용, 없으면 기본 이미지
    tags: portfolio.tags,
    createdAt: new Date(portfolio.created_at).toISOString().split('T')[0],
    updatedAt: portfolio.updated_at ? new Date(portfolio.updated_at).toISOString().split('T')[0] : new Date(portfolio.created_at).toISOString().split('T')[0]
  }
}

// Supabase에서 포트폴리오 데이터를 가져오는 함수
export async function getPosts(): Promise<Post[]> {
  try {
    const { data: portfolios, error } = await supabase
      .from('portfolio')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('포트폴리오 데이터를 가져오는 중 오류 발생:', error)
      return []
    }

    if (!portfolios) {
      return []
    }

    return portfolios.map(portfolioToPost)
  } catch (error) {
    console.error('포트폴리오 데이터를 가져오는 중 오류 발생:', error)
    return []
  }
}

// 특정 슬러그로 포스트를 가져오는 함수
export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  try {
    // DB에서 직접 slug로 조회
    const { data: portfolio, error } = await supabase
      .from('portfolio')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single()

    if (error) {
      console.error('포트폴리오 데이터를 가져오는 중 오류 발생:', error)
      return undefined
    }

    if (!portfolio) {
      return undefined
    }

    return portfolioToPost(portfolio)
  } catch (error) {
    console.error('포트폴리오 데이터를 가져오는 중 오류 발생:', error)
    return undefined
  }
} 