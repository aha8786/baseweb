"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface AdminAuthDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAuthSuccess: () => void
}

export function AdminAuthDialog({ open, onOpenChange, onAuthSuccess }: AdminAuthDialogProps) {
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async () => {
    try {
      setIsLoading(true)
      setError("")

      const response = await fetch("/api/verify-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      })

      if (!response.ok) {
        throw new Error("인증에 실패했습니다.")
      }

      const { token } = await response.json()
      localStorage.setItem("admin-token", token)
      onAuthSuccess()
      onOpenChange(false)
    } catch (error) {
      if (error instanceof Error) {
        setError(`인증 실패: ${error.message}`)
      } else {
        setError("비밀번호가 올바르지 않습니다.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>관리자 인증</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
          {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            취소
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "인증 중..." : "확인"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 