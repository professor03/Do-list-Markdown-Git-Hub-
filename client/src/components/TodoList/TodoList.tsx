import { useEffect, useState } from "react";
import { useApp } from "../../context/AppContext";
import { getTodos, toggleTodoBackend, removeTodoBackend } from "../../services/api";
import type { Todo } from "../../context/types";

type ServerTodo = { _id: string; title: string; done: boolean; createdAt: string };
type QuickTask = { id: string; title: string; done: boolean };

const toClientTodo = (todo: ServerTodo): Todo => ({
  id: todo._id,
  title: todo.title,
  done: todo.done,
  createdAt: new Date(todo.createdAt).getTime()
});

const makeTempId = () =>
  (typeof crypto !== "undefined" && "randomUUID" in crypto)
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

const LABELS = {
  title: "\u5F85\u8FA6\u6E05\u55AE",
  subtitle: "\u5217\u51FA\u4ECA\u65E5\u60F3\u5B8C\u6210\u7684\u4EFB\u52D9",
  remove: "\u522A\u9664",
  quickTitle: "Do List",
  quickSubtitle: "\u5FEB\u901F\u7B46\u8A18\u4ECA\u65E5\u9748\u611F\uFF0C\u8F38\u5165\u5F8C\u6703\u81EA\u52D5\u65B0\u589E\u5217",
  quickPlaceholder: "\u8F38\u5165\u4EFB\u52D9\u5F8C\u6309 Enter \u65B0\u589E",
  quickClear: "\u6E05\u9664\u5168\u90E8"
} as const;

export default function TodoList() {
  const { state, dispatch } = useApp();
  const [quickTasks, setQuickTasks] = useState<QuickTask[]>([]);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const list: ServerTodo[] = await getTodos();
        dispatch({ type: "SET_ALL", payload: { todos: list.map(toClientTodo) } });
      } catch {
        // Keep existing state if fetch fails
      }
    })();
  }, [dispatch]);

  const handleAddQuickTask = () => {
    const value = draft.trim();
    if (!value) return;
    const id = makeTempId();
    setQuickTasks(tasks => [...tasks, { id, title: value, done: false }]);
    setDraft("");
  };

  const handleUpdateQuickTask = (id: string, partial: Partial<QuickTask>) => {
    setQuickTasks(tasks => tasks.map(task => (task.id === id ? { ...task, ...partial } : task)));
  };

  const handleRemoveQuickTask = (id: string) => {
    setQuickTasks(tasks => tasks.filter(task => task.id !== id));
  };

  const handleClearQuickTasks = () => setQuickTasks([]);

  return (
    <div className="todo-list">
      <header className="panel-header">
        <h2>{LABELS.title}</h2>
        <p className="panel-subtitle">{LABELS.subtitle}</p>
      </header>
      <ul className="todo-list__items">
        {state.todos.map((t) => (
          <li key={t.id} className="todo-list__item">
            <label className={t.done ? "todo-list__label done" : "todo-list__label"}>
              <input
                type="checkbox"
                checked={t.done}
                onChange={async () => {
                  const next = !t.done;
                  dispatch({ type: "TOGGLE_TODO", id: t.id });
                  try {
                    await toggleTodoBackend(t.id, next);
                  } catch {
                    dispatch({ type: "TOGGLE_TODO", id: t.id });
                  }
                }}
              />
              <span>{t.title}</span>
            </label>
            <button
              className="link-button"
              onClick={async () => {
                dispatch({ type: "REMOVE_TODO", id: t.id });
                try {
                  await removeTodoBackend(t.id);
                } catch {
                  // Ignore backend delete failures for now
                }
              }}
            >
              {LABELS.remove}
            </button>
          </li>
        ))}
      </ul>

      <section className="quick-do-list">
        <header className="quick-do-list__header">
          <h3>{LABELS.quickTitle}</h3>
          <p>{LABELS.quickSubtitle}</p>
        </header>
        <div className="quick-do-list__items">
          {quickTasks.map(task => (
            <div key={task.id} className="quick-do-list__row">
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => handleUpdateQuickTask(task.id, { done: !task.done })}
              />
              <input
                type="text"
                className={task.done ? "quick-do-list__input done" : "quick-do-list__input"}
                value={task.title}
                onChange={(e) => handleUpdateQuickTask(task.id, { title: e.target.value })}
                placeholder={LABELS.quickPlaceholder}
              />
              <button
                type="button"
                className="link-button"
                onClick={() => handleRemoveQuickTask(task.id)}
              >
                {LABELS.remove}
              </button>
            </div>
          ))}
          <div className="quick-do-list__row is-draft">
            <input type="checkbox" disabled />
            <input
              type="text"
              className="quick-do-list__input"
              value={draft}
              placeholder={LABELS.quickPlaceholder}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddQuickTask();
                }
              }}
              onBlur={handleAddQuickTask}
            />
            <button
              type="button"
              className="link-button"
              onClick={() => setDraft("")}
            >
              {LABELS.remove}
            </button>
          </div>
        </div>
        {quickTasks.length > 0 && (
          <div className="quick-do-list__actions">
            <button type="button" className="link-button" onClick={handleClearQuickTasks}>
              {LABELS.quickClear}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
