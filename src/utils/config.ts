import { workspace } from 'vscode';
import type { FeatureFlag } from '../types';

export interface FeatureFlags {
  basicNavigation: FeatureFlag;
  statusTracking: FeatureFlag;
}

export interface Config {
  maxFileSize: number;
  features: FeatureFlags;
}

export const getConfig = (): Config => {
  const config = workspace.getConfiguration('llmDatasetReviewer');
  
  return {
    maxFileSize: config.get('maxFileSize') ?? 10485760,
    features: config.get('features') ?? {
      basicNavigation: {
        enabled: true,
        name: 'basicNavigation',
        description: 'Enables basic navigation features',
        dependencies: [],
      },
      statusTracking: {
        enabled: true,
        name: 'statusTracking',
        description: 'Enables status tracking features',
        dependencies: [],
      },
    },
  };
};
