import { create } from "zustand";
import { CATALOG, byId, type Product } from "./catalog";
import { createCheckout, placeOrder, type Checkout, type Order } from "./mockShopify";

// persistence for user-authored hotspot positions + splat orientation
const LS_H = "hs_hotspots_v3";
const LS_O = "hs_orient_v2";
const loadHotspots = (): Record<string, [number, number, number]> => {
  try { return JSON.parse(localStorage.getItem(LS_H) || "{}"); } catch { return {}; }
};
const saveHotspots = (h: any) => { try { localStorage.setItem(LS_H, JSON.stringify(h)); } catch {} };
const loadOrient = () => {
  try { return JSON.parse(localStorage.getItem(LS_O) || '{"flip":false,"yaw":0}'); } catch { return { flip: false, yaw: 0 }; }
};
const saveOrient = (flip: boolean, yaw: number) => { try { localStorage.setItem(LS_O, JSON.stringify({ flip, yaw })); } catch {} };

export type Mode = "cinematic" | "freeroam";
export type View = "world" | "grid";
export type Who = "human" | "agent";
export type Place = "in" | "front" | "back"; // inside · Ching Young Village side · evening lawn side

export interface CartLine {
  id: string;
  qty: number;
}
export interface Receipt {
  key: string;
  who: Who;
  lines: { title: string; price: number; qty: number }[];
  total: number;
  ts: number;
  handoff?: boolean; // true => "reserved / connect with Kirk" rather than a sale
}

interface State {
  mode: Mode;
  view: View;
  activeId: string | null;
  cartOpen: boolean;
  agentOpen: boolean;
  place: Place; // which side of the shop you're viewing
  humanCart: CartLine[];
  sold: Record<string, number>;
  receipts: Receipt[];

  // simulated Shopify checkout
  checkoutStage: "idle" | "creating" | "review" | "paying" | "confirmed";
  checkout: Checkout | null;
  order: Order | null;
  invToast: string | null;
  tourActive: boolean;
  photoreal: boolean;

  // photoreal-splat experience: hotspot placement + orientation (user-authored)
  editing: boolean;
  selectedEdit: string | null;
  placeNonce: number;
  hotspotPos: Record<string, [number, number, number]>;
  splatFlip: boolean;
  splatYaw: number; // 0..3 → 0/90/180/270°
  splatSpan: number; // scene size, for movement speed

  setMode: (m: Mode) => void;
  setTourActive: (b: boolean) => void;
  setPhotoreal: (b: boolean) => void;
  setEditing: (b: boolean) => void;
  selectEdit: (id: string | null) => void;
  requestPlace: () => void;
  setHotspotPos: (id: string, pos: [number, number, number]) => void;
  resetHotspots: () => void;
  toggleFlip: () => void;
  rotateYaw: () => void;
  setSplatSpan: (n: number) => void;
  takeTheWheel: () => void;
  setView: (v: View) => void;
  setPlace: (p: Place) => void;
  openProduct: (id: string | null) => void;
  toggleCart: (b?: boolean) => void;
  toggleAgent: (b?: boolean) => void;
  closeAll: () => void;

  addToCart: (id: string, qty?: number) => void;
  removeFromCart: (id: string) => void;
  commitReceipt: (who: Who, lines: CartLine[]) => void;
  beginCheckout: () => Promise<void>;
  payNow: () => Promise<void>;
  finishCheckout: () => void;

  stockOf: (id: string) => number;
  cartCount: () => number;
}

let receiptSeq = 0;

export const useStore = create<State>((set, get) => ({
  mode: "cinematic",
  view: "world",
  activeId: null,
  cartOpen: false,
  agentOpen: false,
  place: "in",
  humanCart: [],
  sold: {},
  receipts: [],
  checkoutStage: "idle",
  checkout: null,
  order: null,
  invToast: null,
  tourActive: true,
  photoreal: false,
  editing: false,
  selectedEdit: null,
  placeNonce: 0,
  hotspotPos: loadHotspots(),
  splatFlip: loadOrient().flip,
  splatYaw: loadOrient().yaw,
  splatSpan: 4,

  setMode: (m) => set({ mode: m }),
  setTourActive: (b) => set({ tourActive: b }),
  setPhotoreal: (b) => set({ photoreal: b }),
  setEditing: (b) => set((s) => ({ editing: b, selectedEdit: b ? s.selectedEdit : null })),
  selectEdit: (id) => set({ selectedEdit: id }),
  requestPlace: () => set((s) => ({ placeNonce: s.placeNonce + 1 })),
  setHotspotPos: (id, pos) =>
    set((s) => {
      const hp = { ...s.hotspotPos, [id]: pos };
      saveHotspots(hp);
      return { hotspotPos: hp };
    }),
  resetHotspots: () => {
    saveHotspots({});
    set({ hotspotPos: {} });
  },
  toggleFlip: () =>
    set((s) => {
      saveOrient(!s.splatFlip, s.splatYaw);
      return { splatFlip: !s.splatFlip };
    }),
  rotateYaw: () =>
    set((s) => {
      const y = (s.splatYaw + 1) % 4;
      saveOrient(s.splatFlip, y);
      return { splatYaw: y };
    }),
  setSplatSpan: (n) => set({ splatSpan: n }),
  takeTheWheel: () => set({ mode: "freeroam" }),
  setView: (v) => set({ view: v }),
  setPlace: (p) => set({ place: p }),
  openProduct: (id) => set({ activeId: id, cartOpen: false, agentOpen: false }),
  toggleCart: (b) => set((s) => ({ cartOpen: b ?? !s.cartOpen, agentOpen: false, activeId: null })),
  toggleAgent: (b) => set((s) => ({ agentOpen: b ?? !s.agentOpen, cartOpen: false, activeId: null })),
  closeAll: () => set({ activeId: null, cartOpen: false, agentOpen: false }),

  addToCart: (id, qty = 1) =>
    set((s) => {
      const existing = s.humanCart.find((l) => l.id === id);
      const humanCart = existing
        ? s.humanCart.map((l) => (l.id === id ? { ...l, qty: l.qty + qty } : l))
        : [...s.humanCart, { id, qty }];
      return { humanCart, cartOpen: true, activeId: null, agentOpen: false };
    }),

  removeFromCart: (id) => set((s) => ({ humanCart: s.humanCart.filter((l) => l.id !== id) })),

  commitReceipt: (who, lines) => {
    const s = get();
    const resolved = lines
      .map((l) => ({ p: byId(l.id) as Product, qty: l.qty }))
      .filter((x) => x.p);
    const handoff = resolved.some((x) => x.p.handoff);
    const total = resolved.reduce((sum, x) => sum + x.p.price * x.qty, 0);
    const sold = { ...s.sold };
    for (const x of resolved) sold[x.p.id] = (sold[x.p.id] ?? 0) + x.qty;
    const receipt: Receipt = {
      key: `r${++receiptSeq}`,
      who,
      lines: resolved.map((x) => ({ title: x.p.title, price: x.p.price, qty: x.qty })),
      total,
      ts: Date.now(),
      handoff,
    };
    const first = resolved[0]?.p.title.split(" — ")[0] ?? "items";
    set({
      receipts: [receipt, ...s.receipts],
      sold,
      invToast: handoff ? `Shopify · ${first} reserved` : `Shopify inventory updated · ${first}`,
    });
    setTimeout(() => get().invToast && set({ invToast: null }), 2800);
  },

  beginCheckout: async () => {
    const { humanCart } = get();
    if (humanCart.length === 0) return;
    set({ checkoutStage: "creating", cartOpen: false });
    const checkout = await createCheckout(humanCart);
    set({ checkout, checkoutStage: "review" });
  },

  payNow: async () => {
    const { checkout, humanCart, commitReceipt } = get();
    if (!checkout) return;
    set({ checkoutStage: "paying" });
    const order = await placeOrder(checkout);
    commitReceipt("human", humanCart);
    set({ order, checkoutStage: "confirmed", humanCart: [] });
  },

  finishCheckout: () => set({ checkoutStage: "idle", checkout: null, order: null }),

  stockOf: (id) => {
    const base = CATALOG.find((p) => p.id === id)?.stock ?? 0;
    return Math.max(0, base - (get().sold[id] ?? 0));
  },

  cartCount: () => get().humanCart.reduce((n, l) => n + l.qty, 0),
}));
