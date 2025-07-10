import { getPosts } from "@/lib/data"
import PostCard from "@/components/post-card"
import { ClientAdminButton } from "@/components/client-admin-button"

const isManagerMode = process.env.NEXT_PUBLIC_MANAGER_MODE === "true"

export default async function Home() {
  const posts = await getPosts()

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Posts</h1>
        {isManagerMode && <ClientAdminButton />}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} isManagerMode={isManagerMode} />
        ))}
      </div>
    </main>
  )
}
