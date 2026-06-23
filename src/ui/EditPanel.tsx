import { CATALOG, byId } from "../catalog";
import { useStore } from "../store";

export function EditPanel() {
  const selectedEdit = useStore((s) => s.selectedEdit);
  const selectEdit = useStore((s) => s.selectEdit);
  const requestPlace = useStore((s) => s.requestPlace);
  const setEditing = useStore((s) => s.setEditing);
  const hotspotPos = useStore((s) => s.hotspotPos);
  const resetHotspots = useStore((s) => s.resetHotspots);
  const toggleFlip = useStore((s) => s.toggleFlip);
  const rotateYaw = useStore((s) => s.rotateYaw);

  const sel = selectedEdit ? byId(selectedEdit) : null;

  const copyJson = () => {
    const out = CATALOG.map((p) => ({ id: p.id, hotspot: hotspotPos[p.id] ?? p.hotspot }));
    navigator.clipboard?.writeText(JSON.stringify(out, null, 2)).catch(() => {});
  };

  return (
    <div className="edit-panel">
      <div className="edit-head">
        <strong>Place hotspots</strong>
        <button className="x" onClick={() => setEditing(false)}>
          ✕
        </button>
      </div>
      <p className="edit-hint">
        <b>1.</b> pick a product · <b>2.</b> drag to orbit so it sits on the <b className="cross">＋</b> ·{" "}
        <b>3.</b> Place
      </p>

      <div className="edit-list">
        {CATALOG.map((p) => (
          <button
            key={p.id}
            className={`edit-item ${selectedEdit === p.id ? "on" : ""}`}
            onClick={() => selectEdit(p.id)}
          >
            <span className="dot" style={{ background: p.tint }} />
            <span className="t">{p.title.split(" — ")[0]}</span>
            <span className="s">{hotspotPos[p.id] ? "✓ placed" : "—"}</span>
          </button>
        ))}
      </div>

      <button className="btn btn-koa" disabled={!sel} onClick={requestPlace}>
        ＋ Place {sel ? `“${sel.title.split(" — ")[0]}”` : "— pick one —"} here
      </button>

      <div className="edit-orient">
        <span>Scene tilted / upside-down?</span>
        <div>
          <button className="btn-ghost btn-sm" onClick={toggleFlip}>
            Flip ↕
          </button>
          <button className="btn-ghost btn-sm" onClick={rotateYaw}>
            Rotate ⟳
          </button>
        </div>
      </div>

      <div className="edit-foot">
        <button className="link" onClick={resetHotspots}>
          Reset all
        </button>
        <button className="link" onClick={copyJson}>
          Copy positions
        </button>
        <button className="link strong" onClick={() => setEditing(false)}>
          Done
        </button>
      </div>
    </div>
  );
}
