import { useState } from "react";

type Row = { keys: string[]; sep?: string; keys2?: string[]; label: string };

const ROWS: Row[] = [
  { keys: ["drag"], label: "Look around" },
  { keys: ["W", "A", "S", "D"], label: "Walk around" },
  { keys: ["↑", "↓", "←", "→"], label: "…or arrow keys" },
  { keys: ["E", "Space"], label: "Move up" },
  { keys: ["Q", "Shift"], label: "Move down" },
  { keys: ["scroll"], label: "Move forward / back" },
  { keys: ["click a dot"], label: "Buy an item" },
];

export function Controls() {
  const [open, setOpen] = useState(true);

  if (!open)
    return (
      <button className="controls-reopen" onClick={() => setOpen(true)}>
        ⌨ Controls
      </button>
    );

  return (
    <div className="controls-card">
      <div className="controls-head">
        <span>How to move</span>
        <button className="controls-x" onClick={() => setOpen(false)} aria-label="Hide controls">
          ✕
        </button>
      </div>
      <div className="controls-rows">
        {ROWS.map((r, i) => (
          <div className="controls-row" key={i}>
            <span className="controls-keys">
              {r.keys.map((k, j) => (
                <kbd key={j}>{k}</kbd>
              ))}
            </span>
            <span className="controls-label">{r.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
