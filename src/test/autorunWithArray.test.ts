import { autorun } from "../autorun";
import { observableArray } from "../Observable/observableArray";

describe("autorunWithArray", () => {
  test("aboba", () => {
    const observerObject = observableArray([1, 2, 3, 4]);
    const callback = jest.fn(() => observerObject.forEach((aboba) => aboba));
    autorun(callback);
    observerObject.push(2);

    expect(callback).toBeCalledTimes(2);
  });
});
