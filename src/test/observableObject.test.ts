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

  test("callback should be called", () => {
    const callback = jest.fn();
    const observerObject = observableObject({ user: "Andrew" });
    observerObject.observe(callback);
    observerObject.user = "Ann";
    expect(callback).toBeCalled();
  });
});
