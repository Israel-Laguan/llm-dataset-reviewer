import type { Config } from "./utils/config";

export interface ValidationResult {
  valid: boolean;
  message?: string;
  warning?: string;
}

export interface Position {
  line: number;
  character: number;
}

export interface ReviewState {
  currentIndex: number;
  totalRows: number;
  isReviewing: boolean;
  rows?: unknown[];
}

export interface NavigationResult {
  success: boolean;
  error?: string;
  newPosition?: Position;
}

export type FeatureInitializer = (
  state: ReviewState,
  config: Config
) => Promise<void>;

export interface DatasetRow {
  content: unknown;
  index: number;
  position: Position;
}

export type ReviewStatus = 'pending' | 'reviewed' | 'flagged';

export interface RowMetadata {
  status: ReviewStatus;
  lastModified: number;
  notes?: string;
}

// For pure function composition
export type Result<T, E = Error> = 
  | { ok: true; value: T }
  | { ok: false; error: E };

// Utility type for feature management
export type FeatureFlag = {
  enabled: boolean;
  name: string;
  description: string;
  dependencies: string[];
};