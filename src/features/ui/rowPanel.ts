import { window, ViewColumn, type WebviewPanel, type ExtensionContext } from 'vscode';
import type { DatasetRow } from '../../types';

interface RowPanelState {
  panel: WebviewPanel | undefined;
}

const getWebviewContent = (row: DatasetRow): string => {
  const content = JSON.stringify(row.content, null, 2);
  
  return `<!DOCTYPE html>
    <html>
      <head>
        <style>
          body { 
            padding: 1rem;
            font-family: var(--vscode-editor-font-family);
            color: var(--vscode-editor-foreground);
            background-color: var(--vscode-editor-background);
          }
          pre {
            background-color: var(--vscode-editor-inactiveSelectionBackground);
            padding: 1rem;
            border-radius: 4px;
          }
          .metadata {
            margin-bottom: 1rem;
            padding: 0.5rem;
            background-color: var(--vscode-editor-lineHighlightBackground);
            border-radius: 4px;
          }
        </style>
      </head>
      <body>
        <div class="metadata">
          <strong>Row Index:</strong> ${row.index + 1}
        </div>
        <pre><code>${content}</code></pre>
      </body>
    </html>`;
};

export const createRowPanel = (context: ExtensionContext): RowPanelState => {
  const panel = window.createWebviewPanel(
    'datasetRowView',
    'Dataset Row View',
    ViewColumn.Beside,
    {
      enableScripts: true,
      retainContextWhenHidden: true
    }
  );
  
  return { panel };
};

export const updateRowPanel = (
  state: RowPanelState,
  row: DatasetRow
): void => {
  if (state.panel) {
    state.panel.webview.html = getWebviewContent(row);
  }
};