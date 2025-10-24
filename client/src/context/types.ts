export type Todo = { id: string; title: string; done: boolean; createdAt: number };
export type Phase = 'focus' | 'break';

export interface PomodoroState {
  phase: Phase;
  remainingSec: number;
  focusLength: number;
  breakLength: number;
  running: boolean;
}
export interface NotesState { markdown: string }
export interface AppState {
  todos: Todo[];
  pomodoro: PomodoroState;
  notes: NotesState;
}

export type Action =
  | { type: 'SET_ALL'; payload: Partial<AppState> }
  | { type: 'ADD_TODO'; title: string; id?: string }
  | { type: 'SYNC_TODO'; id: string; todo: Todo }
  | { type: 'TOGGLE_TODO'; id: string }
  | { type: 'REMOVE_TODO'; id: string }
  | { type: 'START_SESSION' }
  | { type: 'PAUSE_SESSION' }
  | { type: 'RESET_SESSION' }
  | { type: 'TICK' }
  | { type: 'SWITCH_PHASE' }
  | { type: 'SET_MARKDOWN'; markdown: string };
