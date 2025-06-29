"use client"

import Link from "next/link"
import { Menu } from "lucide-react"
import { ModeToggle } from "./mode-toggle"
import { Button } from "./ui/button"
import { useState } from "react"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed w-full bg-background border-b z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold">DevPortfolio</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/portfolio" className="text-foreground/60 hover:text-foreground">
              포트폴리오
            </Link>
            <Link href="/community" className="text-foreground/60 hover:text-foreground">
              커뮤니티
            </Link>
            <ModeToggle />
          </div>

          {/* Mobile Navigation Button */}
          <div className="flex items-center md:hidden">
            <ModeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="ml-2"
              onClick={() => setIsOpen(!isOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="pt-2 pb-3 space-y-1">
              <Link
                href="/portfolio"
                className="block px-3 py-2 text-foreground/60 hover:text-foreground"
              >
                포트폴리오
              </Link>
              <Link
                href="/community"
                className="block px-3 py-2 text-foreground/60 hover:text-foreground"
              >
                커뮤니티
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
} 