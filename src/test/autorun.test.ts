import { autorun } from "../autorun";
import { observableValue } from "../Observable/observableValue";
import { observableObject } from "../Observable/observableObject";

describe("autorun", () => {
  test("autorun is defined", () => {
    expect(autorun).toBeDefined();
  });

  test("callback should be called", () => {
    const observerValue = observableValue(0);
    const callback = jest.fn(() => observerValue.get());
    autorun(callback);
    observerValue.set(2);
    expect(callback).toBeCalledTimes(2);
  });

  test("autorun with observableObject", () => {
    const observerObject = observableObject({ user: "Andrew" });
    const callback = jest.fn(() => observerObject.user);
    autorun(callback);
    observerObject.user = "Ann";
    expect(callback).toBeCalledTimes(2);
  });
});
