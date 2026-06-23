import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Vector3 } from "three";
import { useStore } from "../store";

// cinematic keyframes: high over the bay → inland up the plaza → through the
// door → rest on the hero koa. (pos, lookAt)
// bird's-eye over the bay → down onto the pier → walk the pier to the beach →
// under the Ching Young Village sign → through the store door → rest inside.
const KEYS: { p: [number, number, number]; t: [number, number, number] }[] = [
  { p: [0, 22, 54], t: [0, 2.5, 16] }, // bird's-eye over the ocean, pier + land ahead
  { p: [0.4, 9, 41], t: [0, 2.6, 26] }, // descending toward the pier's end pavilion
  { p: [0, 3.1, 31], t: [0, 2.1, 16] }, // on the pier deck by the pavilion
  { p: [0, 2.7, 19], t: [0, 1.9, 7] }, // walking the pier toward the beach
  { p: [0, 2.4, 9.5], t: [0, 2.4, 3.4] }, // stepping onto the beach, village ahead
  { p: [0, 2.4, 6.6], t: [0, 2.6, 2.8] }, // under the CHING YOUNG VILLAGE sign + storefront
  { p: [0, 1.85, 3.0], t: [0, 2.0, 1.3] }, // the HANALEI STRINGS storefront + window signage
  { p: [0, 1.55, 1.0], t: [-0.3, 1.35, -2.0] }, // stepping through the door
  { p: [0, 1.55, -0.1], t: [-0.4, 1.28, -2.3] }, // rest, facing the shop
];
const DURATION = 12; // seconds

// free-roam camera placements for the three viewing positions
const SEAT_POS = new Vector3(0, 1.55, 0.5); // inside
const KOA_TARGET = new Vector3(-0.4, 1.28, -2.1);
const FRONT_POS = new Vector3(0, 2.4, 7.4); // Ching Young Village (day) side
const FRONT_TARGET = new Vector3(0, 2.5, 2.8);
const BACK_POS = new Vector3(0, 2.4, -12.2); // evening lawn side, pulled back to frame the storefront
const BACK_TARGET = new Vector3(0, 1.7, -4.3);

const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

function sample(prog: number, outPos: Vector3, outTgt: Vector3, eased = true) {
  const c = Math.min(1, Math.max(0, prog));
  const e = eased ? ease(c) : c;
  const seg = e * (KEYS.length - 1);
  const i = Math.min(Math.floor(seg), KEYS.length - 2);
  const f = seg - i;
  const a = KEYS[i];
  const b = KEYS[i + 1];
  outPos.set(
    a.p[0] + (b.p[0] - a.p[0]) * f,
    a.p[1] + (b.p[1] - a.p[1]) * f,
    a.p[2] + (b.p[2] - a.p[2]) * f
  );
  outTgt.set(
    a.t[0] + (b.t[0] - a.t[0]) * f,
    a.t[1] + (b.t[1] - a.t[1]) * f,
    a.t[2] + (b.t[2] - a.t[2]) * f
  );
}

export function CameraRig() {
  const { camera } = useThree();
  const mode = useStore((s) => s.mode);
  const place = useStore((s) => s.place);
  const takeTheWheel = useStore((s) => s.takeTheWheel);

  const elapsed = useRef(0);
  const finished = useRef(false);
  const controls = useRef<any>(null);
  const _p = useRef(new Vector3());
  const _t = useRef(new Vector3());

  // init
  useEffect(() => {
    sample(0, _p.current, _t.current);
    camera.position.copy(_p.current);
    camera.lookAt(_t.current);
  }, [camera]);

  // when we enter free-roam (finished OR skipped), seat the camera at a room shot
  useEffect(() => {
    if (mode === "freeroam") {
      camera.position.copy(SEAT_POS);
      camera.lookAt(KOA_TARGET);
      if (controls.current) {
        controls.current.target.copy(KOA_TARGET);
        controls.current.update();
      }
    }
  }, [mode, camera]);

  // move between inside · village side · evening lawn side
  useEffect(() => {
    if (mode !== "freeroam" || !controls.current) return;
    const pos = place === "front" ? FRONT_POS : place === "back" ? BACK_POS : SEAT_POS;
    const tgt = place === "front" ? FRONT_TARGET : place === "back" ? BACK_TARGET : KOA_TARGET;
    camera.position.copy(pos);
    controls.current.target.copy(tgt);
    controls.current.update();
  }, [place, mode, camera]);

  useFrame((_, dt) => {
    // hidden scrubber: /#cam=0.0 … 1.0 forces a fixed point on the journey (linear)
    const m = (typeof window !== "undefined" ? window.location.hash : "").match(/cam=([0-9.]+)/);
    if (m) {
      sample(parseFloat(m[1]), _p.current, _t.current, false);
      camera.position.copy(_p.current);
      camera.lookAt(_t.current);
      return;
    }
    if (mode !== "cinematic" || finished.current) return;
    elapsed.current += Math.min(dt, 0.04); // clamp: no frame-hitch jumps on low-end devices
    const prog = elapsed.current / DURATION;
    sample(prog, _p.current, _t.current);
    camera.position.copy(_p.current);
    camera.lookAt(_t.current);
    if (prog >= 1) {
      finished.current = true;
      takeTheWheel();
    }
  });

  if (mode !== "freeroam") return null;
  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enablePan={false}
      enableDamping
      dampingFactor={0.08}
      minDistance={0.6}
      maxDistance={8}
      maxPolarAngle={Math.PI / 2 + 0.08}
      target={[-0.4, 1.28, -2.1]}
    />
  );
}
