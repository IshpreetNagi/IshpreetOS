import { parseServerEnvironment } from "./schema";

describe("server environment", () => {
  it("provides a local origin in development and test", () => {
    for (const NODE_ENV of ["development", "test"]) {
      expect(parseServerEnvironment({ NODE_ENV }).NEXT_PUBLIC_SITE_URL).toBe("http://localhost:3000");
    }
  });

  it("requires an explicit origin in production", () => {
    expect(() => parseServerEnvironment({ NODE_ENV: "production" })).toThrow("NEXT_PUBLIC_SITE_URL");
  });

  it("accepts a configured HTTPS production origin", () => {
    expect(parseServerEnvironment({
      NODE_ENV: "production",
      NEXT_PUBLIC_SITE_URL: "https://example.com",
    }).NEXT_PUBLIC_SITE_URL).toBe("https://example.com");
  });

  it.each(["", "not-a-url", "file:///private", "ftp://example.com"])(
    "rejects an invalid site URL (%s)",
    (NEXT_PUBLIC_SITE_URL) => {
      expect(() => parseServerEnvironment({ NEXT_PUBLIC_SITE_URL })).toThrow("Invalid server environment");
    },
  );

  it("does not print input values in validation errors", () => {
    expect(() => parseServerEnvironment({
      NEXT_PUBLIC_SITE_URL: "private-value-that-must-not-be-logged",
    })).toThrow(/^Invalid server environment: NEXT_PUBLIC_SITE_URL\. Check \.env\.example\.$/);
  });
});
