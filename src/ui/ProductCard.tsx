import { Canvas } from "@react-three/fiber";
import { motion } from "framer-motion";
import { Ukulele } from "../three/Ukulele";
import { byId, money } from "../catalog";
import { useStore } from "../store";

const ICON: Record<string, string> = { lesson: "🎶", vinyl: "💿", yarn: "🧶", ukulele: "🎸" };

function stockPill(id: string, stock: number, kind: string) {
  if (stock <= 0) return { cls: "out", txt: "Reserved — join waitlist" };
  if (kind === "lesson") return { cls: "low", txt: `${stock} seats left · Sat 10am` };
  if (id === "p_koa_tenor") return { cls: "low", txt: "In stock: 1 of 1 · next build ~4 mo" };
  if (stock <= 5) return { cls: "low", txt: `Only ${stock} left` };
  return { cls: "in", txt: "In stock" };
}

export function ProductCard() {
  const activeId = useStore((s) => s.activeId);
  const openProduct = useStore((s) => s.openProduct);
  const addToCart = useStore((s) => s.addToCart);
  const stockOf = useStore((s) => s.stockOf);
  const p = activeId ? byId(activeId) : null;
  if (!p) return null;

  const stock = stockOf(p.id);
  const pill = stockPill(p.id, stock, p.kind);
  const paired = p.pairsWith ? byId(p.pairsWith) : null;

  return (
    <motion.aside
      className="panel"
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", stiffness: 320, damping: 36 }}
    >
      <div className="panel-head">
        <h3>Inspect</h3>
        <button className="x" onClick={() => openProduct(null)}>
          ✕
        </button>
      </div>
      <div className="panel-body">
        <div className="inspect">
          {p.kind === "ukulele" ? (
            <Canvas camera={{ position: [0, 0.3, 3.1], fov: 38 }} dpr={[1, 1.8]}>
              <ambientLight intensity={0.7} color="#fbe9cf" />
              <directionalLight position={[3, 4, 5]} intensity={1.6} color="#ffe2b0" />
              <pointLight position={[-3, 1, 2]} intensity={2} color="#cfe0d2" />
              <Ukulele tint={p.tint} spin scale={1.05} />
            </Canvas>
          ) : (
            <div style={{ display: "grid", placeItems: "center", height: "100%", background: p.tint }}>
              <span style={{ fontSize: 64 }}>{ICON[p.kind]}</span>
            </div>
          )}
          <span className="spin-hint">{p.kind === "ukulele" ? "auto-rotating · spin to inspect" : "stand-in"}</span>
        </div>

        {p.kind === "ukulele" && (
          <span className="proof">
            ◆ Per-item 3D/AR view — the lever proven to lift conversion ≈94% (Shopify)
          </span>
        )}

        <h2 className="card-title">{p.title}</h2>
        <div className="price-row">
          <span className="price">{money(p.price)}</span>
          <span className={`stock ${pill.cls}`}>
            <span className="pip" /> {pill.txt}
          </span>
        </div>
        <div className="sync-strip">
          <span className="sync-dot" /> Live inventory from Shopify · {p.sku}
        </div>
        <p className="craft">{p.craft}</p>

        {p.handoff && (
          <p style={{ fontSize: 13, color: "var(--rose)", marginTop: 8 }}>
            A four-month, made-to-order instrument. Buy here, or have Kirk walk you through it.
          </p>
        )}

        {paired && (
          <div className="nudge">
            <div className="lbl">Most students leave with this →</div>
            <div className="row">
              <div>
                <div style={{ fontWeight: 650, color: "var(--koa-deep)" }}>{paired.title}</div>
                <div style={{ fontSize: 12.5, color: "rgba(21,16,11,0.55)" }}>{money(paired.price)}</div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => addToCart(paired.id)}>
                Add
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="panel-foot">
        <button
          className="btn btn-koa"
          disabled={stock <= 0}
          onClick={() => addToCart(p.id)}
          data-tour="add-cart"
        >
          {p.kind === "lesson" ? "Book the lesson" : "Add to cart"} · {money(p.price)}
        </button>
      </div>
    </motion.aside>
  );
}
