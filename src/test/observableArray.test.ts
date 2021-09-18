import { observableArray } from "../Observable/observableArray";

//todo проверять еще  и внутреннее значение объектов
describe("observableArray", () => {
  test("observableArray is defined", () => {
    expect(observableArray).toBeDefined();
  });

  test("observableArray should get value", () => {
    const array = [1, 2, 3, 4];
    const observerArray = observableArray(array);

    expect(observerArray[0]).toBe(1);
  });

  test("observableArray should set value", () => {
    const array = [1, 2, 3, 4];
    const observerArray = observableArray(array);
    observerArray[2] = 999;

    expect(observerArray[2]).toBe(999);
  });
});
