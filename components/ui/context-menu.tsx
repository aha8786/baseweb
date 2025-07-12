import { useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ContextMenuPosition {
  x: number;
  y: number;
}

interface ContextMenuProps {
  isVisible: boolean;
  position: ContextMenuPosition;
  onClose: () => void;
  onApplyHeader: (level: number) => void;
  onApplyTextStyle: (style: 'bold' | 'italic' | 'strikethrough') => void;
  onApplyList: (type: 'ordered' | 'unordered') => void;
  onApplyLink: () => void;
  onApplyImage: () => void;
  onApplyCode: (type: 'inline' | 'block') => void;
  onApplyBlockquote: () => void;
  onApplyHorizontalRule: () => void;
  onApplyTable: () => void;
  onApplyTaskList: () => void;
  onApplyTextColor: (color: string) => void;
}

export function ContextMenu({ 
  isVisible, 
  position, 
  onClose,
  onApplyHeader,
  onApplyTextStyle,
  onApplyList,
  onApplyLink,
  onApplyImage,
  onApplyCode,
  onApplyBlockquote,
  onApplyHorizontalRule,
  onApplyTable,
  onApplyTaskList,
  onApplyTextColor,
}: ContextMenuProps) {
  
  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = () => {
      if (isVisible) {
        console.log('🎯 커스텀 메뉴 외부 클릭으로 닫힘');
        onClose();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isVisible, onClose]);

  const handleAction = (action: string, actionFn: () => void) => {
    console.group('🎯 커스텀 메뉴 액션 실행');
    console.log('선택된 액션:', action);
    console.groupEnd();
    
    actionFn();
    onClose();
  };

  if (!isVisible) return null;

  return (
    <>
      {/* 배경 오버레이 */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      {/* 메뉴 */}
      <div
        className={cn(
          "fixed z-50 w-56 bg-background rounded-lg shadow-lg border py-1 max-h-96 overflow-y-auto",
          "animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
        )}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      >
        {/* 제목 (Headers) */}
        <div className="px-3 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">제목</div>
        <button
          onClick={() => handleAction('header-1', () => onApplyHeader(1))}
          className="w-full px-4 py-2 text-left hover:bg-accent hover:text-accent-foreground flex items-center text-sm"
        >
          <span className="mr-2 text-xl font-bold">H1</span> 제목 1
        </button>
        <button
          onClick={() => handleAction('header-2', () => onApplyHeader(2))}
          className="w-full px-4 py-2 text-left hover:bg-accent hover:text-accent-foreground flex items-center text-sm"
        >
          <span className="mr-2 text-lg font-bold">H2</span> 제목 2
        </button>
        <button
          onClick={() => handleAction('header-3', () => onApplyHeader(3))}
          className="w-full px-4 py-2 text-left hover:bg-accent hover:text-accent-foreground flex items-center text-sm"
        >
          <span className="mr-2 text-base font-bold">H3</span> 제목 3
        </button>
        
        <hr className="my-1 border-border" />
        
        {/* 텍스트 스타일 (Text Styles) */}
        <div className="px-3 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">텍스트 스타일</div>
        <button
          onClick={() => handleAction('bold', () => onApplyTextStyle('bold'))}
          className="w-full px-4 py-2 text-left hover:bg-accent hover:text-accent-foreground flex items-center text-sm"
        >
          <span className="mr-2 font-bold">B</span> 굵게
        </button>
        <button
          onClick={() => handleAction('italic', () => onApplyTextStyle('italic'))}
          className="w-full px-4 py-2 text-left hover:bg-accent hover:text-accent-foreground flex items-center text-sm"
        >
          <span className="mr-2 italic">I</span> 기울임
        </button>
        <button
          onClick={() => handleAction('strikethrough', () => onApplyTextStyle('strikethrough'))}
          className="w-full px-4 py-2 text-left hover:bg-accent hover:text-accent-foreground flex items-center text-sm"
        >
          <span className="mr-2 line-through">S</span> 취소선
        </button>
        
        <hr className="my-1 border-border" />
        
        {/* 글자 색상 (Text Color) */}
        <div className="px-3 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">글자 색상</div>
        <button
          onClick={() => handleAction('color-red', () => onApplyTextColor('#ef4444'))}
          className="w-full px-4 py-2 text-left hover:bg-accent hover:text-accent-foreground flex items-center text-sm"
        >
          <span className="mr-2 w-4 h-4 rounded-full bg-red-500"></span> 빨간색
        </button>
        <button
          onClick={() => handleAction('color-blue', () => onApplyTextColor('#3b82f6'))}
          className="w-full px-4 py-2 text-left hover:bg-accent hover:text-accent-foreground flex items-center text-sm"
        >
          <span className="mr-2 w-4 h-4 rounded-full bg-blue-500"></span> 파란색
        </button>
        <button
          onClick={() => handleAction('color-green', () => onApplyTextColor('#10b981'))}
          className="w-full px-4 py-2 text-left hover:bg-accent hover:text-accent-foreground flex items-center text-sm"
        >
          <span className="mr-2 w-4 h-4 rounded-full bg-green-500"></span> 초록색
        </button>
        <button
          onClick={() => handleAction('color-yellow', () => onApplyTextColor('#f59e0b'))}
          className="w-full px-4 py-2 text-left hover:bg-accent hover:text-accent-foreground flex items-center text-sm"
        >
          <span className="mr-2 w-4 h-4 rounded-full bg-yellow-500"></span> 노란색
        </button>
        <button
          onClick={() => handleAction('color-purple', () => onApplyTextColor('#8b5cf6'))}
          className="w-full px-4 py-2 text-left hover:bg-accent hover:text-accent-foreground flex items-center text-sm"
        >
          <span className="mr-2 w-4 h-4 rounded-full bg-purple-500"></span> 보라색
        </button>
        <button
          onClick={() => handleAction('color-gray', () => onApplyTextColor('#6b7280'))}
          className="w-full px-4 py-2 text-left hover:bg-accent hover:text-accent-foreground flex items-center text-sm"
        >
          <span className="mr-2 w-4 h-4 rounded-full bg-gray-500"></span> 회색
        </button>
        
        <hr className="my-1 border-border" />
        
        {/* 목록 (Lists) */}
        <div className="px-3 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">목록</div>
        <button
          onClick={() => handleAction('unordered-list', () => onApplyList('unordered'))}
          className="w-full px-4 py-2 text-left hover:bg-accent hover:text-accent-foreground flex items-center text-sm"
        >
          <span className="mr-2">•</span> 순서 없는 목록
        </button>
        <button
          onClick={() => handleAction('ordered-list', () => onApplyList('ordered'))}
          className="w-full px-4 py-2 text-left hover:bg-accent hover:text-accent-foreground flex items-center text-sm"
        >
          <span className="mr-2">1.</span> 순서 있는 목록
        </button>
        <button
          onClick={() => handleAction('task-list', () => onApplyTaskList())}
          className="w-full px-4 py-2 text-left hover:bg-accent hover:text-accent-foreground flex items-center text-sm"
        >
          <span className="mr-2">☑</span> 체크리스트
        </button>
        
        <hr className="my-1 border-border" />
        
        {/* 기타 요소들 */}
        <div className="px-3 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">요소</div>
        <button
          onClick={() => handleAction('link', onApplyLink)}
          className="w-full px-4 py-2 text-left hover:bg-accent hover:text-accent-foreground flex items-center text-sm"
        >
          <span className="mr-2">🔗</span> 링크
        </button>
        <button
          onClick={() => handleAction('image', onApplyImage)}
          className="w-full px-4 py-2 text-left hover:bg-accent hover:text-accent-foreground flex items-center text-sm"
        >
          <span className="mr-2">🖼️</span> 이미지
        </button>
        <button
          onClick={() => handleAction('inline-code', () => onApplyCode('inline'))}
          className="w-full px-4 py-2 text-left hover:bg-accent hover:text-accent-foreground flex items-center text-sm"
        >
          <span className="mr-2 font-mono bg-muted px-1 rounded">`</span> 인라인 코드
        </button>
        <button
          onClick={() => handleAction('code-block', () => onApplyCode('block'))}
          className="w-full px-4 py-2 text-left hover:bg-accent hover:text-accent-foreground flex items-center text-sm"
        >
          <span className="mr-2">💻</span> 코드 블록
        </button>
        <button
          onClick={() => handleAction('blockquote', onApplyBlockquote)}
          className="w-full px-4 py-2 text-left hover:bg-accent hover:text-accent-foreground flex items-center text-sm"
        >
          <span className="mr-2">💬</span> 인용
        </button>
        <button
          onClick={() => handleAction('horizontal-rule', onApplyHorizontalRule)}
          className="w-full px-4 py-2 text-left hover:bg-accent hover:text-accent-foreground flex items-center text-sm"
        >
          <span className="mr-2">📏</span> 수평선
        </button>
        <button
          onClick={() => handleAction('table', onApplyTable)}
          className="w-full px-4 py-2 text-left hover:bg-accent hover:text-accent-foreground flex items-center text-sm"
        >
          <span className="mr-2">📊</span> 표
        </button>
      </div>
    </>
  );
} 