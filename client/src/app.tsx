import { AppProvider } from './context/AppContext';
import TodoList from './components/TodoList/TodoList';
import Pomodoro from './components/Pomodoro/Pomodoro';
import MarkdownNote from './components/Notes/MarkdownNote';

export default function App() {
  return (
    <AppProvider>
      <div className="app">
        <section className="panel"><TodoList/></section>
        <section className="panel"><Pomodoro/></section>
        <section className="panel"><MarkdownNote/></section>
      </div>
    </AppProvider>
  );
}
