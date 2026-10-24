import { describe, it, expect } from "vitest";
import { moduleId, purpose } from "./index";

describe("multi-platform-publish", () => {
  it("should export correct moduleId", () => {
    expect(moduleId).toBe("@starlight-cosmos/multi-platform-publish");
  });

  it("should export correct purpose", () => {
    expect(purpose).toBe("Declarative pipeline for multi-platform-publish.");
  });
});
