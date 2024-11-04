import { window, TextEditor, ExtensionContext } from 'vscode';
import type { Result } from '../types';
import { FeatureFlags, getConfig } from '../utils/config';
import { initializeFileHandling } from './fileHandling';
import { initializeNavigation } from './navigation';
import { initializeStatusTracking } from './statusTracking';

const validateFeatureDependencies = (features: FeatureFlags): Result<void> => {
  const enabledFeatures = Object.entries(features)
    .filter(([_, feature]) => feature.enabled)
    .map(([name]) => name);

  const missingDependencies = Object.entries(features)
    .filter(([_, feature]) => feature.enabled)
    .flatMap(([_, feature]) =>
      feature.dependencies?.filter(
        (dep: string) => !enabledFeatures.includes(dep)
      )
    );

  return missingDependencies.length === 0
    ? { ok: true, value: undefined }
    : {
        ok: false,
        error: new Error(
          `Missing dependencies: ${missingDependencies.join(', ')}`
        ),
      };
};

const initializeFeatures = async (
  context: ExtensionContext,
  editor: TextEditor,
  config = getConfig()
): Promise<Result<void>> => {
  try {
    // Validate feature dependencies
    const validationResult = await validateFeatureDependencies(config.features);
    window.showInformationMessage('Initializing...');
    if (!validationResult.ok) {
      window.showErrorMessage(
        `Failed to validate dependencies: ${validationResult.error.message}`
      );
      return validationResult;
    }
    window.showInformationMessage('Dependencies verified!');

    // Initialize file handling
    const fileHandlingResult = await initializeFileHandling(editor);
    if (!fileHandlingResult.ok) {
      window.showErrorMessage(
        `Failed to initialize: ${fileHandlingResult.error.message}`
      );
      return fileHandlingResult;
    }

    // Initialize basic navigation if enabled
    if (config.features.basicNavigation.enabled) {
      const disposables = initializeNavigation(
        context,
        editor,
        fileHandlingResult.value
      );
      context.subscriptions.push(...disposables);
      window.showInformationMessage('Navigation initialized');
    }

    // Initialize status tracking if enabled
    if (config.features.statusTracking.enabled) {
      await initializeStatusTracking(context, editor, fileHandlingResult.value);
      window.showInformationMessage('Status tracking initialized');
    }

    window.showInformationMessage('LLM Dataset Reviewer initialized');

    return { ok: true, value: undefined };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error
          : new Error('Feature initialization failed'),
    };
  }
};

export { initializeFeatures };
