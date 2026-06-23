// ─────────────────────────────────────────────────────────────────────────────
// THE SINGLE SOURCE OF TRUTH
// In production this is the Shopify Storefront API (products / variants / price /
// stock / checkout). In the demo it's mocked here — but every surface in the app
// (the 3D hotspots, the 2D fallback grid, and the AI agent) reads from THIS list
// and nothing else. That is the entire architectural thesis in one file.
// ─────────────────────────────────────────────────────────────────────────────

export type ProductKind = "ukulele" | "lesson" | "vinyl" | "yarn";

export interface Product {
  id: string;
  sku: string;
  title: string;
  kind: ProductKind;
  price: number; // USD
  /** stock as it would read from Shopify inventory */
  stock: number;
  /** short, conversion-minded line (the "Sells") */
  blurb: string;
  /** the craft / heritage line that rides along into the cart (the "Soul") */
  craft: string;
  /** wood / object tint used by the stand-in 3D model + grid card */
  tint: string;
  /** world-space anchor of the hotspot inside the stand-in shop */
  hotspot: [number, number, number];
  /** label shown on the floating hotspot */
  pin: string;
  /** true => an AI agent may transact this autonomously (low-ticket). */
  agentBuyable: boolean;
  /** true => high-touch; the agent should HAND OFF to a human (Kirk), not buy. */
  handoff?: boolean;
  /** optional cross-sell nudge (used by The Ladder beat) */
  pairsWith?: string;
}

export const BRAND = {
  name: "Hanalei Strings",
  tagline: "Made here, in Hanalei.",
  place: "Ching Young Village · Kūhiō Highway at Aku Road",
  // honest geography, verified
  context:
    "A short walk up Aku Road from Hanalei Bay and the historic pier, cradled by the waterfall-laced green peaks of Nāmolokama, Hīhīmanu and Māmalahoa.",
};

export const CATALOG: Product[] = [
  {
    id: "p_koa_tenor",
    sku: "ISL-HM-TENOR-KOA",
    title: "Hanalei Moon — Solid Koa Tenor",
    kind: "ukulele",
    price: 4800,
    stock: 1,
    blurb: "The one-of-one hero. Next build is ~4 months out.",
    craft: "Solid curly Kaua‘i koa, ~4 months in one pair of hands.",
    tint: "#9a5a2a",
    hotspot: [-0.8672, 1.2583, 0.3828],
    pin: "Hanalei Moon Tenor",
    agentBuyable: false,
    handoff: true,
  },
  {
    id: "p_honu_soprano",
    sku: "BEG-HONU-SOP",
    title: "Honu Soprano — Beginner Ukulele",
    kind: "ukulele",
    price: 79,
    stock: 14,
    blurb: "In stock. The one most students leave with.",
    craft: "Lightweight mahogany, set up by hand at the shop.",
    tint: "#c08a4e",
    hotspot: [-0.8381, 1.2151, 0.3641],
    pin: "Honu Soprano · $79",
    agentBuyable: true,
  },
  {
    id: "p_group_lesson",
    sku: "EXP-GROUP-LESSON",
    title: "Sunset Group Lesson",
    kind: "lesson",
    price: 25,
    stock: 4,
    blurb: "Sat 10am · 4 seats left. Booked in-shop, not off-site.",
    craft: "An hour on the shop stage. Instruments provided. No experience needed.",
    tint: "#3f6b46",
    hotspot: [0.1135, 1.0376, 0.3848],
    pin: "$25 Group Lesson",
    agentBuyable: true,
    pairsWith: "p_honu_soprano",
  },
  {
    id: "p_vinyl_slackkey",
    sku: "VIN-SLACKKEY-3",
    title: "Slack-Key Sessions, Vol. III",
    kind: "vinyl",
    price: 28,
    stock: 22,
    blurb: "Recorded on the shop stage. In stock.",
    craft: "North-shore slack-key, pressed on 180g.",
    tint: "#2a3a55",
    hotspot: [-0.0232, 1.1405, 0.3323],
    pin: "Slack-Key Vol. III",
    agentBuyable: true,
  },
  {
    id: "p_yarn_kauai",
    sku: "FIB-KAUAI-DYE",
    title: "Hand-Dyed Kaua‘i Yarn",
    kind: "yarn",
    price: 24,
    stock: 31,
    blurb: "The local craft corner. In stock.",
    craft: "Dyed by hand on-island, skein by skein.",
    tint: "#a83f5b",
    hotspot: [-0.1463, 1.0033, 0.2987],
    pin: "Hand-Dyed Yarn",
    agentBuyable: true,
  },
];

export const byId = (id: string) => CATALOG.find((p) => p.id === id);

export const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
