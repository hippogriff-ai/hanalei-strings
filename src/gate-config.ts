// "Private-ish" access gate for the shared demo.
// NOTE: this is a client-side gate — good for keeping uninvited people out of a
// shared link, but not cryptographically secure (the code ships in the bundle).
// Pair it with the random host URL + noindex for a sensible "private-ish" demo.

export const GATE_ENABLED = true;
export const PASSCODE = "hanalei"; // ← change this to whatever you want to give people
