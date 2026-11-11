import { describe, expect, it } from "vitest";
import { cantidadAInput, parseCantidad, pasoCantidad, redondear, textoCantidad } from "./cantidad";

describe("textoCantidad", () => {
  it("usa coma decimal y abrevia unidad y paquete", () => {
    expect(textoCantidad(0.8, "kg")).toBe("0,8 kg");
    expect(textoCantidad(1, "unidad")).toBe("1 und");
    expect(textoCantidad(2, "paquete")).toBe("2 paq");
    expect(textoCantidad(200, "g")).toBe("200 g");
  });

  it("deja tal cual las unidades que no conoce", () => {
    expect(textoCantidad(2, "taza")).toBe("2 taza");
  });

  it("no duplica espacios si la unidad trae espacios de más", () => {
    expect(textoCantidad(1, " unidad ")).toBe("1 und");
    expect(textoCantidad(2, "kg ")).toBe("2 kg");
  });
});

describe("parseCantidad", () => {
  it("acepta coma y punto", () => {
    expect(parseCantidad("0,8")).toBe(0.8);
    expect(parseCantidad("1.5")).toBe(1.5);
    expect(parseCantidad(" 3 ")).toBe(3);
  });

  it("rechaza lo que no es número", () => {
    expect(parseCantidad("")).toBeNull();
    expect(parseCantidad("abc")).toBeNull();
    expect(parseCantidad("1,2,3")).toBeNull();
    expect(parseCantidad("-1")).toBeNull();
  });
});

describe("stepper", () => {
  it("paso de 100 en g y ml, 1 en el resto", () => {
    expect(pasoCantidad("g")).toBe(100);
    expect(pasoCantidad("ml")).toBe(100);
    expect(pasoCantidad("kg")).toBe(1);
    expect(pasoCantidad("unidad")).toBe(1);
  });

  it("redondea y vuelve a texto con coma", () => {
    expect(redondear(0.1 + 0.2)).toBe(0.3);
    expect(cantidadAInput(1.8)).toBe("1,8");
  });
});
