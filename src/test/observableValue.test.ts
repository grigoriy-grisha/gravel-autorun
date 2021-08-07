import { observableValue } from "../Observable/observableValue";

describe("observableValue", () => {
  test("observableValue is defined", () => {
    expect(observableValue).toBeDefined();
  });

  test("value in observableValue should be changed", () => {
    const value = 0;
    const observedValue = observableValue(value);
    expect(observedValue.get()).toBe(0);
    observedValue.set(2);
    expect(observedValue.get()).toBe(2);
  });
});
