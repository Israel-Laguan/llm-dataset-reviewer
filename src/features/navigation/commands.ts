import { commands, window, type TextEditor } from 'vscode';
import type {ReviewState } from '../../types';
import { nextRow, previousRow } from '../fileHandling/rowManager';

interface NavigationCommands {
  nextRow: string;
  previousRow: string;
  jumpToRow: string;
}

export const NAVIGATION_COMMANDS: NavigationCommands = {
  nextRow: 'llm-dataset-reviewer.nextRow',
  previousRow: 'llm-dataset-reviewer.previousRow',
  jumpToRow: 'llm-dataset-reviewer.jumpToRow'
};

export const registerNavigationCommands = (
  state: ReviewState,
  editor: TextEditor,
  onStateChange: (newState: ReviewState) => void
) => [
  commands.registerCommand(NAVIGATION_COMMANDS.nextRow, () => {
    const result = nextRow({ 
      currentIndex: state.currentIndex,
      totalRows: state.totalRows,
      rows: [] // We'll improve this later with proper state management
    });
    
    if (result.ok) {
      onStateChange({
        ...state,
        currentIndex: result.value.currentIndex
      });
    } else {
      window.showInformationMessage('Reached end of dataset');
    }
  }),
  
  commands.registerCommand(NAVIGATION_COMMANDS.previousRow, () => {
    const result = previousRow({
      currentIndex: state.currentIndex,
      totalRows: state.totalRows,
      rows: []
    });
    
    if (result.ok) {
      onStateChange({
        ...state,
        currentIndex: result.value.currentIndex
      });
    } else {
      window.showInformationMessage('At start of dataset');
    }
  }),
  
  commands.registerCommand(NAVIGATION_COMMANDS.jumpToRow, async () => {
    const input = await window.showInputBox({
      prompt: 'Enter row number',
      validateInput: (value) => {
        const num = Number.parseInt(value);
        if (Number.isNaN(num)) return 'Please enter a valid number';
        if (num < 1 || num > state.totalRows) return 'Row number out of range';
        return null;
      }
    });
    
    if (input) {
      onStateChange({
        ...state,
        currentIndex: Number.parseInt(input) - 1
      });
    }
  })
];