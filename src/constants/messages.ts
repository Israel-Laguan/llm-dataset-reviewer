export const MESSAGES = {
  errors: {
    NO_EDITOR: 'No active editor found',
    INVALID_FILE: 'Invalid file format',
    FEATURE_DISABLED: 'This feature is currently disabled',
    INITIALIZATION_FAILED: 'Failed to initialize review session'
  },
  info: {
    REVIEW_STARTED: 'Dataset review session started',
    REVIEW_COMPLETED: 'Review session completed',
    ROW_UPDATED: 'Row status updated'
  },
  warnings: {
    LARGE_FILE: 'Large file detected. Some features may be slower',
    MISSING_DEPENDENCIES: 'Some features are disabled due to missing dependencies'
  }
} as const;