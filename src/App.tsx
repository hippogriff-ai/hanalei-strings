import { AnimatePresence, motion } from "framer-motion";
import { Experience } from "./three/Experience";
import { TopBar } from "./ui/TopBar";
import { ProductCard } from "./ui/ProductCard";
import { CartDrawer } from "./ui/CartDrawer";
import { AgentPanel } from "./ui/AgentPanel";
import { GridFallback } from "./ui/GridFallback";
import { Receipts } from "./ui/Receipts";
import { ShopifyCheckout } from "./ui/ShopifyCheckout";
import { EditPanel } from "./ui/EditPanel";
import { LoadingScreen } from "./ui/LoadingScreen";
import { useStore } from "./store";

export default function App() {
  const view = useStore((s) => s.view);
  const activeId = useStore((s) => s.activeId);
  const cartOpen = useStore((s) => s.cartOpen);
  const agentOpen = useStore((s) => s.agentOpen);
  const closeAll = useStore((s) => s.closeAll);
  const checkoutStage = useStore((s) => s.checkoutStage);
  const invToast = useStore((s) => s.invToast);
  const editing = useStore((s) => s.editing);
  const panelOpen = !!activeId || cartOpen || agentOpen;

  return (
    <div className="app">
      <Experience />
      <div className="grain" />

      <TopBar />

      {!editing && view === "world" && (
        <div className="pr-hint">drag to look · W A S D to walk · scroll to move · click a dot to buy</div>
      )}

      <Receipts />

      {editing && (
        <>
          <div className="crosshair">＋</div>
          <EditPanel />
        </>
      )}

      <AnimatePresence>{view === "grid" && <GridFallback key="grid" />}</AnimatePresence>
      <AnimatePresence>
        {panelOpen && (
          <motion.div
            key="scrim"
            className="scrim"
            onClick={closeAll}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>{activeId && <ProductCard key="card" />}</AnimatePresence>
      <AnimatePresence>{cartOpen && <CartDrawer key="cart" />}</AnimatePresence>
      <AnimatePresence>{agentOpen && <AgentPanel key="agent" />}</AnimatePresence>

      <AnimatePresence>{checkoutStage !== "idle" && <ShopifyCheckout key="sco" />}</AnimatePresence>

      <AnimatePresence>
        {invToast && (
          <motion.div
            className="inv-toast"
            key="toast"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
          >
            <span className="sync-dot" /> {invToast}
          </motion.div>
        )}
      </AnimatePresence>

      <LoadingScreen />
    </div>
  );
}
