import { useCallback, useMemo } from 'react';
import type { SolarDataPoint } from '@/types/solar';

const DASHBOARD_STORAGE_KEY = 'solar-dashboard-v1';

export interface PersistedDashboardState {
  data: SolarDataPoint[];
  fileName: string;
}

interface UseDashboardPersistenceReturn {
  persistedState: PersistedDashboardState | null;
  persistDashboard: (state: PersistedDashboardState) => void;
  clearPersistedDashboard: () => void;
}

export const useDashboardPersistence = (): UseDashboardPersistenceReturn => {
  const persistedState = useMemo<PersistedDashboardState | null>(() => {
    try {
      const raw = localStorage.getItem(DASHBOARD_STORAGE_KEY);
      if (!raw) return null;
      const parsed: PersistedDashboardState = JSON.parse(raw);
      return parsed?.data?.length ? parsed : null;
    } catch {
      localStorage.removeItem(DASHBOARD_STORAGE_KEY);
      return null;
    }
  }, []);

  const persistDashboard = useCallback((state: PersistedDashboardState): void => {
    try {
      localStorage.setItem(DASHBOARD_STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.error('[DashboardPersistence] Failed to write state:', err);
    }
  }, []);

  const clearPersistedDashboard = useCallback((): void => {
    localStorage.removeItem(DASHBOARD_STORAGE_KEY);
  }, []);

  return { persistedState, persistDashboard, clearPersistedDashboard };
};