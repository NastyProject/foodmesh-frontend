import { describe, expect, it } from "vitest";
import { leerError } from "../../api/client";
import { falloDeError } from "./fallo";

describe("falloDeError", () => {
  it.each(["imagen_borrosa", "imagen_ilegible", "imagen_pequena"])("422 %s: mensaje y consejo del backend", (codigo) => {
    const error = leerError(422, { detail: { codigo, mensaje: "La foto está borrosa.", consejo: "Acércate más." } });
    expect(falloDeError(error)).toEqual({
      titulo: "La foto está borrosa.",
      mensaje: "Acércate más.",
      accion: "Tomar otra foto",
    });
  });

  it("422 de validación normal no es foto ilegible", () => {
    const error = leerError(422, { detail: [{ loc: ["body"], msg: "Campo requerido", type: "missing" }] });
    expect(falloDeError(error)).toMatchObject({ mensaje: "Campo requerido", accion: "Elegir otra foto" });
  });

  it("413 pide una foto más liviana", () => {
    expect(falloDeError(leerError(413, null)).mensaje).toMatch(/10 MB/);
  });
});
