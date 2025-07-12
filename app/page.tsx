"use client"

import { getPosts } from "@/lib/data"
import PostCard from "@/components/post-card"
import { ClientAdminButton } from "@/components/client-admin-button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState, useEffect } from "react"
import { Post } from "@/lib/types"

const isManagerMode = process.env.NEXT_PUBLIC_MANAGER_MODE === "true"

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([])
  const [hoveredPost, setHoveredPost] = useState<Post | null>(null)

  useEffect(() => {
    const fetchPosts = async () => {
      const postsData = await getPosts()
      setPosts(postsData)
    }
    fetchPosts()
  }, [])

  return (
    <div className="h-screen flex flex-col">
      {/* 호버 디스플레이 영역 (고정) */}
      <div className="h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80 flex items-center justify-center" style={{ backgroundColor: '#f1cb8d' }}>
        <div className="flex items-center justify-center">
          {hoveredPost ? (
            // 미리보기 표시 - 하얀색 네모 도형 배경
            <div className="relative preview-container">
              <div 
                className="bg-white rounded-lg p-6 sm:p-8 md:p-10 max-w-2xl sm:max-w-3xl md:max-w-4xl lg:max-w-5xl mx-auto animate-slide-in-up flex items-center gap-6 sm:gap-8 md:gap-10"
                style={{ 
                  boxShadow: '10px 10px 10px rgba(0, 0, 0, 0.1)',
                }}
              >
                {/* 이미지 영역 */}
                <div className="flex-shrink-0 w-32 sm:w-40 md:w-48 lg:w-56 h-24 sm:h-32 md:h-36 lg:h-40 rounded-lg overflow-hidden animate-slide-in-bottom" style={{ animationDelay: '0.1s' }}>
                  <img
                    src={hoveredPost.imageUrl}
                    alt={hoveredPost.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* 텍스트 영역 */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 text-gray-800 animate-slide-in-bottom line-clamp-2" style={{ animationDelay: '0.2s' }}>
                    {hoveredPost.title}
                  </h2>
                  <p className="text-xs sm:text-sm md:text-base font-medium text-gray-600 leading-relaxed animate-slide-in-bottom line-clamp-3" style={{ animationDelay: '0.3s' }}>
                    {hoveredPost.description}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            // 기존 Hover over it. 텍스트
            <div className="flex items-center justify-center group cursor-pointer">
              {/* "Hover " */}
              <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold transition-all duration-300 ease-in-out group-hover:rotate-[-12deg] group-hover:translate-y-[-8px]" style={{ color: '#2c3f72' }}>H</span>
              <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold transition-all duration-300 ease-in-out" style={{ color: '#2c3f72' }}>o</span>
              <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold transition-all duration-300 ease-in-out group-hover:rotate-[8deg] group-hover:translate-y-[2px]" style={{ color: '#2c3f72' }}>v</span>
              <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold transition-all duration-300 ease-in-out group-hover:rotate-[-15deg] group-hover:translate-y-[-12px]" style={{ color: '#2c3f72' }}>e</span>
              <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold transition-all duration-300 ease-in-out group-hover:rotate-[12deg] group-hover:translate-y-[-4px]" style={{ color: '#2c3f72' }}>r</span>
              <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold mr-4" style={{ color: '#2c3f72' }}>&nbsp;</span>
              {/* "over " */}
              <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold transition-all duration-300 ease-in-out" style={{ color: '#2c3f72' }}>o</span>
              <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold transition-all duration-300 ease-in-out group-hover:rotate-[15deg] group-hover:translate-y-[-8px]" style={{ color: '#2c3f72' }}>v</span>
              <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold transition-all duration-300 ease-in-out group-hover:rotate-[-10deg] group-hover:translate-y-[4px]" style={{ color: '#2c3f72' }}>e</span>
              <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold transition-all duration-300 ease-in-out group-hover:rotate-[8deg] group-hover:translate-y-[-2px]" style={{ color: '#2c3f72' }}>r</span>
              <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold mr-4" style={{ color: '#2c3f72' }}>&nbsp;</span>
              {/* "it." */}
              <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold transition-all duration-300 ease-in-out group-hover:translate-y-[6px]" style={{ color: '#2c3f72' }}>i</span>
              <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold transition-all duration-300 ease-in-out group-hover:rotate-[-8deg] group-hover:translate-y-[-4px]" style={{ color: '#2c3f72' }}>t</span>
              <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold transition-all duration-300 ease-in-out group-hover:rotate-[-8deg] group-hover:translate-y-[-4px]" style={{ color: '#2c3f72' }}>.</span>
            </div>
          )}
        </div>
      </div>

      {/* 본문 영역 - 포스트 리스트 (스크롤 가능) */}
      <main className="flex-1 bg-background overflow-hidden">
        <div className="h-full p-4 sm:p-6 md:p-8">
          <div className="max-w-6xl mx-auto h-full">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl sm:text-4xl font-bold">Posts</h1>
              {isManagerMode && <ClientAdminButton />}
            </div>
            <ScrollArea className="h-full">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 pb-4">
                {posts.map((post) => (
                  <div 
                    key={post.id} 
                    className="card-hover-effect cursor-pointer"
                    onMouseEnter={() => setHoveredPost(post)}
                    onMouseLeave={() => setHoveredPost(null)}
                  >
                    <PostCard 
                      post={post} 
                      isManagerMode={isManagerMode} 
                    />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </main>
    </div>
  )
}
