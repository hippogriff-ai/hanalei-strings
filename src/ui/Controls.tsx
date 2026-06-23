import { useState } from "react";
import { IS_TOUCH } from "./TouchControls";

type Row = { keys: string[]; label: string };

const KEYBOARD_ROWS: Row[] = [
  { keys: ["drag"], label: "Look around" },
  { keys: ["W", "A", "S", "D"], label: "Walk around" },
  { keys: ["↑", "↓", "←", "→"], label: "…or arrow keys" },
  { keys: ["E", "Space"], label: "Move up" },
  { keys: ["Q", "Shift"], label: "Move down" },
  { keys: ["scroll"], label: "Move forward / back" },
  { keys: ["click a dot"], label: "Buy an item" },
];

const TOUCH_ROWS: Row[] = [
  { keys: ["1 finger drag"], label: "Look around" },
  { keys: ["◉ joystick"], label: "Walk (bottom-left)" },
  { keys: ["↑", "↓"], label: "Up / down (bottom-right)" },
  { keys: ["tap a dot"], label: "Buy an item" },
];

export function Controls() {
  const [open, setOpen] = useState(true);
  const rows = IS_TOUCH ? TOUCH_ROWS : KEYBOARD_ROWS;

  if (!open)
    return (
      <button className={"controls-reopen" + (IS_TOUCH ? " touch" : "")} onClick={() => setOpen(true)}>
        {IS_TOUCH ? "How to move" : "⌨ Controls"}
      </button>
    );

  return (
    <div className={"controls-card" + (IS_TOUCH ? " touch" : "")}>
      <div className="controls-head">
        <span>How to move</span>
        <button className="controls-x" onClick={() => setOpen(false)} aria-label="Hide controls">
          ✕
        </button>
      </div>
      <div className="controls-rows">
        {rows.map((r, i) => (
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
