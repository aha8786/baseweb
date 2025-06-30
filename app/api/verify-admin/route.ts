import { NextResponse } from "next/server"
import bcrypt from "bcrypt"
import { sign } from "jsonwebtoken"

// 환경변수 디버깅
console.log("=== 환경변수 디버깅 ===")
console.log("모든 환경변수 키:", Object.keys(process.env))
console.log("ADMIN_PASSWORD_HASH 존재 여부:", !!process.env.ADMIN_PASSWORD_HASH)
console.log("ADMIN_PASSWORD_HASH 값:", process.env.ADMIN_PASSWORD_HASH)
console.log("=====================")

const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH
const JWT_SECRET = process.env.JWT_SECRET || "default-secret-key"

// 디버깅을 위한 로그
console.log("Stored hash:", ADMIN_PASSWORD_HASH)

export async function POST(request: Request) {
  try {
    const { password } = await request.json()
    
    // 디버깅을 위한 로그
    console.log("Received password:", password)
    console.log("Hash exists:", !!ADMIN_PASSWORD_HASH)

    if (!ADMIN_PASSWORD_HASH) {
      return NextResponse.json(
        { error: "Admin password not configured" },
        { status: 500 }
      )
    }

    const isValid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH)
    
    // 디버깅을 위한 로그
    console.log("Password validation result:", isValid)

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 401 }
      )
    }

    // 토큰 생성
    const token = sign({ role: "admin" }, JWT_SECRET, { expiresIn: "1d" })

    return NextResponse.json({ token })
  } catch (error) {
    // 디버깅을 위한 로그
    console.error("Authentication error:", error)
    
    const errorMessage = error instanceof Error 
      ? `Authentication failed: ${error.message}`
      : "Authentication failed"
      
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
} 