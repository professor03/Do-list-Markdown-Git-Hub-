import { useApp } from '../../context/AppContext';
export default function MarkdownNote(){
  const { state, dispatch } = useApp();
  return (
    <div>
      <h2>Markdown 記事本</h2>
      <textarea
        value={state.notes.markdown}
        onChange={e=>dispatch({type:'SET_MARKDOWN', markdown: e.target.value})}
        rows={12}/>
      <h3>預覽</h3>
      <pre style={{whiteSpace:'pre-wrap'}}>{state.notes.markdown}</pre>
    </div>
  );
}
