import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useStore } from "../store";

interface Snap {
  mode: string;
  hasProduct: boolean;
  inCart: boolean;
  checkoutStage: string;
  agentOpen: boolean;
  agentBought: boolean;
}

interface Step {
  text: string;
  target?: string; // CSS selector to spotlight
  cta?: string; // shows a manual Next button with this label
  onCta?: () => void;
  done?: (s: Snap) => boolean; // auto-advance when true
}

export function GuidedTour() {
  const takeTheWheel = useStore((s) => s.takeTheWheel);
  const setTourActive = useStore((s) => s.setTourActive);

  const STEPS: Step[] = [
    {
      text: "Welcome to Hanalei Strings — a virtual shop you can actually buy from. In two minutes you'll see one Shopify store serve a human and an AI. Ready?",
      cta: "Start the tour",
    },
    {
      text: "You're soaring over Hanalei Bay — down onto the historic pier, along the beach, and into Ching Young Village to the shop. Watch, or skip ahead.",
      cta: "Take the wheel ↦",
      onCta: takeTheWheel,
      done: (s) => s.mode === "freeroam",
    },
    {
      text: "You've got control now. Drag anywhere to look around the koa-filled shop.",
      cta: "Got it",
    },
    {
      text: "See the glowing dots on the instruments? Tap the koa ukulele in the middle to inspect it.",
      target: ".hotspot",
      done: (s) => s.hasProduct,
    },
    {
      text: "This per-item 3D view is the part proven to lift sales ~94%. When you're ready, press Add to cart.",
      target: '[data-tour="add-cart"]',
      done: (s) => s.inCart,
    },
    {
      text: "Your cart is a real Shopify cart. Press Checkout to hand off to Shopify.",
      target: '[data-tour="cart-checkout"]',
      done: (s) => s.checkoutStage !== "idle",
    },
    {
      text: "This is Shopify's secure checkout — the same page real customers would use. Press Pay now.",
      target: ".sco-pay",
      done: (s) => s.checkoutStage === "confirmed",
    },
    {
      text: "Order confirmed, and Shopify just updated the inventory. Press Back to the shop to continue.",
      target: ".sco-pay",
      done: (s) => s.checkoutStage === "idle",
    },
    {
      text: "Now the other buyer: an AI agent. Open “Ask an agent” in the top right.",
      target: '[data-tour="agent"]',
      done: (s) => s.agentOpen,
    },
    {
      text: "Press “Run the buy.” Watch it search the same Shopify catalog, build a cart, and check out — all on its own.",
      target: '[data-tour="run-buy"]',
      done: (s) => s.agentBought,
    },
    {
      text: "That's the whole idea: two buyers, one Shopify store, both receipts on the same spike. Explore freely — and try the Village / Inside / Music side toggle to walk through the shop's two doors, day and evening.",
      target: ".spike",
      cta: "Finish",
    },
  ];

  const [idx, setIdx] = useState(0);
  const [active, setActive] = useState(true);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const idxRef = useRef(idx);
  idxRef.current = idx;

  useEffect(() => setTourActive(active), [active, setTourActive]);

  const rightPanelOpen = useStore((s) => !!s.activeId || s.cartOpen || s.agentOpen);

  // individual PRIMITIVE selectors — so the auto-advance effect below only re-runs
  // when one of these actually changes (NOT on every spotlight re-measure tick).
  const mode = useStore((s) => s.mode);
  const hasProduct = useStore((s) => !!s.activeId);
  const inCart = useStore((s) => s.humanCart.length > 0);
  const checkoutStage = useStore((s) => s.checkoutStage);
  const agentOpen = useStore((s) => s.agentOpen);
  const agentBought = useStore((s) => s.receipts.some((r) => r.who === "agent"));
  const snap: Snap = { mode, hasProduct, inCart, checkoutStage, agentOpen, agentBought };

  // auto-advance when the current step's condition is met
  useEffect(() => {
    if (!active) return;
    const step = STEPS[idx];
    if (step?.done && step.done(snap)) {
      const t = setTimeout(() => setIdx((i) => Math.min(i + 1, STEPS.length - 1)), 450);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, active, mode, hasProduct, inCart, checkoutStage, agentOpen, agentBought]);

  // track the spotlight target rect
  useEffect(() => {
    if (!active) return;
    const sel = STEPS[idx]?.target;
    if (!sel) {
      setRect(null);
      return;
    }
    const tick = () => {
      const el = document.querySelector(sel);
      setRect(el ? el.getBoundingClientRect() : null);
    };
    tick();
    const id = setInterval(tick, 200);
    return () => clearInterval(id);
  }, [idx, active]);

  if (!active) {
    return (
      <button className="tour-replay" onClick={() => { setIdx(0); setActive(true); }}>
        ? Walkthrough
      </button>
    );
  }

  const step = STEPS[idx];
  const last = idx === STEPS.length - 1;
  const pad = 8;

  const next = () => {
    step.onCta?.();
    if (last) setActive(false);
    else setIdx((i) => i + 1);
  };

  return (
    <>
      {rect && (
        <div
          className="tour-spot"
          style={{
            left: rect.left - pad,
            top: rect.top - pad,
            width: rect.width + pad * 2,
            height: rect.height + pad * 2,
          }}
        />
      )}

      <div className={"tour-dock" + (rightPanelOpen ? " left" : "")}>
        <motion.div
          className="tour-card"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="tour-top">
            <span className="tour-step">
              {idx + 1} / {STEPS.length}
            </span>
            <button className="tour-skip" onClick={() => setActive(false)}>
              Skip tour
            </button>
          </div>
          <p className="tour-text" key={idx}>
            {step.text}
          </p>
          <div className="tour-actions">
            {idx > 0 && !last && (
              <button className="tour-back" onClick={() => setIdx((i) => Math.max(0, i - 1))}>
                ← Back
              </button>
            )}
            {step.cta ? (
              <button className="tour-next" onClick={next}>
                {step.cta}
              </button>
            ) : (
              <span className="tour-wait">
                <span className="tour-pulse" /> waiting for you…
              </span>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
}
