import { motion } from "framer-motion";
import { byId, money } from "../catalog";
import { useStore } from "../store";

const ICON: Record<string, string> = { lesson: "🎶", vinyl: "💿", yarn: "🧶", ukulele: "🎸" };

export function CartDrawer() {
  const cart = useStore((s) => s.humanCart);
  const toggleCart = useStore((s) => s.toggleCart);
  const removeFromCart = useStore((s) => s.removeFromCart);
  const beginCheckout = useStore((s) => s.beginCheckout);

  const lines = cart.map((l) => ({ ...l, p: byId(l.id)! })).filter((l) => l.p);
  const total = lines.reduce((s, l) => s + l.p.price * l.qty, 0);

  return (
    <motion.aside
      className="panel"
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", stiffness: 320, damping: 36 }}
    >
      <div className="panel-head">
        <h3>Your cart</h3>
        <button className="x" onClick={() => toggleCart(false)}>
          ✕
        </button>
      </div>

      <div className="panel-body">
        <div className="sync-strip">
          <span className="sync-dot" /> Inventory & pricing live from Shopify
        </div>
        {lines.length === 0 ? (
          <div className="empty">Nothing here yet — tap a hotspot in the shop.</div>
        ) : (
          lines.map((l) => (
            <div className="line" key={l.id}>
              <div className="thumb" style={{ background: l.p.tint }}>
                {ICON[l.p.kind]}
              </div>
              <div className="meta">
                <div className="t">{l.p.title}</div>
                <div className="s">Qty {l.qty}</div>
                <button className="rm" onClick={() => removeFromCart(l.id)}>
                  Remove
                </button>
              </div>
              <div className="p">{money(l.p.price * l.qty)}</div>
            </div>
          ))
        )}
      </div>

      <div className="panel-foot">
        <div className="total-row">
          <span className="l">Subtotal</span>
          <span className="v">{money(total)}</span>
        </div>
        <button
          className="btn btn-koa"
          disabled={lines.length === 0}
          onClick={beginCheckout}
          data-tour="cart-checkout"
        >
          Checkout · Shopify →
        </button>
        <p className="shopify-foot">
          <span className="shopify-lock">🔒</span> Secure checkout on{" "}
          <b>hanalei-strings.myshopify.com</b>
        </p>
      </div>
    </motion.aside>
  );
}
