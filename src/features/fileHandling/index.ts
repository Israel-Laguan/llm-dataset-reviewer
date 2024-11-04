import type { TextEditor } from 'vscode';
import type { Result, ReviewState } from '../../types';
import { parseDataset } from './parser';
import { createRowManager, getCurrentRow } from './rowManager';
import { createRowHighlight, highlightCurrentRow } from './decorations';

export const initializeFileHandling = async (
  editor: TextEditor
): Promise<Result<ReviewState>> => {
  // Parse document content
  const parseResult = parseDataset(editor.document);
  if (!parseResult.ok) {
    return parseResult;
  }

  // Initialize row manager
  const rowManager = createRowManager(
    parseResult.value.rows,
    parseResult.value.totalRows,
    parseResult.value.positions
  );
  const currentRowResult = getCurrentRow(rowManager);
  if (!currentRowResult.ok) {
    return currentRowResult;
  }

  // Setup highlighting
  const highlightDecoration = createRowHighlight();
  highlightCurrentRow(
    editor,
    currentRowResult.value.position,
    highlightDecoration
  );

  return {
    ok: true,
    value: {
      currentIndex: 0,
      rows: parseResult.value.rows,
      totalRows: parseResult.value.totalRows,
      isReviewing: true,
      positions: parseResult.value.positions,
    },
  };
};
