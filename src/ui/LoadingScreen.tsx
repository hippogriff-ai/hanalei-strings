import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function LoadingScreen() {
  const [gone, setGone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setGone(true), 1700);
    return () => clearTimeout(t);
  }, []);
  if (gone) return null;
  return (
    <motion.div className="loader" exit={{ opacity: 0 }} animate={{ opacity: gone ? 0 : 1 }}>
      <div className="loader-inner">
        <div className="loader-mark">
          Hanalei <em>Strings</em>
        </div>
        <div className="loader-sub">
          <span className="spinner sm" /> warming up the shop…
        </div>
      </div>
    </motion.div>
  );
}
