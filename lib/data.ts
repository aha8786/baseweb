import { Post } from "./types"

// 데이터 로직에서 환경변수 로깅
console.log("Data Layer NEXT_PUBLIC_MANAGER_MODE:", process.env.NEXT_PUBLIC_MANAGER_MODE)

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

export function getPosts(): Post[] {
  return posts
}

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug)
} 