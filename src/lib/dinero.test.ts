import { describe, expect, it } from "vitest";
import { formatPesos } from "./dinero";

describe("formatPesos", () => {
  it("formatea en es-CO sin decimales ni espacio", () => {
    expect(formatPesos(130690)).toBe("$130.690");
    expect(formatPesos(6500)).toBe("$6.500");
    expect(formatPesos(0)).toBe("$0");
    expect(formatPesos(999.6)).toBe("$1.000");
  });
});
