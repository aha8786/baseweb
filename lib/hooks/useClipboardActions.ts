import { useCallback } from 'react';

interface UseClipboardActionsProps {
  content: string;
  selectionRange: { start: number; end: number } | null;
  selectedText: string;
  onChange?: (content: string) => void;
}

export function useClipboardActions({ 
  content, 
  selectionRange, 
  selectedText, 
  onChange 
}: UseClipboardActionsProps) {
  
  // 텍스트 변환 헬퍼 함수
  const replaceSelectedText = useCallback((newText: string) => {
    if (selectionRange && onChange) {
      const newContent = 
        content.slice(0, selectionRange.start) + 
        newText + 
        content.slice(selectionRange.end);
      onChange(newContent);
    }
  }, [content, selectionRange, onChange]);

  // 마크다운 기능들
  const applyHeader = useCallback((level: number) => {
    if (selectedText) {
      const headerPrefix = '#'.repeat(level) + ' ';
      // 줄마다 헤더 적용 (가이드라인: 라인 시작점에 줄마다 적용)
      const lines = selectedText.split('\n');
      const headerLines = lines.map(line => {
        // 이미 헤더가 있는 경우 제거 후 새 헤더 적용
        const cleanLine = line.replace(/^#+\s*/, '');
        return headerPrefix + cleanLine;
      });
      replaceSelectedText(headerLines.join('\n'));
      console.log(`📝 헤더 ${level} 적용 (줄마다):`, selectedText);
    }
  }, [selectedText, replaceSelectedText]);

  const applyTextStyle = useCallback((style: 'bold' | 'italic' | 'strikethrough') => {
    if (selectedText) {
      let styledText = '';
      switch (style) {
        case 'bold':
          styledText = `**${selectedText}**`;
          break;
        case 'italic':
          styledText = `*${selectedText}*`;
          break;
        case 'strikethrough':
          styledText = `~~${selectedText}~~`;
          break;
      }
      replaceSelectedText(styledText);
      console.log(`🎨 ${style} 스타일 적용:`, selectedText);
    }
  }, [selectedText, replaceSelectedText]);

  const applyList = useCallback((type: 'ordered' | 'unordered') => {
    if (selectedText) {
      const lines = selectedText.split('\n');
      const listItems = lines.map((line, index) => {
        if (type === 'ordered') {
          return `${index + 1}. ${line}`;
        } else {
          return `- ${line}`;
        }
      });
      replaceSelectedText(listItems.join('\n'));
      console.log(`📋 ${type} 목록 적용:`, selectedText);
    }
  }, [selectedText, replaceSelectedText]);

  const applyLink = useCallback(() => {
    if (selectedText) {
      const linkText = `[${selectedText}](URL)`;
      replaceSelectedText(linkText);
      console.log('🔗 링크 적용:', selectedText);
    }
  }, [selectedText, replaceSelectedText]);

  const applyImage = useCallback(() => {
    if (selectedText) {
      const imageText = `![${selectedText}](IMAGE_URL)`;
      replaceSelectedText(imageText);
      console.log('🖼️ 이미지 적용:', selectedText);
    }
  }, [selectedText, replaceSelectedText]);

  const applyCode = useCallback((type: 'inline' | 'block') => {
    if (selectedText) {
      let codeText = '';
      if (type === 'inline') {
        codeText = `\`${selectedText}\``;
      } else {
        codeText = `\`\`\`\n${selectedText}\n\`\`\``;
      }
      replaceSelectedText(codeText);
      console.log(`💻 ${type} 코드 적용:`, selectedText);
    }
  }, [selectedText, replaceSelectedText]);

  const applyBlockquote = useCallback(() => {
    if (selectedText) {
      const lines = selectedText.split('\n');
      const quotedLines = lines.map(line => `> ${line}`);
      replaceSelectedText(quotedLines.join('\n'));
      console.log('💬 인용 적용:', selectedText);
    }
  }, [selectedText, replaceSelectedText]);

  const applyHorizontalRule = useCallback(() => {
    if (selectedText) {
      // 가이드라인: 선택된 문장 시작위치와 마지막 위치에 값 추가
      const horizontalRuleText = `---\n${selectedText}\n---`;
      replaceSelectedText(horizontalRuleText);
      console.log('📏 수평선 추가 (시작+끝):', selectedText);
    } else {
      // 선택된 텍스트가 없으면 단순히 수평선만 추가
      replaceSelectedText('---');
      console.log('📏 수평선 추가');
    }
  }, [selectedText, replaceSelectedText]);

  const applyTable = useCallback(() => {
    const tableTemplate = `| 헤더1 | 헤더2 | 헤더3 |
|-------|-------|-------|
| 셀1   | 셀2   | 셀3   |`;
    
    if (selectionRange && onChange) {
      // 선택된 블록 바로 윗줄에 표 추가, 선택된 블록은 유지
      const beforeSelection = content.slice(0, selectionRange.start);
      
      // 마지막 줄바꿈 위치 찾기
      const lastNewlineIndex = beforeSelection.lastIndexOf('\n');
      let insertPosition;
      
      if (lastNewlineIndex === -1) {
        // 문서 처음인 경우
        insertPosition = 0;
      } else {
        // 마지막 줄바꿈 다음 위치 (현재 줄의 시작)
        insertPosition = lastNewlineIndex + 1;
      }
      
      const newContent = 
        content.slice(0, insertPosition) + 
        tableTemplate + '\n\n' + 
        content.slice(insertPosition);
      
      onChange(newContent);
      console.log('📊 표 추가 (윗줄에, 선택 블록 유지)');
    }
  }, [content, selectionRange, onChange]);

  const applyTaskList = useCallback(() => {
    if (selectedText) {
      const lines = selectedText.split('\n');
      const taskItems = lines.map(line => `- [ ] ${line}`);
      replaceSelectedText(taskItems.join('\n'));
      console.log('✅ 체크리스트 적용:', selectedText);
    }
  }, [selectedText, replaceSelectedText]);

  const applyTextColor = useCallback((color: string) => {
    if (selectedText) {
      // HTML 스타일로 색상 적용 (나중에 마크다운 확장 문법이나 다른 방식으로 변경 가능)
      const coloredText = `<span style="color: ${color}">${selectedText}</span>`;
      replaceSelectedText(coloredText);
      console.log(`🎨 텍스트 색상 적용 (${color}):`, selectedText);
    }
  }, [selectedText, replaceSelectedText]);

  return {
    applyHeader,
    applyTextStyle,
    applyList,
    applyLink,
    applyImage,
    applyCode,
    applyBlockquote,
    applyHorizontalRule,
    applyTable,
    applyTaskList,
    applyTextColor,
  };
} 