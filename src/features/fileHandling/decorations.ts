import { window, Range, type TextEditor, type TextEditorDecorationType } from 'vscode';
import type { Position } from '../../types';

// Create decoration type for highlighting current row
export const createRowHighlight = (): TextEditorDecorationType =>
  window.createTextEditorDecorationType({
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    isWholeLine: true,
  });

export const highlightCurrentRow = (
  editor: TextEditor,
  position: Position,
  decorationType: TextEditorDecorationType
): void => {
  const range = new Range(position.line, 0, position.line, Number.MAX_VALUE);
  editor.setDecorations(decorationType, [range]);
};