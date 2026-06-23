import { chromium } from "playwright";
import { mkdirSync } from "fs";

const shots = "/tmp/hanalei-shots";
mkdirSync(shots, { recursive: true });

const errors = [];
const browser = await chromium.launch({
  headless: true,
  args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-gl=angle", "--use-angle=swiftshader", "--ignore-gpu-blocklist"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
page.on("console", (m) => m.type() === "error" && errors.push("CONSOLE: " + m.text()));
page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message));

const shot = (n) => page.screenshot({ path: `${shots}/${n}.png` });
const click = (re, opts = {}) => page.getByRole("button", { name: re }).first().click({ timeout: 6000, ...opts });
const step = async (name, fn) => {
  try { await fn(); await shot(name); console.log("ok:", name); }
  catch (e) { console.log("FAIL:", name, "->", e.message.split("\n")[0]); await shot(name + "-FAIL").catch(() => {}); }
};

await page.goto("http://localhost:5173/#cam=0", { waitUntil: "networkidle", timeout: 30000 });
await page.waitForTimeout(2600);
await page.getByRole("button", { name: /Skip tour/ }).click().catch(() => {});

// ── journey beats (deterministic via the scrubber) ──
for (const [n, t] of [["01-aerial", 0], ["02-pier", 0.25], ["03-beach", 0.5], ["04-village", 0.625], ["05-storefront", 0.75]]) {
  await page.evaluate((v) => { location.hash = "#cam=" + v; }, t);
  await page.waitForTimeout(450);
  await step(n, async () => {});
}

// ── enter free-roam & exercise the commerce flow ──
await page.evaluate(() => { location.hash = ""; });
await page.waitForTimeout(200);
await click(/Take the wheel/).catch(() => {});
await page.waitForTimeout(1500);
await step("06-interior", async () => {});

await step("07-product", async () => {
  await page.locator(".hotspot").first().click({ timeout: 6000 });
  await page.waitForTimeout(1100);
});
await step("08-shopify-checkout", async () => {
  await click(/Add to cart|Book the lesson/);
  await page.waitForTimeout(700);
  await click(/Checkout · Shopify/);
  await page.waitForTimeout(1600);
});
await step("09-confirmed", async () => {
  await click(/Pay now/);
  await page.waitForTimeout(2200);
});
await step("10-agent", async () => {
  await click(/Back to the shop/);
  await page.waitForTimeout(600);
  await click(/Ask an agent/);
  await page.waitForTimeout(400);
  await click(/Run the buy/);
  await page.waitForTimeout(8800);
});
await step("11-evening", async () => {
  await page.locator(".scrim").click({ timeout: 4000 }).catch(() => {});
  await page.waitForTimeout(300);
  await click(/Music side/);
  await page.waitForTimeout(1500);
});
await step("12-village", async () => {
  await click(/^Village$/);
  await page.waitForTimeout(1300);
});

console.log("\n=== ERRORS (" + errors.length + ") ===");
for (const e of errors.slice(0, 30)) console.log(e);
await browser.close();
