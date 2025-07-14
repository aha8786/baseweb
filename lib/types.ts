export interface Post {
  id: string
  slug: string
  title: string
  description: string
  content: string
  imageUrl: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

// Portfolio 테이블 구조에 맞는 타입 추가
export interface Portfolio {
  id: string
  title: string
  slug: string // slug 필드 추가
  description: string // 설명 필드 추가
  content: string // 마크다운 본문
  author_id: string | null
  tags: string[]
  thumbnail: string | null
  is_published: boolean
  created_at: string
  updated_at: string | null
}

// 프론트엔드에서 사용할 포스트 타입 (Portfolio를 Post 형태로 변환)
export interface PostFromPortfolio extends Post {
  tags: string[]
  isPublished: boolean
} 