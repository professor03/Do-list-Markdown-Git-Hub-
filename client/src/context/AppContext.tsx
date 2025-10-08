import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { reducer, initialState } from './reducer';
import type { AppState, Action } from './types';

const Ctx = createContext<{ state: AppState; dispatch: React.Dispatch<Action> } | null>(null);
export const useApp = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('AppContext not found');
  return ctx;
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState, () => {
    if (typeof window === 'undefined') return initialState;
    const saved = window.localStorage.getItem('app');
    if (!saved) return initialState;
    try {
      const parsed = JSON.parse(saved) as Partial<AppState>;
      return {
        ...initialState,
        ...parsed,
        todos: parsed?.todos ?? initialState.todos,
        pomodoro: {
          ...initialState.pomodoro,
          ...(parsed?.pomodoro ?? {})
        },
        notes: {
          ...initialState.notes,
          ...(parsed?.notes ?? {})
        }
      };
    } catch {
      return initialState;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('app', JSON.stringify(state));
  }, [state]);

  return <Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>;
}
