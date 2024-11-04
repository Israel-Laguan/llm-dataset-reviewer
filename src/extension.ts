import { type ExtensionContext, commands, window } from 'vscode';
import { getConfig } from './utils/config';
import { validateFile } from './utils/fileValidator';
import { initializeFeatures } from './features/initialize';
import { MESSAGES } from './constants/messages';

export const activate = async (context: ExtensionContext) => {
  const config = getConfig();

  // Register commands
  const disposables = [
    commands.registerCommand('llm-dataset-reviewer.startReview', async () => {
      const editor = window.activeTextEditor;
      if (!editor) {
        window.showErrorMessage('No active editor found');
        return;
      }

      const validationResult = await validateFile(editor.document.uri);
      if (!validationResult.valid) {
        window.showErrorMessage(
          validationResult.message ?? MESSAGES.errors.INITIALIZATION_FAILED
        );
        return;
      }

      if (validationResult.warning) {
        window.showWarningMessage(validationResult.warning);
      }

      // Initialize review session
      await initializeFeatures(context, editor, config);
    }),
  ];

  context.subscriptions.push(...disposables);
};

export const deactivate = () => {};
