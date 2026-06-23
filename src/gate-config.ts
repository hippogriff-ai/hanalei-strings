// "Private-ish" access gate for the shared demo.
//
// We store only a SHA-256 HASH of the passcode — the plaintext is never committed,
// so it isn't exposed in the public repo (or trivially in the bundle). This is not
// bank-grade (a determined person could brute-force a weak passcode), but combined
// with the unlisted URL + noindex it keeps uninvited people out.
//
// Current passcode:  hanalei-strings-preview
// To change it:      printf '%s' "your-new-code" | shasum -a 256
//                    then paste the hash below (use an all-lowercase passcode).

export const GATE_ENABLED = true;
export const PASSCODE_HASH = "02b4b16f0e78ddbef3529697e78c2279b27e898a777af80ea84c1599bc2a8be6";
