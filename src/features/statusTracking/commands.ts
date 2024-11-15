import { commands, window, type TextEditor } from 'vscode';
import type { StatusStore, RowStatus } from './types';

interface StatusCommands {
  markReviewed: string;
  markFlagged: string;
  addNote: string;
  clearStatus: string;
}

export const STATUS_COMMANDS: StatusCommands = {
  markReviewed: 'dataset-review.markReviewed',
  markFlagged: 'dataset-review.markFlagged',
  addNote: 'dataset-review.addNote',
  clearStatus: 'dataset-review.clearStatus'
};

export const registerStatusCommands = (
  editor: TextEditor,
  store: StatusStore,
  currentRowIndex: number,
  onStatusChange: (index: number, status: RowStatus) => void
) => [
  commands.registerCommand(STATUS_COMMANDS.markReviewed, () => {
    const result = store.setStatus(currentRowIndex, 'reviewed');
    if (result.ok) {
      onStatusChange(currentRowIndex, 'reviewed');
    }
  }),

  commands.registerCommand(STATUS_COMMANDS.markFlagged, () => {
    const result = store.setStatus(currentRowIndex, 'flagged');
    if (result.ok) {
      onStatusChange(currentRowIndex, 'flagged');
    }
  }),

  commands.registerCommand(STATUS_COMMANDS.addNote, async () => {
    const note = await window.showInputBox({
      prompt: 'Add note for current row',
      placeHolder: 'Enter note...'
    });
    
    if (note) {
      const status = store.getStatus(currentRowIndex);
      if (status.ok) {
        store.setStatus(currentRowIndex, status.value.status, note);
      }
    }
  }),

  commands.registerCommand(STATUS_COMMANDS.clearStatus, () => {
    const result = store.setStatus(currentRowIndex, 'pending');
    if (result.ok) {
      onStatusChange(currentRowIndex, 'pending');
    }
  })
];