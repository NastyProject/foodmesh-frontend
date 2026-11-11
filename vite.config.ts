import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { loadEnv } from "vite";
import { defineConfig } from "vitest/config";

// Los tests de fechas corren en la zona horaria de los usuarios (Bogotá, UTC-5).
// Se fija aquí para que los workers de Vitest la hereden.
process.env.TZ = "America/Bogota";

// Las VITE_* se fijan al compilar: si falta una, la app compila pero queda en blanco al abrirla.
// Mejor que el build falle con un mensaje claro (en Vercel: Settings → Environment Variables).
const VARIABLES_REQUERIDAS = ["VITE_AUTH0_DOMAIN", "VITE_AUTH0_CLIENT_ID", "VITE_AUTH0_AUDIENCE", "VITE_API_URL"];

function exigirVariables(mode: string) {
  const env = { ...loadEnv(mode, process.cwd(), "VITE_"), ...process.env };
  const faltan = VARIABLES_REQUERIDAS.filter((nombre) => !env[nombre]?.trim());
  if (faltan.length > 0) {
    throw new Error(`Faltan variables de entorno para el build: ${faltan.join(", ")}. Ver .env.example.`);
  }
}

export default defineConfig(({ command, mode }) => {
  if (command === "build") exigirVariables(mode);
  return {
    plugins: [react(), tailwindcss()],
    server: { port: 5173, strictPort: true },
    test: {
      environment: "node",
      include: ["src/**/*.test.ts"],
    },
  };
});
