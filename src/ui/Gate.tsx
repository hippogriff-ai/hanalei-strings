import { useState } from "react";
import { PASSCODE_HASH } from "../gate-config";

async function sha256hex(s: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function Gate({ onUnlock }: { onUnlock: () => void }) {
  const [val, setVal] = useState("");
  const [err, setErr] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const hash = await sha256hex(val.trim().toLowerCase());
    if (hash === PASSCODE_HASH) {
      try {
        // store the passcode hash (not a generic flag) so changing the passcode
        // re-locks everyone — including past visitors who used an old code.
        localStorage.setItem("hs_unlocked", PASSCODE_HASH);
      } catch {}
      onUnlock();
    } else {
      setErr(true);
      setVal("");
    }
  };

  return (
    <div className="gate">
      <div className="grain" />
      <div className="gate-card">
        <div className="gate-mark">
          Hanalei <em>Strings</em>
        </div>
        <p className="gate-sub">Private preview</p>
        <form onSubmit={submit} className="gate-form">
          <input
            className={"gate-input" + (err ? " err" : "")}
            value={val}
            onChange={(e) => {
              setVal(e.target.value);
              setErr(false);
            }}
            placeholder="Enter passcode"
            autoFocus
            aria-label="Passcode"
          />
          <button className="gate-btn" type="submit">
            Enter →
          </button>
        </form>
        {err && <p className="gate-err">That passcode isn't right — try again.</p>}
        <p className="gate-foot">Shared privately. Please don't redistribute the link.</p>
      </div>
    </div>
  );
}
