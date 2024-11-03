import { window, TextEditor } from 'vscode';
import type { ReviewState, Result } from '../types';
import { FeatureFlags, getConfig } from '../utils/config';

const createReviewState = (editor: TextEditor): Result<ReviewState> => {
  try {
    const document = editor.document;
    const text = document.getText();
    const rows = text.split('\n').filter(line => line.trim());

    return {
      ok: true,
      value: {
        currentIndex: 0,
        totalRows: rows.length,
        isReviewing: true
      }
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error : new Error('Unknown error')
    };
  }
};

const validateFeatureDependencies = (
  features: FeatureFlags
): Result<void> => {
  const enabledFeatures = Object.entries(features)
    .filter(([_, feature]) => feature.enabled)
    .map(([name]) => name);

  const missingDependencies = Object.entries(features)
    .filter(([_, feature]) => feature.enabled)
    .flatMap(([_, feature]) => 
      feature.dependencies.filter((dep: string) => !enabledFeatures.includes(dep))
    );

  return missingDependencies.length === 0
    ? { ok: true, value: undefined }
    : { 
        ok: false, 
        error: new Error(`Missing dependencies: ${missingDependencies.join(', ')}`)
      };
};

const initializeFeatures = async (
  editor: TextEditor,
  config = getConfig()
): Promise<Result<void>> => {
  // Initialize review state
  const stateResult = createReviewState(editor);
  if (!stateResult.ok) {
    return stateResult;
  }

  // Validate feature dependencies
  const validationResult = validateFeatureDependencies(config.features);
  if (!validationResult.ok) {
    return validationResult;
  }

  try {
    // Initialize basic navigation if enabled
    if (config.features.basicNavigation) {
      await initializeNavigation(editor, stateResult.value);
    }

    // Initialize status tracking if enabled
    if (config.features.statusTracking) {
      await initializeStatusTracking(editor, stateResult.value);
    }

    return { ok: true, value: undefined };
  } catch (error) {
    return { 
      ok: false, 
      error: error instanceof Error ? error : new Error('Feature initialization failed')
    };
  }
};

const initializeNavigation = async (
  editor: TextEditor,
  state: ReviewState
): Promise<void> => {
  // Navigation initialization logic
  window.showInformationMessage('Navigation initialized');
};

const initializeStatusTracking = async (
  editor: TextEditor,
  state: ReviewState
): Promise<void> => {
  // Status tracking initialization logic
  window.showInformationMessage('Status tracking initialized');
};

export { initializeFeatures };
