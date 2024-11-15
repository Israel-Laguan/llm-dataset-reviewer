import { window, workspace, type TextEditor } from 'vscode';
import type { Result, ReviewState } from '../../types';
import { parseDataset } from './parser';
import { createRowManager, getCurrentRow } from './rowManager';
import { createRowHighlight, highlightCurrentRow } from './decorations';
import { MESSAGES } from '../../constants/messages';
import { getConfig } from '../../utils/config';

export const initializeFileHandling = async (
  editor: TextEditor
): Promise<Result<ReviewState>> => {
  const fileExtension = editor.document.uri.fsPath.split('.').pop();
  if (fileExtension !== 'json' && fileExtension !== 'jsonl') {
    return {
      ok: false,
      error: new Error(MESSAGES.errors.INVALID_FILE),
    };
  }

  const config = getConfig();
  if (editor.document.uri.fsPath.split('.').pop() !== 'json' && editor.document.uri.fsPath.split('.').pop() !== 'jsonl') {
    return {
      ok: false,
      error: new Error(MESSAGES.errors.INVALID_FILE),
    };
  }
  const stat = await workspace.fs.stat(editor.document.uri);
  if (stat.size > config.maxFileSize) {
    return {
      ok: false,
      error: new Error(MESSAGES.errors.INVALID_FILE),
    };
  }
  if (stat.size > config.maxFileSize / 2) {
    window.showWarningMessage(MESSAGES.warnings.LARGE_FILE);
  }
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
