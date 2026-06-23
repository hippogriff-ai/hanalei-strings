import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { CATALOG, byId, money } from "../catalog";
import { useStore } from "../store";

type Msg =
  | { t: "user" | "bot"; text: string }
  | { t: "tool"; call: string; result: string }
  | { t: "prod"; id: string }
  | { t: "typing" };

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function AgentPanel() {
  const toggleAgent = useStore((s) => s.toggleAgent);
  const commitReceipt = useStore((s) => s.commitReceipt);
  const [msgs, setMsgs] = useState<Msg[]>([
    { t: "bot", text: "I read the same Shopify catalog as the shop floor — search → cart → checkout. Try one:" },
  ]);
  const [busy, setBusy] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  const push = (m: Msg) =>
    setMsgs((prev) => {
      const next = prev.filter((x) => x.t !== "typing");
      next.push(m);
      return next;
    });
  const typing = () => setMsgs((prev) => [...prev.filter((x) => x.t !== "typing"), { t: "typing" }]);
  const scroll = () => requestAnimationFrame(() => bodyRef.current?.scrollTo(0, 9e9));

  async function runBuy() {
    if (busy) return;
    setBusy(true);
    const honu = byId("p_honu_soprano")!;
    const lesson = byId("p_group_lesson")!;

    push({ t: "user", text: "Find a beginner ukulele under $120 that's in stock, add the group lesson, and start checkout." });
    scroll();
    typing(); scroll(); await sleep(900);
    push({
      t: "tool",
      call: 'POST /api/mcp · search_catalog { query:"beginner ukulele", max_price:120, in_stock:true }',
      result: `1 match · ${honu.sku} · ${money(honu.price)} · stock ${honu.stock}`,
    });
    push({ t: "prod", id: honu.id }); scroll(); await sleep(800);
    typing(); scroll(); await sleep(700);
    push({
      t: "tool",
      call: 'POST /api/mcp · search_catalog { query:"group lesson" }',
      result: `1 match · ${lesson.sku} · ${money(lesson.price)} · ${lesson.stock} seats`,
    });
    push({ t: "prod", id: lesson.id }); scroll(); await sleep(800);
    typing(); scroll(); await sleep(800);
    push({ t: "bot", text: "Both in stock. Building a cart on the live store…" }); scroll(); await sleep(700);
    push({
      t: "tool",
      call: "POST /api/mcp · create_cart [ BEG-HONU-SOP×1, EXP-GROUP-LESSON×1 ]",
      result: "cart gid://shopify/Cart/c1-9f3a · subtotal " + money(honu.price + lesson.price),
    });
    scroll(); await sleep(700); typing(); scroll(); await sleep(700);
    push({
      t: "tool",
      call: "POST /api/mcp · checkout { cart:'c1-9f3a' }",
      result: "checkout_url → hanalei-strings.myshopify.com/cart/c/c1-9f3a",
    });
    commitReceipt("agent", [{ id: honu.id, qty: 1 }, { id: lesson.id, qty: 1 }]);
    scroll(); await sleep(500);
    push({ t: "bot", text: "Done — checkout link ready, and a receipt just landed on the same spike the shop floor uses. Same shelf, two buyers." });
    scroll();
    setBusy(false);
  }

  async function askKoa() {
    if (busy) return;
    setBusy(true);
    const koa = byId("p_koa_tenor")!;
    push({ t: "user", text: "Just buy me the Hanalei Moon koa tenor." });
    scroll(); typing(); scroll(); await sleep(900);
    push({
      t: "tool",
      call: 'POST /api/mcp · get_product { sku:"ISL-HM-TENOR-KOA" }',
      result: `${money(koa.price)} · stock 1 · flag: high_touch / made_to_order`,
    });
    push({ t: "prod", id: koa.id }); scroll(); await sleep(900); typing(); scroll(); await sleep(800);
    push({
      t: "bot",
      text: "This one's a one-of-one, ~4-month koa build at $4,800 — flagged high-touch. I won't auto-buy that. I'll hand you to Kirk to spec it, and hold your place on the waitlist.",
    });
    scroll();
    setBusy(false);
  }

  return (
    <motion.aside
      className="panel"
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", stiffness: 320, damping: 36 }}
    >
      <div className="panel-head agent-head">
        <h3>✦ Shopping agent</h3>
        <button className="x" onClick={() => toggleAgent(false)}>
          ✕
        </button>
      </div>
      <div className="agent-sub">Same store · Storefront MCP at /api/mcp · discovery → cart → checkout</div>

      <div className="panel-body" ref={bodyRef}>
        <div className="chat">
          {msgs.map((m, i) => {
            if (m.t === "typing")
              return (
                <div className="typing" key={i}>
                  <span /><span /><span />
                </div>
              );
            if (m.t === "tool")
              return (
                <div className="msg tool" key={i}>
                  <span className="k">→</span> {m.call}
                  {"\n"}
                  <span className="k">←</span> {m.result}
                </div>
              );
            if (m.t === "prod") {
              const p = byId(m.id)!;
              return (
                <div className="agent-prod" key={i}>
                  <div className="thumb" style={{ background: p.tint }} />
                  <div style={{ flex: 1 }}>
                    <div className="t">{p.title}</div>
                    <div className="s">
                      {money(p.price)} · {p.sku}
                    </div>
                  </div>
                </div>
              );
            }
            return (
              <div className={`msg ${m.t}`} key={i}>
                {m.text}
              </div>
            );
          })}
        </div>
      </div>

      <div className="panel-foot">
        <div className="agent-foot">
          <button className="btn btn-sea btn-sm" onClick={runBuy} disabled={busy} data-tour="run-buy">
            ▶ Run the buy
          </button>
          <button className="btn btn-ghost btn-sm" onClick={askKoa} disabled={busy}>
            Ask about the koa
          </button>
        </div>
      </div>
    </motion.aside>
  );
}
