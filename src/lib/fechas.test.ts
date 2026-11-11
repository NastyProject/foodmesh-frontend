import { describe, expect, it } from "vitest";
import { diasParaVencer, esUsaloPrimero, estadoVencimiento, formatFechaCorta, parseFechaLocal, textoDiasParaVencer } from "./fechas";

// vite.config.ts fija TZ=America/Bogota (UTC-5, sin horario de verano).
// "Hoy" en los tests: 8 nov 2026, 10:00 hora local.
const HOY = new Date(2026, 10, 8, 10, 0);

describe("zona horaria", () => {
  it("los tests corren en Bogotá", () => {
    expect(Intl.DateTimeFormat().resolvedOptions().timeZone).toBe("America/Bogota");
  });

  it("parseFechaLocal conserva el día (new Date(str) no)", () => {
    const fecha = parseFechaLocal("2026-11-15");
    expect(fecha.getFullYear()).toBe(2026);
    expect(fecha.getMonth()).toBe(10);
    expect(fecha.getDate()).toBe(15);
    // El bug que evitamos: "YYYY-MM-DD" se toma como medianoche UTC = 14 nov, 19:00 en Bogotá.
    expect(new Date("2026-11-15").getDate()).toBe(14);
  });

  it("a las 23:30 en Bogotá (ya 9 nov en UTC) hoy sigue siendo 8 nov", () => {
    const nocheBogota = new Date(2026, 10, 8, 23, 30);
    expect(nocheBogota.toISOString().startsWith("2026-11-09")).toBe(true);
    expect(estadoVencimiento("2026-11-08", nocheBogota)).toEqual({ tipo: "hoy", dias: 0, etiqueta: "HOY" });
    expect(estadoVencimiento("2026-11-09", nocheBogota)).toMatchObject({ tipo: "pronto", etiqueta: "1 DÍA" });
  });

  it("a las 00:05 cuenta el día nuevo", () => {
    const madrugada = new Date(2026, 10, 9, 0, 5);
    expect(diasParaVencer("2026-11-08", madrugada)).toBe(-1);
  });

  it("rechaza formatos que no son YYYY-MM-DD", () => {
    expect(() => parseFechaLocal("15/11/2026")).toThrow();
    expect(() => parseFechaLocal("2026-11-15T00:00:00Z")).toThrow();
  });
});

describe("estadoVencimiento", () => {
  it.each([
    ["2026-11-01", { tipo: "vencido", dias: -7, etiqueta: "VENCIDO" }],
    ["2026-11-07", { tipo: "vencido", dias: -1, etiqueta: "VENCIDO" }],
    ["2026-11-08", { tipo: "hoy", dias: 0, etiqueta: "HOY" }],
    ["2026-11-09", { tipo: "pronto", dias: 1, etiqueta: "1 DÍA" }],
    ["2026-11-10", { tipo: "pronto", dias: 2, etiqueta: "2 DÍAS" }],
    ["2026-11-11", { tipo: "pronto", dias: 3, etiqueta: "3 DÍAS" }],
    ["2026-11-12", { tipo: "lejos", dias: 4, etiqueta: "4 días" }],
    ["2026-11-17", { tipo: "lejos", dias: 9, etiqueta: "9 días" }],
    ["2027-01-06", { tipo: "lejos", dias: 59, etiqueta: "59 días" }],
    ["2027-01-07", { tipo: "lejos", dias: 60, etiqueta: "2 meses" }],
    ["2027-08-05", { tipo: "lejos", dias: 270, etiqueta: "9 meses" }],
    ["2027-11-08", { tipo: "lejos", dias: 365, etiqueta: "1 año" }],
    ["2029-11-08", { tipo: "lejos", dias: 1096, etiqueta: "3 años" }],
  ] as const)("%s → %o", (fecha, esperado) => {
    expect(estadoVencimiento(fecha, HOY)).toEqual(esperado);
  });

  it("sin fecha", () => {
    expect(estadoVencimiento(null, HOY)).toEqual({ tipo: "sin_fecha" });
  });

  it("cruza fin de mes y de año", () => {
    const finDeAno = new Date(2026, 11, 31, 18, 0);
    expect(diasParaVencer("2027-01-01", finDeAno)).toBe(1);
    expect(diasParaVencer("2027-03-01", new Date(2027, 1, 28))).toBe(1);
  });
});

describe("esUsaloPrimero", () => {
  it.each([
    ["2026-11-06", true],
    ["2026-11-08", true],
    ["2026-11-11", true],
    ["2026-11-12", false],
  ] as const)("%s → %s", (fecha, esperado) => {
    expect(esUsaloPrimero(fecha, HOY)).toBe(esperado);
  });

  it("sin fecha no es urgente", () => {
    expect(esUsaloPrimero(null, HOY)).toBe(false);
  });
});

describe("formatFechaCorta", () => {
  it("día/mes/año local, con ceros", () => {
    expect(formatFechaCorta("2026-11-01")).toBe("01/11/2026");
    expect(formatFechaCorta("2027-01-31")).toBe("31/01/2027");
  });
});

describe("textoDiasParaVencer", () => {
  it("0 es hoy", () => expect(textoDiasParaVencer(0)).toBe("hoy"));
  it("1 en singular", () => expect(textoDiasParaVencer(1)).toBe("1 día"));
  it("N en plural", () => expect(textoDiasParaVencer(3)).toBe("3 días"));
  it("negativo es vencido", () => expect(textoDiasParaVencer(-2)).toBe("vencido"));
});
