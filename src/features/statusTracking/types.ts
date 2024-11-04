import type { Result } from '../../types';

export type RowStatus = 'pending' | 'reviewed' | 'flagged';

export interface RowStatusData {
  status: RowStatus;
  timestamp: number;
  notes?: string;
}

export interface StatusMap {
  [rowIndex: number]: RowStatusData;
}

export interface StatusStore {
  getStatus: (index: number) => Result<RowStatusData>;
  setStatus: (index: number, status: RowStatus, notes?: string) => Result<void>;
  getAllStatuses: () => Result<StatusMap>;
  clear: () => Result<void>;
}