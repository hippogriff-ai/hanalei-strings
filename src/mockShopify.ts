// ─────────────────────────────────────────────────────────────────────────────
// SIMULATED SHOPIFY
// Nothing here is wired to a real store — but it mimics the *shape* and *latency*
// of the real Shopify Storefront API so the demo conveys the production wiring:
// clicks create a real cart, checkout hands to Shopify's hosted page, and stock
// is owned by Shopify's inventory. Swap this file for the real Storefront client
// and the UI doesn't change.
// ─────────────────────────────────────────────────────────────────────────────

import { byId, money } from "./catalog";

export const SHOP_DOMAIN = "hanalei-strings.myshopify.com";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const hx = (n: number) =>
  Array.from({ length: n }, () => Math.floor(Math.random() * 16).toString(16)).join("");

export interface Line {
  id: string;
  qty: number;
}

export interface Checkout {
  checkoutId: string;
  webUrl: string;
  lines: { title: string; qty: number; price: number; sku: string }[];
  subtotal: number;
}

/** Storefront API: cartCreate → returns a hosted checkoutUrl */
export async function createCheckout(lines: Line[]): Promise<Checkout> {
  await wait(650 + Math.random() * 400);
  const resolved = lines.map((l) => ({ p: byId(l.id)!, qty: l.qty })).filter((x) => x.p);
  const token = hx(24);
  return {
    checkoutId: `gid://shopify/Cart/${token}`,
    webUrl: `https://${SHOP_DOMAIN}/cart/c/${token}`,
    lines: resolved.map((x) => ({ title: x.p.title, qty: x.qty, price: x.p.price, sku: x.p.sku })),
    subtotal: resolved.reduce((s, x) => s + x.p.price * x.qty, 0),
  };
}

export interface Order {
  orderId: string;
  orderNumber: string;
  total: number;
}

/** hosted checkout: completePayment (Bogus Gateway) → order + inventory commit */
export async function placeOrder(checkout: Checkout): Promise<Order> {
  await wait(1100 + Math.random() * 600);
  return {
    orderId: `gid://shopify/Order/${hx(16)}`,
    orderNumber: `#${1000 + Math.floor(Math.random() * 9000)}`,
    total: checkout.subtotal,
  };
}

export const fmt = money;
