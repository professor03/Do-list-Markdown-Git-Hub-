import { useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { saveSession } from '../../services/api';

export default function Pomodoro(){
  const { state, dispatch } = useApp();
  const startedRef = useRef<Date | null>(null);

  useEffect(()=>{
    if (!state.pomodoro.running) return;
    if (!startedRef.current) startedRef.current = new Date();
    const id = setInterval(()=> dispatch({ type:'TICK' }), 1000);
    return ()=> clearInterval(id);
  }, [state.pomodoro.running, dispatch]);

  useEffect(()=>{
    if (state.pomodoro.remainingSec === 0) {
      const ended = new Date();
      const started = startedRef.current ?? new Date(ended.getTime() - 1000);
      // 儲存 session
      saveSession({
        phase: state.pomodoro.phase,
        durationSec: (ended.getTime() - started.getTime())/1000 | 0,
        startedAt: started.toISOString(),
        endedAt: ended.toISOString()
      }).catch(()=>{});
      startedRef.current = null;
      dispatch({ type:'SWITCH_PHASE' });
    }
  }, [state.pomodoro.remainingSec, state.pomodoro.phase, dispatch]);

  const m = Math.floor(state.pomodoro.remainingSec/60).toString().padStart(2,'0');
  const s = (state.pomodoro.remainingSec%60).toString().padStart(2,'0');

  return (
    <div>
      <h2>番茄鐘 ({state.pomodoro.phase})</h2>
      <div style={{fontSize:48,fontVariantNumeric:'tabular-nums'}}>{m}:{s}</div>
      <div>
        <button onClick={()=>dispatch({type:'START_SESSION'})}>開始</button>
        <button onClick={()=>dispatch({type:'PAUSE_SESSION'})}>暫停</button>
        <button onClick={()=>dispatch({type:'RESET_SESSION'})}>重置</button>
      </div>
    </div>
  );
}
