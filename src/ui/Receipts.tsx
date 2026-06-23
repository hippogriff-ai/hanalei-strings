import { money } from "../catalog";
import { useStore } from "../store";

export function Receipts() {
  const receipts = useStore((s) => s.receipts);
  if (receipts.length === 0) return null;

  return (
    <div className="spike" aria-hidden>
      {receipts.slice(0, 4).map((r) => (
        <div className={`receipt ${r.who}`} key={r.key}>
          <div className="rh">
            <span className={`who ${r.who}`}>{r.who === "human" ? "● Shop floor" : "✦ AI agent"}</span>
            <span>#{r.key.replace("r", "")}</span>
          </div>
          {r.lines.map((l, i) => (
            <div className="ln" key={i}>
              <span>
                {l.qty}× {l.title.split(" — ")[0]}
              </span>
              <span>{money(l.price * l.qty)}</span>
            </div>
          ))}
          {r.handoff ? (
            <div className="hand">handed to Kirk · waitlist held</div>
          ) : (
            <div className="tot">
              <span>paid</span>
              <span>{money(r.total)}</span>
            </div>
          )}
        </div>
      ))}
      <div className="spike-base" />
    </div>
  );
}
