import type { ExtensionContext, TextEditor, Disposable } from 'vscode';
import type { ReviewState } from '../../types';
import { registerNavigationCommands } from './commands';
import { createStatusBar, updateStatusBar } from './statusBar';
import { createRowPanel, updateRowPanel } from '../ui/rowPanel';
import {
  createRowHighlight,
  highlightCurrentRow,
} from '../fileHandling/decorations';
import { getCurrentRow } from '../fileHandling/rowManager';

export const initializeNavigation = (
  context: ExtensionContext,
  editor: TextEditor,
  initialState: ReviewState
): Disposable[] => {
  // Initialize UI components
  const statusBar = createStatusBar();
  const rowPanelState = createRowPanel(context);
  const highlightDecoration = createRowHighlight();

  // State update handler
  const handleStateChange = (newState: ReviewState) => {
    // Update UI components
    updateStatusBar(statusBar, newState);

    const rowResult = getCurrentRow(
      {
        currentIndex: newState.currentIndex,
        totalRows: newState.totalRows,
        rows: newState.rows || [],
        positions: newState.positions
      }
    );

    if (rowResult.ok) {
      updateRowPanel(rowPanelState, rowResult.value);
      highlightCurrentRow(
        editor,
        rowResult.value.position,
        highlightDecoration
      );
    }
  };

  // Register commands
  const commandDisposables = registerNavigationCommands(
    initialState,
    editor,
    handleStateChange
  );

  // Set initial UI state
  handleStateChange(initialState);

  return [
    ...commandDisposables,
    statusBar,
    highlightDecoration,
    rowPanelState.panel,
  ].filter((item): item is Disposable => item !== undefined);
};
