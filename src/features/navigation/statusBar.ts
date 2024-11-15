import { window, type StatusBarItem, StatusBarAlignment } from 'vscode';
import type { ReviewState } from '../../types';

export const createStatusBar = (): StatusBarItem => {
  const statusBar = window.createStatusBarItem(StatusBarAlignment.Left);
  statusBar.show();
  return statusBar;
};

export const updateStatusBar = (
  statusBar: StatusBarItem,
  state: ReviewState
): void => {
  statusBar.text = `$(list-ordered) Row ${state.currentIndex + 1}/${state.totalRows}`;
  statusBar.tooltip = 'Click to jump to row';
  statusBar.command = 'llm-dataset-reviewer.jumpToRow';
};