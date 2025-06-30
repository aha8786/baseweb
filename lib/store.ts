import { create } from 'zustand'

type EditorMode = 'write' | 'preview'

interface EditorState {
  content: string
  mode: EditorMode
  setContent: (content: string) => void
  setMode: (mode: EditorMode) => void
}

export const useEditorStore = create<EditorState>((set) => ({
  content: '',
  mode: 'write',
  setContent: (content) => set({ content }),
  setMode: (mode) => set({ mode }),
})) 