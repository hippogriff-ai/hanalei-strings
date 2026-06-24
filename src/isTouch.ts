// Coarse-pointer / touch device detection (phones, tablets).
// Used to tune the experience for mobile: on-screen controls, lower pixel ratio,
// and Spark level-of-detail to keep the GPU (and battery/heat) in check.
export const IS_TOUCH =
  typeof window !== "undefined" &&
  ((window.matchMedia && window.matchMedia("(pointer: coarse)").matches) || "ontouchstart" in window);
