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

  test("value in nested observableObject should be changed", () => {
    const observerObject = observableObject({
      user: {
        name: "Andrew",
      },
    });
    observerObject.user.name = "Ann";
    expect(observerObject.user.name).toBe("Ann");
  });
});
