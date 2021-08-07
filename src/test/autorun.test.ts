import { autorun } from "../autorun";
import { observableValue } from "../Observable/observableValue";

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
});
