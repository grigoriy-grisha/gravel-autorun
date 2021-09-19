import { observableValue } from "../Observable/observableValue";
import { autorun } from "../autorun";

describe("autorunWithPrimitiveValues", () => {
  test("callback should be called", () => {
    const observerValue = observableValue(0);
    const callback = jest.fn(() => observerValue.get());
    autorun(callback);
    observerValue.set(2);
    expect(callback).toBeCalledTimes(2);
  });
});
