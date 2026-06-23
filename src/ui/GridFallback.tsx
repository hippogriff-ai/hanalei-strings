import { motion } from "framer-motion";
import { CATALOG, money } from "../catalog";
import { useStore } from "../store";

const ICON: Record<string, string> = { lesson: "🎶", vinyl: "💿", yarn: "🧶", ukulele: "🎸" };

export function GridFallback() {
  const addToCart = useStore((s) => s.addToCart);
  const stockOf = useStore((s) => s.stockOf);

  return (
    <motion.div
      className="gridwrap"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="grid-head">
        <div className="k">The same shelf, made flat</div>
        <h2>One catalog, every surface</h2>
        <p>
          This plain grid is the accessibility &amp; low-bandwidth fallback for the 3D tour — and it's
          the very same structured surface an AI agent reads. One Shopify source of truth: identical
          prices, stock, and checkout whether you're wandering the shop or asking an assistant.
        </p>
      </div>

      <div className="grid">
        {CATALOG.map((p) => {
          const stock = stockOf(p.id);
          const out = stock <= 0;
          return (
            <div className="gcard" key={p.id}>
              <div className="art" style={{ background: p.tint }}>
                {ICON[p.kind]}
              </div>
              <div className="body">
                <div className="t">{p.title}</div>
                <div className="b">{p.blurb}</div>
                <div className="foot">
                  <span className="pr">{money(p.price)}</span>
                  <span className={`stock ${out ? "out" : stock <= 5 ? "low" : "in"}`}>
                    <span className="pip" /> {out ? "Reserved" : stock <= 5 ? `${stock} left` : "In stock"}
                  </span>
                </div>
                <button
                  className="btn btn-koa btn-sm"
                  style={{ width: "100%", marginTop: 4 }}
                  disabled={out}
                  onClick={() => addToCart(p.id)}
                >
                  {p.kind === "lesson" ? "Book" : "Add to cart"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
