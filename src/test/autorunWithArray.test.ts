import { autorun } from "../autorun";
import { observableArray } from "../Observable/observableArray";

describe("autorunWithArray", () => {
  test("change array value in range", () => {
    const observerArray = observableArray([1, 2, 3, 4]);
    const callback = jest.fn(() => observerArray[0]);

    autorun(callback);

    observerArray[0] = 42;
    expect(callback).toBeCalledTimes(2);
  });

  test("push to array", () => {
    const observerArray = observableArray([1, 2, 3, 4]);
    const callback = jest.fn(() => observerArray[0]);

    autorun(callback);

    observerArray.push(42, 12, 41);
    expect(callback).toBeCalledTimes(2);
  });

  test("change length", () => {
    const observerArray = observableArray([1, 2, 3, 4]);
    const callback = jest.fn(() => observerArray[0]);

    autorun(callback);
    observerArray.length = 1;

    expect(callback).toBeCalledTimes(2);
  });

  test("array splice method", () => {
    const array = [1, 2, 3, 4];
    const observerArray = observableArray(array);

    const callback = jest.fn(() => observerArray[0]);
    autorun(callback);

    //@ts-ignore
    observerArray.splice();
    observerArray.splice(1, 1);
    observerArray.splice(1, 1, 228);
    observerArray.splice(0);

    expect(callback).toBeCalledTimes(4);
  });

  test("array shift method", () => {
    const array = [1, 2, 3, 4];
    const observerArray = observableArray(array);

    const callback = jest.fn(() => observerArray[0]);
    autorun(callback);

    observerArray.shift();
    expect(callback).toBeCalledTimes(2);
  });

  test("array unshift method", () => {
    const array = [1, 2, 3, 4];
    const observerArray = observableArray(array);

    const callback = jest.fn(() => observerArray[0]);
    autorun(callback);

    observerArray.unshift(0);
    expect(callback).toBeCalledTimes(2);
  });

  test("array pop method", () => {
    const array = [1, 2, 3, 4];
    const observerArray = observableArray(array);

    const callback = jest.fn(() => observerArray[0]);
    autorun(callback);

    observerArray.pop();
    expect(callback).toBeCalledTimes(2);
  });
});
