import { useMemo } from "react";
import { Ukulele } from "./Ukulele";
import { CATALOG } from "../catalog";
import { useStore } from "../store";
import * as T from "./textures";

const UKE_COLORS = ["#e07b39", "#2f8f86", "#c84b6e", "#4a8f4a", "#e0b24a", "#8a5a2e", "#3a6ea5", "#b07a44", "#d24f3a", "#7a5aa8"];

export function Shop() {
  const tex = useMemo(
    () => ({
      slatBack: T.slatwall(4, 1.6),
      slatL: T.slatwall(3, 1.6),
      slatR: T.slatwall(3, 1.6),
      window: T.windowSign(),
      kala: T.kalaSign(),
      ching: T.chingYoungSign(),
      sign: T.shopSign("HANALEI STRINGS", "Ukuleles · Koa · Vinyl · Aloha"),
      chalk: T.chalkboard(),
      tee: T.tee(),
      portraits: [T.portrait(0), T.portrait(1), T.portrait(2), T.portrait(3), T.portrait(4)],
      textiles: [
        T.textile(["#3f6b46", "#e0b24a", "#c84b6e", "#f4efe4"], 1),
        T.textile(["#b14a63", "#2f8f86", "#e0b24a", "#1a1a1a"], 2),
        T.textile(["#2a3a55", "#d24f3a", "#4a8f4a", "#f4efe4"], 3),
      ],
      wood: T.woodSign(),
      neonLM: T.neon("Live Music", "#ff4fd8"),
      neonUL: T.neon("Ukulele Lessons", "#ff7ad0"),
      neonOpen: T.neon("OPEN", "#ff5a4f", false),
    }),
    []
  );

  const koa = CATALOG.find((p) => p.id === "p_koa_tenor")!;
  const night = useStore((s) => s.place) === "back";
  const plaster = "#e7e2d4";

  return (
    <group>
      {/* ── shell ──────────────────────────────────────────── */}
      {/* polished concrete floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -1.2]}>
        <planeGeometry args={[6.9, 5.7]} />
        <meshStandardMaterial color="#8d8c86" roughness={0.55} metalness={0.05} />
      </mesh>
      {/* black ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 3.0, -1.2]}>
        <planeGeometry args={[6.9, 5.7]} />
        <meshStandardMaterial color="#16171b" roughness={0.95} />
      </mesh>
      {/* ceiling beams */}
      {[-2, 0, 2].map((x) => (
        <mesh key={x} position={[x, 2.95, -1.2]}>
          <boxGeometry args={[0.12, 0.12, 5.7]} />
          <meshStandardMaterial color="#0e0f12" />
        </mesh>
      ))}

      {/* back slatwall with a SECOND door (the evening-side exit) */}
      <mesh position={[-2.05, 1.5, -4]}>
        <boxGeometry args={[2.8, 3, 0.1]} />
        <meshStandardMaterial map={tex.slatBack} color="#f2f2ee" roughness={0.9} />
      </mesh>
      <mesh position={[2.05, 1.5, -4]}>
        <boxGeometry args={[2.8, 3, 0.1]} />
        <meshStandardMaterial map={tex.slatBack} color="#f2f2ee" roughness={0.9} />
      </mesh>
      <mesh position={[0, 2.65, -4]}>
        <boxGeometry args={[1.3, 0.7, 0.1]} />
        <meshStandardMaterial map={tex.slatBack} color="#f2f2ee" roughness={0.9} />
      </mesh>
      {/* glass back door */}
      <mesh position={[0, 1.15, -4.04]}>
        <planeGeometry args={[1.2, 2.3]} />
        <meshStandardMaterial color="#1b2a2a" transparent opacity={0.55} roughness={0.1} />
      </mesh>
      <mesh position={[-3.42, 1.5, -1.2]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[5.7, 3, 0.1]} />
        <meshStandardMaterial map={tex.slatL} color="#f2f2ee" roughness={0.9} />
      </mesh>
      <mesh position={[3.42, 1.5, -1.2]} rotation={[0, -Math.PI / 2, 0]}>
        <boxGeometry args={[5.7, 3, 0.1]} />
        <meshStandardMaterial map={tex.slatR} color="#f2f2ee" roughness={0.9} />
      </mesh>

      {/* ── ukulele walls (the colourful slatwall) ─────────── */}
      {/* left wall ukes */}
      {[
        [2.3, -0.5], [2.0, -1.4], [2.3, -2.3], [2.0, -3.2],
        [1.5, -0.9], [1.5, -1.9], [1.5, -2.9], [1.1, -1.4], [1.1, -2.4],
      ].map(([y, z], i) => (
        <group key={`lu${i}`} position={[-3.32, y, z]} rotation={[0, Math.PI / 2, 0.12]}>
          <Ukulele tint={UKE_COLORS[i % UKE_COLORS.length]} scale={0.26} rotation={[0, 0, 0]} />
        </group>
      ))}
      {/* back wall ukes + framed photos */}
      {[[-1.2, 2.2], [1.4, 2.2], [2.0, 2.15]].map(([x, y], i) => (
        <group key={`bu${i}`} position={[x, y, -3.92]} rotation={[0, 0, 0.1]}>
          <Ukulele tint={UKE_COLORS[(i + 3) % UKE_COLORS.length]} scale={0.24} rotation={[0, 0, 0]} />
        </group>
      ))}
      {tex.portraits.map((p, i) => (
        <mesh key={`ph${i}`} position={[-2.4 + i * 1.15, 2.62, -3.93]}>
          <planeGeometry args={[0.34, 0.42]} />
          <meshStandardMaterial map={p} />
        </mesh>
      ))}
      {/* right wall guitars + ukes */}
      {[[2.2, -1.0], [2.2, -2.0], [2.2, -2.9], [1.7, -1.5], [1.7, -2.5]].map(([y, z], i) => (
        <group key={`ru${i}`} position={[3.32, y, z]} rotation={[0, -Math.PI / 2, -0.12]}>
          <Ukulele tint={i % 2 ? "#8a5a2e" : "#b07a44"} scale={0.3} rotation={[0, 0, 0]} />
        </group>
      ))}

      {/* mirror + tee on the left wall */}
      <mesh position={[-3.36, 1.55, -1.7]} rotation={[0, Math.PI / 2, 0]}>
        <circleGeometry args={[0.34, 32]} />
        <meshStandardMaterial color="#cfe0dd" metalness={0.6} roughness={0.15} />
      </mesh>
      <mesh position={[-3.34, 1.45, -0.7]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.6, 0.7]} />
        <meshStandardMaterial map={tex.tee} transparent />
      </mesh>

      {/* ── pews + piano (lesson corner) ───────────────────── */}
      <group position={[-2.6, 0, -0.7]}>
        <mesh position={[0, 0.42, 0]}>
          <boxGeometry args={[0.5, 0.12, 2.2]} />
          <meshStandardMaterial color="#6e4a28" roughness={0.7} />
        </mesh>
        <mesh position={[-0.22, 0.75, 0]}>
          <boxGeometry args={[0.08, 0.7, 2.2]} />
          <meshStandardMaterial color="#5a3c20" />
        </mesh>
        <mesh position={[0.05, 0.49, 0]}>
          <boxGeometry args={[0.42, 0.06, 2.0]} />
          <meshStandardMaterial color="#2f7d74" roughness={0.8} />
        </mesh>
      </group>
      {/* upright piano far back-left */}
      <group position={[-2.7, 0, -3.4]}>
        <mesh position={[0, 0.6, 0]}>
          <boxGeometry args={[0.6, 1.2, 1.3]} />
          <meshStandardMaterial color="#111114" roughness={0.4} />
        </mesh>
        <mesh position={[0.32, 0.72, 0]}>
          <boxGeometry args={[0.05, 0.12, 1.1]} />
          <meshStandardMaterial color="#f2f0e8" />
        </mesh>
      </group>

      {/* ── colourful cable-spool tables ───────────────────── */}
      <SpoolTable position={[-0.4, 0, -0.6]} bands={["#c84b6e", "#e0b24a", "#2f8f86", "#7a5aa8"]} top={tex.textiles[0]} />
      <SpoolTable position={[1.1, 0, -1.2]} bands={["#e0b24a", "#3a6ea5", "#d24f3a", "#4a8f4a"]} top={tex.textiles[1]} />
      <SpoolTable position={[0.2, 0, -2.0]} bands={["#2f8f86", "#c84b6e", "#e0b24a", "#3a6ea5"]} top={tex.textiles[2]} />

      {/* multi-tier round display stand (centre-back) */}
      <group position={[1.6, 0, -2.8]}>
        {[0.5, 0.9, 1.25].map((y, i) => (
          <mesh key={i} position={[0, y, 0]}>
            <cylinderGeometry args={[0.4 - i * 0.1, 0.4 - i * 0.1, 0.05, 20]} />
            <meshStandardMaterial color="#6e4a28" />
          </mesh>
        ))}
        <mesh position={[0, 0.85, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 1.0, 8]} />
          <meshStandardMaterial color="#3a2614" />
        </mesh>
      </group>

      {/* ── hero koa on a display stand ─────────────────────── */}
      <group position={koa.hotspot}>
        <Ukulele tint={koa.tint} scale={0.6} rotation={[0.04, 0.35, 0]} />
      </group>
      <mesh position={[koa.hotspot[0], 0.42, koa.hotspot[2]]}>
        <cylinderGeometry args={[0.04, 0.18, 0.84, 12]} />
        <meshStandardMaterial color="#2e1d0e" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[koa.hotspot[0], 0.03, koa.hotspot[2]]}>
        <circleGeometry args={[0.9, 32]} />
        <meshStandardMaterial color="#e0b878" transparent opacity={0.16} />
      </mesh>

      {/* ── right wall: cinder-block + plank shelves, vinyl, chalkboard ── */}
      <group position={[3.0, 0, -0.4]}>
        {[0.5, 1.1, 1.7].map((y, r) => (
          <group key={r}>
            <mesh position={[0, y, 0]}>
              <boxGeometry args={[0.5, 0.05, 2.2]} />
              <meshStandardMaterial color="#7a5a36" />
            </mesh>
            {[-0.8, -0.2, 0.4, 1.0].map((z, c) => (
              <mesh key={c} position={[0.1, y + 0.18, z]} rotation={[0, 0, 0]}>
                <boxGeometry args={[0.28, 0.3, 0.04]} />
                <meshStandardMaterial color={["#2a3a55", "#7a3a2a", "#2a4a3a", "#55432a"][(r + c) % 4]} />
              </mesh>
            ))}
          </group>
        ))}
        {/* cinder-block supports */}
        {[-1.0, 1.0].map((z) =>
          [0.2, 0.8, 1.4].map((y) => (
            <mesh key={`${z}-${y}`} position={[0, y, z]}>
              <boxGeometry args={[0.4, 0.2, 0.4]} />
              <meshStandardMaterial color="#b8b4a8" roughness={1} />
            </mesh>
          ))
        )}
      </group>
      <mesh position={[3.35, 0.7, 0.6]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[0.7, 0.52]} />
        <meshStandardMaterial map={tex.chalk} />
      </mesh>

      {/* ── storefront windows + counter ───────────────────── */}
      <Storefront tex={tex} />

      {/* ── lighting fixtures (bloom-friendly) ─────────────── */}
      <Pendant position={[-0.3, 0, -0.7]} />
      <Pendant position={[1.1, 0, -1.3]} />
      <Pendant position={[0.3, 0, -2.4]} />
      <StringLights />

      {/* ── exterior: Ching Young Village (day side) ───────── */}
      <Village tex={tex} />

      {/* ── exterior: the evening lawn side (second door) ──── */}
      <BackStorefront tex={tex} night={night} />
    </group>
  );
}

/* ─────────────────────────────────────────────────────────── */

function SpoolTable({ position, bands, top }: { position: [number, number, number]; bands: string[]; top: any }) {
  const stripe = useMemo(() => T.stripes(bands), [bands.join()]);
  return (
    <group position={position}>
      {/* painted drum */}
      <mesh position={[0, 0.32, 0]}>
        <cylinderGeometry args={[0.34, 0.34, 0.64, 24]} />
        <meshStandardMaterial map={stripe} roughness={0.8} />
      </mesh>
      {/* reel disks */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.56, 0.56, 0.06, 28]} />
        <meshStandardMaterial color="#7a5836" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.66, 0]}>
        <cylinderGeometry args={[0.56, 0.56, 0.06, 28]} />
        <meshStandardMaterial color="#8a6840" roughness={0.7} />
      </mesh>
      {/* folded textiles on top */}
      <mesh position={[0, 0.75, 0]}>
        <boxGeometry args={[0.7, 0.14, 0.5]} />
        <meshStandardMaterial map={top} roughness={1} />
      </mesh>
      <mesh position={[0.1, 0.86, 0.05]} rotation={[0, 0.4, 0]}>
        <boxGeometry args={[0.5, 0.1, 0.36]} />
        <meshStandardMaterial map={top} roughness={1} />
      </mesh>
    </group>
  );
}

function Pendant({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 2.95, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.5, 6]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      {/* dome shade */}
      <mesh position={[0, 2.66, 0]} rotation={[Math.PI, 0, 0]}>
        <sphereGeometry args={[0.22, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#2a2a2e" metalness={0.5} roughness={0.5} side={2} />
      </mesh>
      {/* warm bulb (blooms) */}
      <mesh position={[0, 2.6, 0]}>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshStandardMaterial color="#ffdca0" emissive="#ffcf86" emissiveIntensity={3} />
      </mesh>
      <pointLight position={[0, 2.5, 0]} intensity={2.2} distance={4} color="#ffdda6" />
    </group>
  );
}

function StringLights() {
  const pts: [number, number, number][] = [];
  for (let i = 0; i <= 14; i++) pts.push([-3 + (i / 14) * 6, 2.55 + Math.sin(i) * 0.06, 1.2]);
  for (let i = 0; i <= 10; i++) pts.push([-3.2, 2.55 + Math.sin(i) * 0.06, 1 - (i / 10) * 4.6]);
  return (
    <group>
      {pts.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshStandardMaterial color="#fff1cf" emissive="#ffdf9e" emissiveIntensity={2.4} />
        </mesh>
      ))}
    </group>
  );
}

function Storefront({ tex }: { tex: any }) {
  return (
    <group>
      {/* dark window frames / mullions */}
      <mesh position={[-2.6, 1.4, 1.5]}>
        <boxGeometry args={[1.6, 2.8, 0.12]} />
        <meshStandardMaterial color="#1c1c1f" />
      </mesh>
      <mesh position={[2.6, 1.4, 1.5]}>
        <boxGeometry args={[1.6, 2.8, 0.12]} />
        <meshStandardMaterial color="#1c1c1f" />
      </mesh>
      <mesh position={[0, 2.55, 1.5]}>
        <boxGeometry args={[6.9, 0.5, 0.14]} />
        <meshStandardMaterial color="#15161a" />
      </mesh>
      {/* glass */}
      <mesh position={[0, 1.4, 1.48]}>
        <planeGeometry args={[3.4, 2.4]} />
        <meshStandardMaterial color="#cfe6e4" transparent opacity={0.16} roughness={0.1} metalness={0.2} />
      </mesh>
      {/* reversed signage on the glass */}
      <mesh position={[0, 1.5, 1.46]}>
        <planeGeometry args={[3.3, 2.3]} />
        <meshStandardMaterial map={tex.window} transparent />
      </mesh>
      {/* round KALA sign hanging in the window */}
      <mesh position={[1.0, 1.85, 1.42]}>
        <circleGeometry args={[0.3, 32]} />
        <meshStandardMaterial map={tex.kala} transparent />
      </mesh>
      {/* HANALEI STRINGS sign on the storefront header */}
      <mesh position={[0, 2.52, 1.58]}>
        <planeGeometry args={[2.8, 0.6]} />
        <meshStandardMaterial map={tex.sign} />
      </mesh>
      {/* white counter + orchid near the window */}
      <group position={[-1.9, 0, 0.7]}>
        <mesh position={[0, 0.45, 0]}>
          <boxGeometry args={[1.0, 0.9, 0.6]} />
          <meshStandardMaterial color="#eceae2" roughness={0.6} />
        </mesh>
        <mesh position={[0.2, 1.0, 0]}>
          <cylinderGeometry args={[0.12, 0.1, 0.16, 12]} />
          <meshStandardMaterial color="#6e4a28" />
        </mesh>
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[0.2 + (i - 1) * 0.06, 1.2, 0]}>
            <sphereGeometry args={[0.05, 10, 10]} />
            <meshStandardMaterial color="#b14a8f" />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function Village({ tex }: { tex: any }) {
  return (
    <group>
      {/* neighbouring plantation shops flanking the entrance (off the fly-in axis) */}
      <Storefacade position={[-6.2, 0, 2.6]} w={4.2} color="#c9b27e" roof="#3a5a4a" rot={0.42} />
      <Storefacade position={[6.4, 0, 2.6]} w={4.2} color="#d8b94a" roof="#7a3030" rot={-0.42} />
      <Storefacade position={[-7.6, 0, 5.6]} w={4} color="#8a9a6a" roof="#7a3030" rot={0.5} />
      <Storefacade position={[7.8, 0, 5.6]} w={4} color="#caa15a" roof="#3a5a4a" rot={-0.5} />

      {/* the Ching Young Village entrance sign over the walkway */}
      <group position={[0, 0, 3.5]}>
        <mesh position={[-1.9, 1.8, 0]}>
          <boxGeometry args={[0.14, 3.6, 0.14]} />
          <meshStandardMaterial color="#2a2a2a" />
        </mesh>
        <mesh position={[1.9, 1.8, 0]}>
          <boxGeometry args={[0.14, 3.6, 0.14]} />
          <meshStandardMaterial color="#2a2a2a" />
        </mesh>
        <mesh position={[0, 3.6, 0]}>
          <boxGeometry args={[4.1, 0.16, 0.2]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        <mesh position={[0, 2.95, 0.02]}>
          <planeGeometry args={[3.5, 1.16]} />
          <meshStandardMaterial map={tex.ching} side={2} />
        </mesh>
      </group>

      {/* red ottoman seats + planter + palm beside the entrance */}
      {[[-2.3, 3.8], [2.3, 3.9]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.25, z]}>
          <cylinderGeometry args={[0.3, 0.3, 0.5, 18]} />
          <meshStandardMaterial color="#c4332b" roughness={0.6} />
        </mesh>
      ))}
      <group position={[3.1, 0, 4.0]}>
        <mesh position={[0, 1.0, 0]}>
          <cylinderGeometry args={[0.09, 0.14, 2, 6]} />
          <meshStandardMaterial color="#6b5836" />
        </mesh>
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh key={i} position={[0, 2, 0]} rotation={[0.5, (i / 5) * Math.PI * 2, 0]}>
            <coneGeometry args={[0.16, 1.3, 4]} />
            <meshStandardMaterial color="#3f6b3a" flatShading />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function Storefacade({
  position,
  w,
  color,
  roof,
  rot = 0,
}: {
  position: [number, number, number];
  w: number;
  color: string;
  roof: string;
  rot?: number;
}) {
  return (
    <group position={position} rotation={[0, rot, 0]}>
      <mesh position={[0, 1.6, 0]}>
        <boxGeometry args={[w, 3.2, 0.3]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
      {/* red metal roof */}
      <mesh position={[0, 3.4, 0.3]} rotation={[-0.5, 0, 0]}>
        <boxGeometry args={[w + 0.4, 0.12, 1.4]} />
        <meshStandardMaterial color={roof} metalness={0.3} roughness={0.6} />
      </mesh>
      {/* dark shopfront opening */}
      <mesh position={[0, 1.1, 0.16]}>
        <planeGeometry args={[w * 0.7, 1.8]} />
        <meshStandardMaterial color="#15201d" />
      </mesh>
    </group>
  );
}

/* The evening lawn side — the second door, lit with neon + fairy lights (IMG_6494). */
function BackStorefront({ tex, night }: { tex: any; night: boolean }) {
  const ei = night ? 2.4 : 0.25; // emissive intensity: glows at night, dim by day
  const warm = night ? 2.2 : 0.3;

  const twinkle = (cx: number, cy: number, n: number, spread: number) =>
    Array.from({ length: n }, (_, i) => {
      const s = (i * 53) % 97;
      return (
        <mesh key={i} position={[cx + ((s % 10) / 10 - 0.5) * spread, cy + (((s * 7) % 10) / 10 - 0.5) * 1.2, -4.18]}>
          <sphereGeometry args={[0.022, 6, 6]} />
          <meshStandardMaterial color="#fff2cf" emissive="#ffdf9e" emissiveIntensity={warm} />
        </mesh>
      );
    });

  return (
    <group>
      {/* lawn behind the shop */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, -8.5]}>
        <planeGeometry args={[22, 11]} />
        <meshStandardMaterial color={night ? "#1f2e1b" : "#41682f"} roughness={1} />
      </mesh>

      {/* dark wood facade over the back wall */}
      {[-2.05, 2.05].map((x) => (
        <mesh key={x} position={[x, 1.5, -4.09]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[2.8, 3]} />
          <meshStandardMaterial color="#2a1c12" roughness={0.8} />
        </mesh>
      ))}
      {/* eave / overhang */}
      <mesh position={[0, 2.96, -4.5]}>
        <boxGeometry args={[7.2, 0.18, 1.0]} />
        <meshStandardMaterial color="#1a120a" />
      </mesh>

      {/* carved HANALEI STRINGS wood sign above the door */}
      <mesh position={[0, 2.35, -4.12]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[2.3, 0.58]} />
        <meshStandardMaterial map={tex.wood} emissive="#3a2412" emissiveIntensity={night ? 0.6 : 0.15} />
      </mesh>

      {/* neon signs */}
      <Neon map={tex.neonLM} pos={[-2.35, 2.0, -4.12]} size={[1.7, 0.62]} ei={ei} />
      <Neon map={tex.neonUL} pos={[2.35, 2.0, -4.12]} size={[1.9, 0.62]} ei={ei} />
      <Neon map={tex.neonOpen} pos={[-2.7, 1.35, -4.13]} size={[0.7, 0.28]} ei={ei} />

      {/* windows w/ fairy lights + frames */}
      {[-2.0, 2.0].map((x) => (
        <group key={x}>
          <mesh position={[x, 1.35, -4.11]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[1.7, 1.5]} />
            <meshStandardMaterial color="#0c1414" />
          </mesh>
          {twinkle(x, 1.35, 22, 1.5)}
        </group>
      ))}

      {/* icicle fairy lights along the eave */}
      {Array.from({ length: 24 }, (_, i) => -3.4 + (i / 23) * 6.8).map((x, i) => (
        <mesh key={i} position={[x, 2.7 - (i % 3) * 0.08, -4.22]}>
          <sphereGeometry args={[0.03, 6, 6]} />
          <meshStandardMaterial color="#fff2cf" emissive="#ffdf9e" emissiveIntensity={warm} />
        </mesh>
      ))}
      {/* globe lights on the posts */}
      {[[-3.2, 1.9], [3.2, 1.9], [-3.2, 1.3], [3.2, 1.3]].map(([x, y], i) => (
        <mesh key={i} position={[x, y, -4.3]}>
          <sphereGeometry args={[0.06, 10, 10]} />
          <meshStandardMaterial color="#ffe7b0" emissive="#ffcf86" emissiveIntensity={warm} />
        </mesh>
      ))}

      {/* film-reel decoration on the right */}
      <mesh position={[3.0, 1.5, -4.12]} rotation={[0, Math.PI, 0]}>
        <torusGeometry args={[0.22, 0.05, 10, 24]} />
        <meshStandardMaterial color="#3a3a3a" metalness={0.4} roughness={0.6} />
      </mesh>

      {/* two benches flanking the door */}
      {[-1.55, 1.55].map((x) => (
        <group key={x} position={[x, 0, -4.7]}>
          <mesh position={[0, 0.42, 0]}>
            <boxGeometry args={[1.3, 0.1, 0.42]} />
            <meshStandardMaterial color="#5a3c20" roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.66, -0.18]}>
            <boxGeometry args={[1.3, 0.46, 0.06]} />
            <meshStandardMaterial color="#4a3018" roughness={0.7} />
          </mesh>
          {[-0.55, 0.55].map((lx) => (
            <mesh key={lx} position={[lx, 0.2, 0]}>
              <boxGeometry args={[0.08, 0.4, 0.4]} />
              <meshStandardMaterial color="#3a2614" />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

function Neon({
  map,
  pos,
  size,
  ei,
}: {
  map: any;
  pos: [number, number, number];
  size: [number, number];
  ei: number;
}) {
  return (
    <mesh position={pos} rotation={[0, Math.PI, 0]}>
      <planeGeometry args={size} />
      <meshStandardMaterial map={map} emissiveMap={map} emissive="#ffffff" emissiveIntensity={ei} transparent />
    </mesh>
  );
}
