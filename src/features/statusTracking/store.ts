import type { ExtensionContext, Uri } from 'vscode';
import type { Result } from '../../types';
import type { StatusStore, RowStatusData, StatusMap } from './types';

const getStorageKey = (uri: Uri): string => 
  `dataset-review.status.${uri.toString()}`;

export const createStatusStore = (
  context: ExtensionContext,
  uri: Uri
): StatusStore => {
  const storageKey = getStorageKey(uri);

  const loadStatuses = (): StatusMap => 
    context.workspaceState.get(storageKey, {});

  const saveStatuses = (statuses: StatusMap): Thenable<void> =>
    context.workspaceState.update(storageKey, statuses);

  return {
    getStatus: (index: number): Result<RowStatusData> => {
      const statuses = loadStatuses();
      const status = statuses[index];
      
      return status 
        ? { ok: true, value: status }
        : { 
            ok: true, 
            value: { status: 'pending', timestamp: Date.now() }
          };
    },

    setStatus: (
      index: number,
      status: RowStatusData['status'],
      notes?: string
    ): Result<void> => {
      try {
        const statuses = loadStatuses();
        statuses[index] = {
          status,
          timestamp: Date.now(),
          notes
        };
        
        saveStatuses(statuses);
        return { ok: true, value: undefined };
      } catch (error) {
        return {
          ok: false,
          error: error instanceof Error ? error : new Error('Failed to save status')
        };
      }
    },

    getAllStatuses: (): Result<StatusMap> => {
      try {
        return { ok: true, value: loadStatuses() };
      } catch (error) {
        return {
          ok: false,
          error: error instanceof Error ? error : new Error('Failed to load statuses')
        };
      }
    },

    clear: (): Result<void> => {
      try {
        saveStatuses({});
        return { ok: true, value: undefined };
      } catch (error) {
        return {
          ok: false,
          error: error instanceof Error ? error : new Error('Failed to clear statuses')
        };
      }
    }
  };
};