import { useStore } from "../store";

export function TopBar() {
  const view = useStore((s) => s.view);
  const setView = useStore((s) => s.setView);
  const toggleCart = useStore((s) => s.toggleCart);
  const toggleAgent = useStore((s) => s.toggleAgent);
  const agentOpen = useStore((s) => s.agentOpen);
  const setEditing = useStore((s) => s.setEditing);
  const count = useStore((s) => s.cartCount());

  return (
    <header className="topbar">
      <div className="brand">
        <span className="mark">
          Hanalei <em>Strings</em>
        </span>
        <span className="open-chip">
          <span className="dot" /> Photoreal · Hanalei
        </span>
        <span className="shopify-pill" title="Inventory & checkout powered by Shopify">
          <span className="sync-dot" /> Shopify · synced
        </span>
      </div>

      <div className="bar-actions">
        <button className="icon-btn" onClick={() => setEditing(true)} title="Pin products onto the shop">
          📍 Place hotspots
        </button>

        <div className="seg" role="tablist" aria-label="View">
          <button className={view === "world" ? "on" : ""} onClick={() => setView("world")}>
            Shop
          </button>
          <button className={view === "grid" ? "on" : ""} onClick={() => setView("grid")}>
            Catalog
          </button>
        </div>

        <button className={`icon-btn ${agentOpen ? "active" : ""}`} onClick={() => toggleAgent()} data-tour="agent">
          ✦ Ask an agent
        </button>

        <button className="icon-btn" onClick={() => toggleCart()} aria-label="Cart">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M3 4h2l2.4 12.3a1 1 0 0 0 1 .7h8.7a1 1 0 0 0 1-.8L21 8H6" />
            <circle cx="9" cy="20" r="1.3" />
            <circle cx="18" cy="20" r="1.3" />
          </svg>
          Cart
          {count > 0 && <span className="badge">{count}</span>}
        </button>
      </div>
    </header>
  );
}
