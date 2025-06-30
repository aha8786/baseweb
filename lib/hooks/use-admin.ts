"use client"

import { useState, useEffect } from "react"

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("admin-token")
    setIsAdmin(!!token)
    setIsLoading(false)
  }, [])

  const setAdminStatus = (status: boolean) => {
    setIsAdmin(status)
    if (!status) {
      localStorage.removeItem("admin-token")
    }
  }

  return {
    isAdmin,
    isLoading,
    setAdminStatus,
  }
} 