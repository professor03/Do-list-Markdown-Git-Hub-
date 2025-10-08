import { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getTodos, addTodo, toggleTodoBackend, removeTodoBackend } from '../../services/api';

type ServerTodo = { _id: string; title: string; done: boolean; createdAt: string };

export default function TodoList(){
  const { state, dispatch } = useApp();
  const [title,setTitle] = useState('');

  useEffect(()=>{ (async ()=>{
    const list: ServerTodo[] = await getTodos();
    // 將後端資料投影到前端模型（簡化）
    const payload = list.map(t => ({ id: t._id, title: t.title, done: t.done, createdAt: new Date(t.createdAt).getTime() }));
    dispatch({ type: 'SET_ALL', payload: { todos: payload } });
  })(); }, [dispatch]);

  return (
    <div>
      <h2>待辦清單</h2>
      <form onSubmit={async (e)=>{ e.preventDefault(); if(!title.trim()) return;
        // 樂觀更新
        dispatch({ type: 'ADD_TODO', title });
        await addTodo(title);
        // 可在此回寫 mapping；本範例 state 不需後端 id
        setTitle('');
      }}>
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="新增待辦..." />
        <button type="submit">加入</button>
      </form>
      <ul>
        {state.todos.map(t=>(
          <li key={t.id}>
            <label>
              <input type="checkbox" checked={t.done} onChange={async ()=>{
                dispatch({ type: 'TOGGLE_TODO', id: t.id });
                // 嘗試後端同步（忽略錯誤處理以精簡）
                try { await toggleTodoBackend(t.id as any, !t.done); } catch {}
              }}/>
              {t.title}
            </label>
            <button onClick={async ()=>{
              dispatch({ type: 'REMOVE_TODO', id: t.id });
              try { await removeTodoBackend(t.id as any); } catch {}
            }}>刪除</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
