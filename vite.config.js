import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

/* Due destinazioni, stesso codice:
   - GitHub Pages: sottocartella /enhypen-evan-voting-guide/, con Evan
   - dominio proprio: radice /, senza Evan  →  npm run build:solo

   I valori stanno in .env (predefinito) e .env.solo. */
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react()],
    base: env.VITE_BASE || "/enhypen-evan-voting-guide/",
  };
});
