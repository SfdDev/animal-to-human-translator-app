import { describe, expect, it } from "vitest";
import {
  behaviorOptionsForSound,
  contextOptionsForSound,
  isBehaviorFieldDisabled,
  isContextFieldDisabled,
  pruneSelectionBySound,
  soundFieldHint,
} from "./form-options-by-sound";
import type { FormOptions } from "../types/translator";

const dogForm: FormOptions = {
  species: {
    id: "dog",
    name: "Собака",
    latin: "",
    logic: "graded_context",
    logic_label: "",
    logic_note: "",
  },
  sounds: [
    { id: "bark", label: "Лай" },
    { id: "whine", label: "Скуление" },
  ],
  contexts: [
    { id: "disturbance", label: "Тревога" },
    { id: "isolation", label: "Одиночество" },
    { id: "play", label: "Игра" },
  ],
  behaviors: [{ id: "play_bow", label: "Игровой поклон" }],
  bySound: {
    bark: {
      contexts: ["disturbance", "isolation", "play"],
      behaviors: ["play_bow"],
    },
    whine: { contexts: ["isolation"], behaviors: [] },
  },
};

describe("form-options-by-sound", () => {
  it("без звука контексты и поведение скрыты", () => {
    expect(contextOptionsForSound(dogForm, "")).toEqual([]);
    expect(behaviorOptionsForSound(dogForm, "")).toEqual([]);
    expect(soundFieldHint(dogForm, "")).toMatch(/Сначала выберите звук/);
  });

  it("собака: лай фильтрует контексты", () => {
    expect(contextOptionsForSound(dogForm, "bark").map((r) => r.id)).toEqual([
      "disturbance",
      "isolation",
      "play",
    ]);
    expect(behaviorOptionsForSound(dogForm, "bark").map((r) => r.id)).toEqual(["play_bow"]);
  });

  it("собака: скуление — только одиночество", () => {
    expect(contextOptionsForSound(dogForm, "whine").map((r) => r.id)).toEqual(["isolation"]);
    expect(isBehaviorFieldDisabled(dogForm, "whine")).toBe(true);
  });

  it("блокирует поля без правил", () => {
    expect(isContextFieldDisabled(dogForm, "")).toBe(true);
    expect(isBehaviorFieldDisabled(dogForm, "")).toBe(true);
    expect(isContextFieldDisabled(dogForm, "bark")).toBe(false);
    expect(isBehaviorFieldDisabled(dogForm, "bark")).toBe(false);
    expect(isContextFieldDisabled(dogForm, "whine")).toBe(false);
    expect(isBehaviorFieldDisabled(dogForm, "whine")).toBe(true);
  });

  it("сбрасывает несовместимый контекст при смене звука", () => {
    const selection = { soundId: "bark", contextId: "play", behaviorId: "" };
    pruneSelectionBySound(dogForm, selection);
    expect(selection.contextId).toBe("play");
    selection.soundId = "whine";
    pruneSelectionBySound(dogForm, selection);
    expect(selection.contextId).toBe("");
  });
});
