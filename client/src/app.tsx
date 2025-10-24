import { AppProvider } from './context/AppContext';
import TodoList from './components/TodoList/TodoList';
import Pomodoro from './components/Pomodoro/Pomodoro';
import MarkdownNote from './components/Notes/MarkdownNote';
import Soundscape from './components/Soundscape/Soundscape';

export default function App() {
  return (
    <AppProvider>
      <div className="app-layout">
        <Soundscape />
        <div className="app">
          <section className="panel"><TodoList/></section>
          <section className="panel"><Pomodoro/></section>
          <section className="panel"><MarkdownNote/></section>
        </div>
      </div>
    </AppProvider>
  );
}
