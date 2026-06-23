import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Euler, Vector3 } from "three";
import { useStore } from "../store";

const MOVE_CODES = new Set([
  "KeyW", "KeyA", "KeyS", "KeyD", "KeyQ", "KeyE", "KeyR", "KeyF",
  "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight",
  "Space", "ShiftLeft", "PageUp", "PageDown",
]);

/**
 * First-person navigation, like Marble / Spark viewers:
 *  · drag (left button) to look around
 *  · arrows / W A S D to move forward·back·left·right
 *  · E / R / Space / PageUp = up ·  Q / F / Shift / PageDown = down
 *  · scroll moves along your view ray
 * No pointer-lock, so the DOM hotspots stay clickable.
 */
export function FlyNav() {
  const camera = useThree((s) => s.camera);
  const gl = useThree((s) => s.gl);
  const span = useStore((s) => s.splatSpan) || 4;

  const keys = useRef<Record<string, boolean>>({});
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });
  const euler = useRef(new Euler(0, 0, 0, "YXZ"));

  useEffect(() => {
    (window as any).__cam = camera; // debug/verify hook
    const dom = gl.domElement as HTMLElement;
    dom.style.cursor = "grab";

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      dragging.current = true;
      last.current = { x: e.clientX, y: e.clientY };
      euler.current.setFromQuaternion(camera.quaternion);
      dom.style.cursor = "grabbing";
    };
    const onUp = () => {
      dragging.current = false;
      dom.style.cursor = "grab";
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging.current) return;
      const dx = e.clientX - last.current.x;
      const dy = e.clientY - last.current.y;
      last.current = { x: e.clientX, y: e.clientY };
      const eu = euler.current;
      eu.y -= dx * 0.0026;
      eu.x -= dy * 0.0026;
      eu.x = Math.max(-Math.PI / 2 + 0.05, Math.min(Math.PI / 2 - 0.05, eu.x));
      camera.quaternion.setFromEuler(eu);
    };
    const onWheel = (e: WheelEvent) => {
      const dir = new Vector3();
      camera.getWorldDirection(dir);
      camera.position.addScaledVector(dir, -Math.sign(e.deltaY) * span * 0.06);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (MOVE_CODES.has(e.code)) {
        keys.current[e.code] = true;
        e.preventDefault();
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      keys.current[e.code] = false;
    };

    dom.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointermove", onMove);
    dom.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      dom.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointermove", onMove);
      dom.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      keys.current = {};
    };
  }, [camera, gl, span]);

  useFrame((_, dt) => {
    const k = keys.current;
    const speed = Math.min(span, 12) * 0.8;
    const v = speed * Math.min(dt, 0.05);

    // horizontal forward (where you're looking, flattened) + strafe
    const fwd = new Vector3();
    camera.getWorldDirection(fwd);
    fwd.y = 0;
    if (fwd.lengthSq() < 1e-6) fwd.set(0, 0, -1);
    fwd.normalize();
    const right = new Vector3().crossVectors(fwd, new Vector3(0, 1, 0)).normalize();

    const move = new Vector3();
    // keyboard (digital)
    if (k["KeyW"] || k["ArrowUp"]) move.add(fwd);
    if (k["KeyS"] || k["ArrowDown"]) move.addScaledVector(fwd, -1);
    if (k["KeyD"] || k["ArrowRight"]) move.add(right);
    if (k["KeyA"] || k["ArrowLeft"]) move.addScaledVector(right, -1);
    if (k["KeyE"] || k["KeyR"] || k["Space"] || k["PageUp"]) move.y += 1;
    if (k["KeyF"] || k["KeyQ"] || k["ShiftLeft"] || k["PageDown"]) move.y -= 1;
    // touch joystick + up/down buttons (analog)
    const tn = useStore.getState().touchNav;
    move.addScaledVector(fwd, -tn.y);
    move.addScaledVector(right, tn.x);
    move.y += tn.vert;

    if (move.lengthSq() > 0) {
      if (move.lengthSq() > 1) move.normalize(); // cap speed, keep analog below 1
      camera.position.addScaledVector(move, v);
    }
  });

  return null;
}
