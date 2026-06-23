import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import { useStore } from "../store";

/** Drops the selected product's hotspot at screen-center, a bit in front of the camera. */
export function Placer() {
  const camera = useThree((s) => s.camera);
  const placeNonce = useStore((s) => s.placeNonce);
  const selectedEdit = useStore((s) => s.selectedEdit);
  const setHotspotPos = useStore((s) => s.setHotspotPos);
  const span = useStore((s) => s.splatSpan) || 4;
  const prev = useRef(placeNonce);

  useFrame(() => {
    if (placeNonce === prev.current) return;
    prev.current = placeNonce;
    if (!selectedEdit) return;
    const dir = new Vector3();
    camera.getWorldDirection(dir);
    const p = camera.position.clone().add(dir.multiplyScalar(span * 0.3));
    setHotspotPos(selectedEdit, [p.x, p.y, p.z]);
  });

  return null;
}
