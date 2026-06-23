import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./", // portable: works on any static host or subpath
  server: { port: 5173, host: true },
});
