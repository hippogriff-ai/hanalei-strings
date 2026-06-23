import { useStore } from "../store";

export function PhotorealOverlay() {
  const setPhotoreal = useStore((s) => s.setPhotoreal);
  return (
    <>
      <header className="topbar">
        <div className="brand">
          <span className="mark">
            Hanalei <em>Strings</em>
          </span>
          <span className="open-chip">
            <span className="dot" /> Photoreal preview
          </span>
        </div>
        <button className="icon-btn" onClick={() => setPhotoreal(false)}>
          ← Back to the concept demo
        </button>
      </header>

      <div className="pr-banner">
        <strong>Gaussian-splat preview — this is the photoreal rendering quality we're building toward.</strong>
        <span>
          Same tech as Marble / World Labs. This is a placeholder interior to show the fidelity — the real
          Hanalei shop (captured or Marble-generated) drops into this exact viewer.
        </span>
      </div>

      <div className="pr-hint">drag to look · scroll to zoom</div>
    </>
  );
}
