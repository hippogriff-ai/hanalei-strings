import { useRef, useState } from "react";
import { useStore } from "../store";

export const IS_TOUCH =
  typeof window !== "undefined" &&
  ((window.matchMedia && window.matchMedia("(pointer: coarse)").matches) || "ontouchstart" in window);

/** On-screen movement for phones/tablets: a walk joystick + up/down buttons.
 *  Looking around is one-finger drag anywhere else on the scene (handled by FlyNav). */
export function TouchControls() {
  if (!IS_TOUCH) return null;
  return (
    <>
      <Joystick />
      <VertButtons />
    </>
  );
}

function Joystick() {
  const setTouchNav = useStore((s) => s.setTouchNav);
  const padRef = useRef<HTMLDivElement>(null);
  const active = useRef(false);
  const [knob, setKnob] = useState({ x: 0, y: 0 });

  const handle = (e: React.TouchEvent) => {
    const t = e.touches[0];
    const r = padRef.current?.getBoundingClientRect();
    if (!t || !r) return;
    const max = r.width / 2;
    let dx = t.clientX - (r.left + max);
    let dy = t.clientY - (r.top + max);
    const d = Math.hypot(dx, dy);
    if (d > max) {
      dx = (dx / d) * max;
      dy = (dy / d) * max;
    }
    setKnob({ x: dx, y: dy });
    setTouchNav({ x: dx / max, y: dy / max });
  };
  const end = () => {
    active.current = false;
    setKnob({ x: 0, y: 0 });
    setTouchNav({ x: 0, y: 0 });
  };

  return (
    <div
      className="joystick"
      ref={padRef}
      onTouchStart={(e) => {
        active.current = true;
        handle(e);
      }}
      onTouchMove={(e) => active.current && handle(e)}
      onTouchEnd={end}
      onTouchCancel={end}
    >
      <span className="joy-knob" style={{ transform: `translate(${knob.x}px, ${knob.y}px)` }} />
      <span className="joy-label">walk</span>
    </div>
  );
}

function VertButtons() {
  const setTouchNav = useStore((s) => s.setTouchNav);
  return (
    <div className="vbtns">
      <button onTouchStart={() => setTouchNav({ vert: 1 })} onTouchEnd={() => setTouchNav({ vert: 0 })} aria-label="Up">
        ↑
      </button>
      <button onTouchStart={() => setTouchNav({ vert: -1 })} onTouchEnd={() => setTouchNav({ vert: 0 })} aria-label="Down">
        ↓
      </button>
    </div>
  );
}
