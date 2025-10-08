import { useEffect, useRef, useState } from "react";
import { useApp } from "../../context/AppContext";
import { saveSession, getSessionStats } from "../../services/api";

type SessionStat = { _id: { d: string; phase: "focus" | "break" }; count?: number };

const LABELS = {
  title: "\u756A\u8304\u9418",
  focus: "\u5C08\u6CE8",
  break: "\u4F11\u606F",
  start: "\u958B\u59CB",
  pause: "\u66AB\u505C",
  reset: "\u91CD\u7F6E",
  summary: "\u4ECA\u65E5\u5DF2\u5B8C\u6210\u756A\u8304\u6578",
  statePrefix: "\u76EE\u524D\u72C0\u614B\uFF1A"
} as const;

export default function Pomodoro() {
  const { state, dispatch } = useApp();
  const startedRef = useRef<Date | null>(null);
  const [todayCount, setTodayCount] = useState(0);

  useEffect(() => {
    if (!state.pomodoro.running) return;
    if (!startedRef.current) startedRef.current = new Date();
    const id = setInterval(() => dispatch({ type: "TICK" }), 1000);
    return () => clearInterval(id);
  }, [state.pomodoro.running, dispatch]);

  useEffect(() => {
    const phaseLength = state.pomodoro.phase === "focus"
      ? state.pomodoro.focusLength
      : state.pomodoro.breakLength;
    if (!state.pomodoro.running && state.pomodoro.remainingSec === phaseLength) {
      startedRef.current = null;
    }
  }, [
    state.pomodoro.running,
    state.pomodoro.remainingSec,
    state.pomodoro.focusLength,
    state.pomodoro.breakLength,
    state.pomodoro.phase
  ]);

  useEffect(() => {
    (async () => {
      try {
        const stats: SessionStat[] = await getSessionStats();
        const todayKey = new Date().toISOString().slice(0, 10);
        const todayFocus = stats.find(stat => stat._id?.d === todayKey && stat._id?.phase === "focus");
        setTodayCount(todayFocus?.count ?? 0);
      } catch {
        setTodayCount(0);
      }
    })();
  }, []);

  useEffect(() => {
    if (state.pomodoro.remainingSec === 0) {
      const ended = new Date();
      const started = startedRef.current ?? new Date(ended.getTime() - 1000);
      const currentPhase = state.pomodoro.phase;
      (async () => {
        try {
          await saveSession({
            phase: currentPhase,
            durationSec: ((ended.getTime() - started.getTime()) / 1000) | 0,
            startedAt: started.toISOString(),
            endedAt: ended.toISOString()
          });
          if (currentPhase === "focus") setTodayCount(count => count + 1);
        } catch {
          // ignore sync error
        }
      })();
      startedRef.current = null;
      dispatch({ type: "SWITCH_PHASE" });
    }
  }, [state.pomodoro.remainingSec, state.pomodoro.phase, dispatch]);

  const m = Math.floor(state.pomodoro.remainingSec / 60).toString().padStart(2, "0");
  const s = (state.pomodoro.remainingSec % 60).toString().padStart(2, "0");
  const currentLabel = state.pomodoro.phase === "focus" ? LABELS.focus : LABELS.break;

  return (
    <div className="pomodoro">
      <header className="panel-header">
        <h2>{LABELS.title}</h2>
        <p className="panel-subtitle">{LABELS.statePrefix}{currentLabel}</p>
      </header>
      <div className="pomodoro__timer">
        <div className="pomodoro__time">{m}:{s}</div>
        <div className="pomodoro__actions">
          <button onClick={() => dispatch({ type: "START_SESSION" })}>{LABELS.start}</button>
          <button onClick={() => dispatch({ type: "PAUSE_SESSION" })}>{LABELS.pause}</button>
          <button onClick={() => {
            startedRef.current = null;
            dispatch({ type: "RESET_SESSION" });
          }}>{LABELS.reset}</button>
        </div>
      </div>
      <div className="pomodoro__summary">
        <span className="summary-label">{LABELS.summary}</span>
        <span className="summary-value">{todayCount}</span>
      </div>
    </div>
  );
}
