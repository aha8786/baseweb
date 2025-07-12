"use client"

import Link from "next/link"
import { Menu, Linkedin, Globe, Github } from "lucide-react"
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
              <span className="text-xl font-bold">개발흔적</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="https://www.naver.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-foreground/60 hover:text-foreground"
            >
              <Linkedin className="h-5 w-5" />
            </Link>
            <Link 
              href="https://www.naver.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-foreground/60 hover:text-foreground"
            >
              <Globe className="h-5 w-5" />
            </Link>
            <Link 
              href="https://www.naver.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-foreground/60 hover:text-foreground"
            >
              <Github className="h-5 w-5" />
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
                href="https://www.naver.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-3 py-2 text-foreground/60 hover:text-foreground flex items-center"
              >
                <Linkedin className="h-5 w-5 mr-2" />
                LinkedIn
              </Link>
              <Link
                href="https://www.naver.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-3 py-2 text-foreground/60 hover:text-foreground flex items-center"
              >
                <Globe className="h-5 w-5 mr-2" />
                Website
              </Link>
              <Link
                href="https://www.naver.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-3 py-2 text-foreground/60 hover:text-foreground flex items-center"
              >
                <Github className="h-5 w-5 mr-2" />
                GitHub
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
} 