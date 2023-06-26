import fn from "@/utils/placeholder";

describe("Placeholder test", () => {
  test("Test", () => {
    const result = fn();
    expect(result).toMatchInlineSnapshot(`5`);
  });
});
