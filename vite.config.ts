import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// Los tests de fechas corren en la zona horaria de los usuarios (Bogotá, UTC-5).
// Se fija aquí para que los workers de Vitest la hereden.
process.env.TZ = "America/Bogota";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { port: 5173, strictPort: true },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
