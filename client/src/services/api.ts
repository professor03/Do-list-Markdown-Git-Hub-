const BASE = import.meta.env.VITE_API_BASE_URL as string;

export async function getTodos(){ return fetch(`${BASE}/todos`).then(r=>r.json()); }
export async function addTodo(title: string){
  return fetch(`${BASE}/todos`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ title }) }).then(r=>r.json());
}
export async function toggleTodoBackend(id: string, done: boolean){
  return fetch(`${BASE}/todos/${id}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ done }) }).then(r=>r.json());
}
export async function removeTodoBackend(id: string){
  return fetch(`${BASE}/todos/${id}`, { method:'DELETE' }).then(()=>({ ok:true }));
}
export async function getSettings(){ return fetch(`${BASE}/settings`).then(r=>r.json()); }
export async function saveSettings(p:{focusLength:number;breakLength:number}){
  return fetch(`${BASE}/settings`, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(p) }).then(r=>r.json());
}
export async function saveSession(p:{todoId?:string;phase:'focus'|'break';durationSec:number;startedAt:string;endedAt:string}){
  return fetch(`${BASE}/sessions`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(p) }).then(r=>r.json());
}
