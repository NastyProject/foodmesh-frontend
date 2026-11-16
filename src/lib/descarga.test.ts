import { describe, expect, it } from "vitest";
import { nombreArchivoExportacion } from "./descarga";

describe("nombreArchivoExportacion", () => {
  it("usa la fecha local", () => {
    expect(nombreArchivoExportacion(new Date(2026, 10, 16, 23, 50))).toBe("foodmesh-mis-datos-2026-11-16.json");
  });
});
