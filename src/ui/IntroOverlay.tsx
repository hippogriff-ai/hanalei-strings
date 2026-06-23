import { useEffect, useState } from "react";
import { BRAND } from "../catalog";
import { useStore } from "../store";

export function IntroOverlay() {
  const mode = useStore((s) => s.mode);
  const view = useStore((s) => s.view);
  const place = useStore((s) => s.place);
  const takeTheWheel = useStore((s) => s.takeTheWheel);
  const tourActive = useStore((s) => s.tourActive);
  const [reticle, setReticle] = useState(false);

  // bloom the reticle the moment the film hands over control
  useEffect(() => {
    if (mode === "freeroam") {
      setReticle(true);
      const id = setTimeout(() => setReticle(false), 2000);
      return () => clearTimeout(id);
    }
  }, [mode]);

  if (view !== "world") return null;

  return (
    <>
      <div className="standin">
        <span className="d" /> Stand-in scene — the real Hanalei capture drops in here
      </div>

      {mode === "cinematic" && (
        <>
          <div className="intro">
            <div className="kicker fade-up">A tour you can buy from</div>
            <h1 className="fade-up d1">
              Made here,
              <br />
              in <em>Hanalei</em>.
            </h1>
            <p className="fade-up d2">{BRAND.context}</p>
          </div>
          {!tourActive && (
            <button className="btn btn-koa btn-sm take-wheel fade-up d3" onClick={takeTheWheel}>
              Take the wheel ↦
            </button>
          )}
        </>
      )}

      {reticle && (
        <div className="handoff">
          <div className="reticle" />
          <div className="label">Your turn — look around</div>
        </div>
      )}

      {mode === "freeroam" && place === "front" && (
        <div className="outside-note">
          Ching Young Village — the shop's daytime front door, off Kūhiō Highway.
        </div>
      )}
      {mode === "freeroam" && place === "back" && (
        <div className="outside-note">
          The other side — step out to the evening lawn, lit up for live music & ukulele lessons.
        </div>
      )}
    </>
  );
}
