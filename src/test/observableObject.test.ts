import { observableObject } from "../Observable/observableObject";

describe("observableObject", () => {
  test("observableObject is defined", () => {
    expect(observableObject).toBeDefined();
  });

  test("value in observableObject should be changed", () => {
    const observerObject = observableObject({ user: "Andrew" });
    observerObject.user = "Ann";
    expect(observerObject.user).toBe("Ann");
  });
});
