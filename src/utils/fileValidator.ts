import { Uri, workspace } from 'vscode';
import type { ValidationResult } from '../types';
import { getConfig } from './config';

export const validateFile = async (uri: Uri): Promise<ValidationResult> => {
  const stat = await workspace.fs.stat(uri);
  const config = getConfig();

  if (stat.size > config.maxFileSize) {
    return {
      valid: false,
      message: `File too large (${formatSize(stat.size)}). 
                Please use specialized tools for large datasets.`,
    };
  }

  if (stat.size > config.maxFileSize / 2) {
    return {
      valid: true,
      warning: `Large file detected. Some features may be slower.`,
    };
  }

  return { valid: true };
};

const formatSize = (bytes: number): string => {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
};
