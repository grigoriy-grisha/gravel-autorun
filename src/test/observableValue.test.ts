import { observableValue } from "../Observable/observableValue";
import globalState from "../globalState";

//todo требуется рефакторинг тестов
describe("observableValue", () => {
  test("observableValue is defined", () => {
    expect(observableValue).toBeDefined();
  });

  test("value in observableValue should be changed", () => {
    globalState.removeExecutableCallback();
    const observedValue = observableValue(0);
    expect(observedValue.get()).toBe(0);
    observedValue.set(2);
    expect(observedValue.get()).toBe(2);
  });

  test("observer callback should be called", () => {
    globalState.removeExecutableCallback();
    const callback = jest.fn();
    const observedValue = observableValue(0);
    observedValue.observe(callback);
    observedValue.set(2);
    expect(callback).toBeCalled();
  });

  test("observer callback should be called twice", () => {
    globalState.removeExecutableCallback();
    const callback = jest.fn();
    const observedValue = observableValue(0);
    observedValue.observe(callback);
    observedValue.set(2);
    observedValue.set(2);
    expect(callback).toBeCalledTimes(2);
  });

  test("observer callback should not be called", () => {
    globalState.removeExecutableCallback();
    const callback = jest.fn();
    const observedValue = observableValue(0);
    observedValue.observe(callback);
    observedValue.unobserve(callback);
    observedValue.set(2);
    expect(callback).not.toBeCalled();
  });
});
