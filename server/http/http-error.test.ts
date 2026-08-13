import { describe, expect, it } from "vitest";
import { HttpError } from "./http-error.js";

describe("HttpError", () => {
  it("хранит статус", () => {
    const err = new HttpError(404, "Неизвестный вид");
    expect(err.status).toBe(404);
    expect(err.message).toBe("Неизвестный вид");
    expect(err).toBeInstanceOf(Error);
  });
});
