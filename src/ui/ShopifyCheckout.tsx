import { motion } from "framer-motion";
import { money } from "../catalog";
import { SHOP_DOMAIN } from "../mockShopify";
import { useStore } from "../store";

const ICON: Record<string, string> = { lesson: "🎶", vinyl: "💿", yarn: "🧶", ukulele: "🎸" };

export function ShopifyCheckout() {
  const stage = useStore((s) => s.checkoutStage);
  const checkout = useStore((s) => s.checkout);
  const order = useStore((s) => s.order);
  const payNow = useStore((s) => s.payNow);
  const finish = useStore((s) => s.finishCheckout);

  if (stage === "idle") return null;

  return (
    <motion.div className="sco" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* hosted-checkout chrome */}
      <div className="sco-bar">
        <div className="sco-url">
          <span className="lock">🔒</span> {SHOP_DOMAIN}
          <span className="path">/checkouts/c/{(checkout?.checkoutId ?? "").slice(-8) || "•••"}</span>
        </div>
        <span className="sco-demo">DEMO · Shopify simulated</span>
      </div>

      {(stage === "creating" || (!checkout && stage !== "confirmed")) && (
        <div className="sco-loading">
          <div className="spinner" />
          <p>Creating your cart on Shopify…</p>
        </div>
      )}

      {stage !== "creating" && checkout && stage !== "confirmed" && (
        <div className="sco-grid">
          {/* left — forms */}
          <div className="sco-forms">
            <div className="sco-brand">Hanalei Strings</div>

            <h4>Contact</h4>
            <input className="sco-input" value="aloha@hanalei-demo.com" readOnly />

            <h4>Delivery</h4>
            <div className="sco-row2">
              <input className="sco-input" value="Tora" readOnly />
              <input className="sco-input" value="Smart" readOnly />
            </div>
            <input className="sco-input" value="5-5190 Kūhiō Hwy" readOnly />
            <div className="sco-row2">
              <input className="sco-input" value="Hanalei, HI" readOnly />
              <input className="sco-input" value="96714" readOnly />
            </div>

            <h4>Shipping method</h4>
            <div className="sco-ship">
              <span>Standard · arrives in 3–5 days</span>
              <b>Free</b>
            </div>

            <h4>Payment</h4>
            <div className="sco-card">
              <span className="sco-cardno">•••• •••• •••• 4242</span>
              <span className="sco-cardmeta">12 / 28 · CVC •••</span>
            </div>
            <p className="sco-note">Demo checkout — Bogus Gateway test card. No real payment is taken.</p>

            <button className="sco-pay" onClick={payNow} disabled={stage === "paying"}>
              {stage === "paying" ? (
                <>
                  <span className="spinner sm" /> Contacting Shopify · authorizing…
                </>
              ) : (
                <>Pay now · {money(checkout.subtotal)}</>
              )}
            </button>
            <button className="sco-back" onClick={finish} disabled={stage === "paying"}>
              ← Return to shop
            </button>
          </div>

          {/* right — order summary */}
          <div className="sco-summary">
            {checkout.lines.map((l, i) => (
              <div className="sco-line" key={i}>
                <div className="sco-thumb">
                  <span className="q">{l.qty}</span>
                </div>
                <div className="sco-meta">
                  <div className="t">{l.title}</div>
                  <div className="s">{l.sku}</div>
                </div>
                <div className="sco-price">{money(l.price * l.qty)}</div>
              </div>
            ))}
            <div className="sco-tot">
              <span>Subtotal</span>
              <span>{money(checkout.subtotal)}</span>
            </div>
            <div className="sco-tot">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="sco-tot grand">
              <span>Total</span>
              <span>
                <small>USD</small> {money(checkout.subtotal)}
              </span>
            </div>
            <div className="sco-powered">
              <span className="bag">🛍️</span> Powered by <b>Shopify</b>
            </div>
          </div>
        </div>
      )}

      {stage === "confirmed" && order && (
        <div className="sco-confirm">
          <div className="sco-check">✓</div>
          <h3>Order confirmed</h3>
          <p className="sco-order">
            Order <b>{order.orderNumber}</b> · {money(order.total)}
          </p>
          <p className="sco-inv">
            <span className="sync-dot" /> Inventory updated in Shopify — stock decremented, confirmation
            email queued.
          </p>
          <button className="sco-pay" onClick={finish}>
            Back to the shop
          </button>
        </div>
      )}
    </motion.div>
  );
}
