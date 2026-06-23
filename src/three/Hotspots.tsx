import { Html } from "@react-three/drei";
import { CATALOG } from "../catalog";
import { useStore } from "../store";

export function Hotspots() {
  const editing = useStore((s) => s.editing);
  const openProduct = useStore((s) => s.openProduct);
  const selectEdit = useStore((s) => s.selectEdit);
  const selectedEdit = useStore((s) => s.selectedEdit);
  const activeId = useStore((s) => s.activeId);
  const hotspotPos = useStore((s) => s.hotspotPos);
  const view = useStore((s) => s.view);

  if (view === "grid") return null;

  return (
    <>
      {CATALOG.map((p) => {
        const pos = hotspotPos[p.id] ?? p.hotspot;
        const sel = editing && selectedEdit === p.id;
        return (
          <Html key={p.id} position={pos} center zIndexRange={[20, 0]}>
            <button
              className={`hotspot ${sel ? "sel" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                editing ? selectEdit(p.id) : openProduct(p.id);
              }}
              aria-label={p.pin}
            >
              <span className={`ring ${activeId === p.id || sel ? "" : "halo"}`} />
              <span className="tag">{p.pin}</span>
            </button>
          </Html>
        );
      })}
    </>
  );
}
