import { describe, expect, it } from "vitest";
import { ApiError } from "./client";
import { shouldRetry } from "./reintentos";

describe("shouldRetry", () => {
  it.each([400, 401, 403, 404, 409, 413, 415, 422])("nunca reintenta un %i", (status) => {
    expect(shouldRetry(0, new ApiError(status, "x"))).toBe(false);
  });

  it.each([0, 500, 502, 503])("reintenta %i hasta 2 veces", (status) => {
    const error = new ApiError(status, "x");
    expect(shouldRetry(0, error)).toBe(true);
    expect(shouldRetry(1, error)).toBe(true);
    expect(shouldRetry(2, error)).toBe(false);
  });

  it("no reintenta errores que no son del API", () => {
    expect(shouldRetry(0, new Error("bug"))).toBe(false);
  });
});
