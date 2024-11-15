import type { ExtensionContext, TextEditor, Disposable } from 'vscode';
import type { ReviewState } from '../../types';
import { createStatusStore } from './store';
import { createStatusDecorations, updateStatusDecoration } from './decorations';
import { registerStatusCommands } from './commands';
import type { RowStatus } from './types';

export const initializeStatusTracking = (
  context: ExtensionContext,
  editor: TextEditor,
  state: ReviewState
): Disposable[] => {
  const store = createStatusStore(context, editor.document.uri);
  const decorations = createStatusDecorations();

  // Handle status changes
  const handleStatusChange = (index: number, status: RowStatus) => {
    updateStatusDecoration(editor, index, status, decorations);
  };

  // Register commands
  const commandDisposables = registerStatusCommands(
    editor,
    store,
    state.currentIndex,
    handleStatusChange
  );

  // Initialize decorations for existing statuses
  const statusesResult = store.getAllStatuses();
  if (statusesResult.ok) {
    // biome-ignore lint/complexity/noForEach: <explanation>
    Object.entries(statusesResult.value).forEach(([index, data]) => {
      handleStatusChange(Number.parseInt(index), data.status);
    });
  }

  return [
    ...commandDisposables,
    ...Object.values(decorations)
  ];
};