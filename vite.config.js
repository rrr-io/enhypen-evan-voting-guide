import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// IMPORTANTE: base deve essere "/nome-della-repository/".
// Se un giorno rinomini la repo, cambia anche questa riga.
export default defineConfig({
  plugins: [react()],
  base: "/enhypen-evan-voting-guide/",
});
