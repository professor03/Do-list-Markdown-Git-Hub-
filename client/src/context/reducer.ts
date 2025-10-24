import type { AppState, Action } from './types';

const generateId = () =>
  (typeof crypto !== 'undefined' && 'randomUUID' in crypto)
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

export const initialState: AppState = {
  todos: [],
  pomodoro: { phase: 'focus', remainingSec: 25*60, focusLength: 25*60, breakLength: 5*60, running: false },
  notes: { markdown: '# Hello' }
};

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_ALL':
      return { ...state, ...action.payload } as AppState;
    case 'ADD_TODO': {
      const id = action.id ?? generateId();
      return { ...state, todos: [{ id, title: action.title, done: false, createdAt: Date.now() }, ...state.todos] };
    }
    case 'SYNC_TODO':
      return {
        ...state,
        todos: state.todos.map(t => (t.id === action.id ? action.todo : t))
      };
    case 'TOGGLE_TODO':
      return { ...state, todos: state.todos.map(t => (t.id === action.id ? { ...t, done: !t.done } : t)) };
    case 'REMOVE_TODO':
      return { ...state, todos: state.todos.filter(t => t.id !== action.id) };
    case 'START_SESSION':
      return { ...state, pomodoro: { ...state.pomodoro, running: true } };
    case 'PAUSE_SESSION':
      return { ...state, pomodoro: { ...state.pomodoro, running: false } };
    case 'RESET_SESSION': {
      const len = state.pomodoro.phase === 'focus' ? state.pomodoro.focusLength : state.pomodoro.breakLength;
      return { ...state, pomodoro: { ...state.pomodoro, remainingSec: len, running: false } };
    }
    case 'TICK': {
      const r = Math.max(0, state.pomodoro.remainingSec - 1);
      return { ...state, pomodoro: { ...state.pomodoro, remainingSec: r } };
    }
    case 'SWITCH_PHASE': {
      const next = state.pomodoro.phase === 'focus' ? 'break' : 'focus';
      const len = next === 'focus' ? state.pomodoro.focusLength : state.pomodoro.breakLength;
      return { ...state, pomodoro: { ...state.pomodoro, phase: next, remainingSec: len, running: false } };
    }
    case 'SET_MARKDOWN':
      return { ...state, notes: { markdown: action.markdown } };
    default:
      return state;
  }
}
