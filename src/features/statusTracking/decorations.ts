import { window, type TextEditorDecorationType, Range, type TextEditor } from 'vscode';
import type { RowStatus } from './types';

interface StatusDecorations {
  [key: string]: TextEditorDecorationType;
}

export const createStatusDecorations = (): StatusDecorations => ({
  pending: window.createTextEditorDecorationType({
    backgroundColor: 'rgba(100, 100, 100, 0.2)',
    isWholeLine: true,
  }),
  reviewed: window.createTextEditorDecorationType({
    backgroundColor: 'rgba(0, 100, 0, 0.2)',
    isWholeLine: true,
  }),
  flagged: window.createTextEditorDecorationType({
    backgroundColor: 'rgba(100, 0, 0, 0.2)',
    isWholeLine: true,
  })
});

export const updateStatusDecoration = (
  editor: TextEditor,
  line: number,
  status: RowStatus,
  decorations: StatusDecorations
): void => {
  const range = new Range(line, 0, line, Number.MAX_VALUE);
  
  // Clear all status decorations for this line
  // biome-ignore lint/complexity/noForEach: <explanation>
      Object.values(decorations).forEach(decoration => 
    editor.setDecorations(decoration, [])
  );
  
  // Apply new decoration
  editor.setDecorations(decorations[status], [range]);
};