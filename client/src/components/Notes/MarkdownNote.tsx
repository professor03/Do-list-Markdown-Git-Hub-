import { useMemo } from "react";
import { useApp } from "../../context/AppContext";

const LABELS = {
  title: "Markdown 記事本",
  subtitle: "快速記錄靈感與想法",
  preview: "預覽",
  empty: "開始撰寫筆記吧！",
  exportTxt: "下載 .txt",
  exportDoc: "下載 Word"
} as const;

const createDownload = (data: BlobPart, type: string, filename: string) => {
  const blob = new Blob([data], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
};

export default function MarkdownNote(){
  const { state, dispatch } = useApp();
  const plainText = state.notes.markdown;
  const wordDocument = useMemo(() => {
    const html = `<html><head><meta charset="utf-8" /></head><body>${plainText
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\n/g, "<br />")}</body></html>`;
    return html;
  }, [plainText]);

  return (
    <div className="notes-panel">
      <header className="panel-header notes-header">
        <div>
          <h2>{LABELS.title}</h2>
          <p className="panel-subtitle">{LABELS.subtitle}</p>
        </div>
        <div className="notes-actions">
          <button
            type="button"
            onClick={() => createDownload(plainText || "", "text/plain;charset=utf-8", "note.txt")}
          >
            {LABELS.exportTxt}
          </button>
          <button
            type="button"
            onClick={() => createDownload(wordDocument, "application/msword", "note.doc")}
          >
            {LABELS.exportDoc}
          </button>
        </div>
      </header>
      <textarea
        className="textarea"
        value={state.notes.markdown}
        onChange={e=>dispatch({type:'SET_MARKDOWN', markdown: e.target.value})}
        rows={12}
      />
      <div className="notes-preview">
        <h3>{LABELS.preview}</h3>
        <div className="notes-preview__content">{state.notes.markdown || LABELS.empty}</div>
      </div>
    </div>
  );
}
