"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PenSquare } from "lucide-react"
import Link from "next/link"
import { useAdmin } from "@/lib/hooks/use-admin"
import { AdminAuthDialog } from "./admin-auth-dialog"

export function ClientAdminButton() {
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const { isAdmin, setAdminStatus } = useAdmin()

  const handleAuthSuccess = () => {
    setAdminStatus(true)
  }

  return (
    <>
      {!isAdmin ? (
        <Button onClick={() => setShowAuthDialog(true)}>
          <PenSquare className="w-4 h-4 mr-2" />
          글 작성
        </Button>
      ) : (
        <Button asChild>
          <Link href="/posts/new">
            <PenSquare className="w-4 h-4 mr-2" />
            글 작성
          </Link>
        </Button>
      )}
      <AdminAuthDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
        onAuthSuccess={handleAuthSuccess}
      />
    </>
  )
} 