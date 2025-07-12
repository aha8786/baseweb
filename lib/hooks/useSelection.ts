import { useState, useEffect, useCallback, RefObject } from 'react';

interface UseSelectionProps {
  textareaRef: RefObject<HTMLTextAreaElement | null>;
}

interface LineColumnInfo {
  line: number;
  column: number;
}

interface SelectionInfo {
  start: number;
  end: number;
  text: string;
  startPosition: LineColumnInfo;
  endPosition: LineColumnInfo;
  lineBreaks: number[];
  totalLines: number;
}

export function useSelection({ textareaRef }: UseSelectionProps) {
  const [selectedText, setSelectedText] = useState('');
  const [selectionRange, setSelectionRange] = useState<{ start: number; end: number } | null>(null);

  // 텍스트에서 줄바꿈 위치를 찾는 함수
  const findLineBreaks = useCallback((text: string): number[] => {
    const lineBreaks: number[] = [];
    for (let i = 0; i < text.length; i++) {
      if (text[i] === '\n') {
        lineBreaks.push(i);
      }
    }
    return lineBreaks;
  }, []);

  // 절대 위치를 줄/컬럼 위치로 변환하는 함수
  const getLineColumnFromPosition = useCallback((text: string, position: number): LineColumnInfo => {
    const beforeText = text.substring(0, position);
    const lines = beforeText.split('\n');
    const line = lines.length;
    const column = lines[lines.length - 1].length + 1; // 1-based index
    
    return { line, column };
  }, []);

  // 상세한 선택 정보를 추출하는 함수
  const getDetailedSelectionInfo = useCallback((textarea: HTMLTextAreaElement, start: number, end: number): SelectionInfo => {
    const fullText = textarea.value;
    const selectedText = fullText.substring(start, end);
    
    // 전체 텍스트에서 줄바꿈 위치 찾기
    const allLineBreaks = findLineBreaks(fullText);
    
    // 선택된 텍스트 내의 줄바꿈 위치 찾기 (상대적 위치)
    const selectedLineBreaks = findLineBreaks(selectedText);
    
    // 절대 위치로 변환 (전체 텍스트 기준)
    const absoluteLineBreaks = selectedLineBreaks.map(pos => start + pos);
    
    // 시작/끝 위치의 줄/컬럼 정보
    const startPosition = getLineColumnFromPosition(fullText, start);
    const endPosition = getLineColumnFromPosition(fullText, end);
    
    // 전체 줄 수
    const totalLines = allLineBreaks.length + 1;
    
    return {
      start,
      end,
      text: selectedText,
      startPosition,
      endPosition,
      lineBreaks: absoluteLineBreaks,
      totalLines
    };
  }, [findLineBreaks, getLineColumnFromPosition]);

  // 선택 범위 저장
  const saveSelection = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return null;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    if (start === end) {
      setSelectionRange(null);
      setSelectedText('');
      return null;
    }

    const selectionInfo = getDetailedSelectionInfo(textarea, start, end);
    
    console.group('📍 선택 범위 저장');
    console.log('기본 정보:', {
      start: selectionInfo.start,
      end: selectionInfo.end,
      length: selectionInfo.text.length
    });
    console.log('시작 위치:', `줄 ${selectionInfo.startPosition.line}, 컬럼 ${selectionInfo.startPosition.column}`);
    console.log('끝 위치:', `줄 ${selectionInfo.endPosition.line}, 컬럼 ${selectionInfo.endPosition.column}`);
    console.log('선택된 텍스트:', `"${selectionInfo.text}"`);
    console.log('줄바꿈 위치들:', selectionInfo.lineBreaks);
    console.log('선택 영역 줄 수:', selectionInfo.endPosition.line - selectionInfo.startPosition.line + 1);
    console.log('전체 문서 줄 수:', selectionInfo.totalLines);
    console.groupEnd();

    setSelectionRange({ start, end });
    setSelectedText(selectionInfo.text);
    
    return selectionInfo;
  }, [textareaRef, getDetailedSelectionInfo]);

  // 선택 범위 복원
  const restoreSelection = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea || !selectionRange) return;

    textarea.focus();
    textarea.setSelectionRange(selectionRange.start, selectionRange.end);
    console.log('✅ 선택 범위 복원 완료:', selectionRange);
  }, [textareaRef, selectionRange]);

  // 선택 범위 초기화
  const clearSelection = useCallback(() => {
    setSelectionRange(null);
    setSelectedText('');
  }, []);

  // 텍스트 선택 변경 감지
  useEffect(() => {
    const handleSelection = () => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      if (start !== end) {
        const selectionInfo = getDetailedSelectionInfo(textarea, start, end);
        
        console.group('🔍 텍스트 선택됨');
        console.log('범위:', `${selectionInfo.start}-${selectionInfo.end}`);
        console.log('위치:', `줄 ${selectionInfo.startPosition.line}:${selectionInfo.startPosition.column} ~ 줄 ${selectionInfo.endPosition.line}:${selectionInfo.endPosition.column}`);
        console.log('텍스트:', `"${selectionInfo.text}"`);
        console.log('길이:', selectionInfo.text.length);
        if (selectionInfo.lineBreaks.length > 0) {
          console.log('줄바꿈 포함:', selectionInfo.lineBreaks.length + '개');
        }
        console.groupEnd();
      }
    };

    document.addEventListener('selectionchange', handleSelection);
    return () => document.removeEventListener('selectionchange', handleSelection);
  }, [textareaRef, getDetailedSelectionInfo]);

  return {
    selectedText,
    selectionRange,
    saveSelection,
    restoreSelection,
    clearSelection,
  };
} 