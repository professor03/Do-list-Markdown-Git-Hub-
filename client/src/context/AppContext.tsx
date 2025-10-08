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
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => { localStorage.setItem('app', JSON.stringify(state)); }, [state]);
  useEffect(() => {
    const saved = localStorage.getItem('app');
    if (saved) dispatch({ type: 'SET_ALL', payload: JSON.parse(saved) });
  }, []);

  return <Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>;
}
