import { interceptPrimitiveValue } from "../interceptors/interceptPrimitiveValue";

describe("interceptPrimitiveValue", () => {
  test("reaction is defined", () => {
    expect(interceptPrimitiveValue).toBeDefined();
  });
});
