"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import {
  Bold,
  Italic,
  Heading,
  List,
  Code,
  Link as LinkIcon,
  Image,
  Table,
  CheckSquare,
  Minus,
} from "lucide-react"

// highlight.js 스타일 동적 로드
import "highlight.js/styles/github-dark.css"

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  error?: string
  required?: boolean
  className?: string
}

interface ToolbarButtonProps {
  icon: React.ReactNode
  label: string
  onClick: () => void
}

const ToolbarButton = ({ icon, label, onClick }: ToolbarButtonProps) => (
  <Button
    type="button"
    variant="ghost"
    size="sm"
    className="h-8 px-2"
    onClick={onClick}
  >
    {icon}
    <span className="sr-only">{label}</span>
  </Button>
)

export function MarkdownEditor({
  value,
  onChange,
  error,
  required = false,
  className,
}: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<string>("write")

  const insertText = (before: string, after: string = "") => {
    const textarea = document.querySelector(
      "textarea#markdown-content"
    ) as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    const newText =
      value.substring(0, start) +
      before +
      selectedText +
      after +
      value.substring(end)

    onChange(newText)
    
    // 다음 틱에서 포커스 및 선택 영역 복원
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(
        start + before.length,
        end + before.length
      )
    }, 0)
  }

  const toolbarActions = [
    {
      icon: <Bold className="h-4 w-4" />,
      label: "굵게",
      onClick: () => insertText("**", "**"),
    },
    {
      icon: <Italic className="h-4 w-4" />,
      label: "기울임",
      onClick: () => insertText("*", "*"),
    },
    {
      icon: <Heading className="h-4 w-4" />,
      label: "제목",
      onClick: () => insertText("### "),
    },
    {
      icon: <List className="h-4 w-4" />,
      label: "목록",
      onClick: () => insertText("- "),
    },
    {
      icon: <Code className="h-4 w-4" />,
      label: "코드",
      onClick: () => insertText("```\n", "\n```"),
    },
    {
      icon: <LinkIcon className="h-4 w-4" />,
      label: "링크",
      onClick: () => insertText("[", "](url)"),
    },
    {
      icon: <Image className="h-4 w-4" />,
      label: "이미지",
      onClick: () => insertText("![alt text](", ")"),
    },
    {
      icon: <Table className="h-4 w-4" />,
      label: "테이블",
      onClick: () => insertText("| 헤더1 | 헤더2 |\n|-------|-------|\n| 셀1   | 셀2   |\n"),
    },
    {
      icon: <CheckSquare className="h-4 w-4" />,
      label: "체크리스트",
      onClick: () => insertText("- [ ] "),
    },
    {
      icon: <Minus className="h-4 w-4" />,
      label: "취소선",
      onClick: () => insertText("~~", "~~"),
    },
  ]

  return (
    <div className={cn("space-y-2", className)}>
      <Tabs
        defaultValue="write"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="flex items-center justify-between mb-2">
          <TabsList>
            <TabsTrigger value="write">작성</TabsTrigger>
            <TabsTrigger value="preview">미리보기</TabsTrigger>
          </TabsList>
          {activeTab === "write" && (
            <div className="flex items-center space-x-1 border rounded-md">
              {toolbarActions.map((action, index) => (
                <ToolbarButton key={index} {...action} />
              ))}
            </div>
          )}
        </div>
        
        <TabsContent value="write" className="mt-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full"
          >
            <Textarea
              id="markdown-content"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              required={required}
              placeholder="마크다운으로 내용을 작성하세요..."
              className="min-h-[400px] font-mono resize-none"
            />
          </motion.div>
        </TabsContent>
        
        <TabsContent value="preview" className="mt-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="min-h-[400px] w-full rounded-md border bg-background p-4 overflow-y-auto"
          >
            <div className="prose max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
              >
                {value || "미리보기할 내용이 없습니다."}
              </ReactMarkdown>
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}