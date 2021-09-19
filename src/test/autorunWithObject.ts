import { observableObject } from "../Observable/observableObject";
import { autorun } from "../autorun";

describe("autorunWithObject", () => {
  test("autorun with observableObject", () => {
    const observerObject = observableObject({ user: "Andrew" });
    const callback = jest.fn(() => observerObject.user);
    autorun(callback);
    observerObject.user = "Ann";
    expect(callback).toBeCalledTimes(2);
  });

  test("autorun with nested observableObject", () => {
    const observerObject = observableObject({
      user: {
        name: "Andrew",
        address: {
          street: "Pushkin's",
        },
      },
    });

    const callback = jest.fn(() => observerObject.user.address.street);
    autorun(callback);
    observerObject.user.address.street = "Sadovya";
    expect(callback).toBeCalledTimes(2);
  });

  test("everyone value in observable object should be isolated", () => {
    const observerObject = observableObject({
      user: {
        name: "Andrew",
        address: {
          street: "Pushkin's",
        },
      },
    });

    const callback = jest.fn(() => observerObject.user.name);
    autorun(callback);
    const callback2 = jest.fn(() => observerObject.user.address.street);
    autorun(callback2);
    observerObject.user.address.street = "Sadovya";
    expect(callback).toBeCalledTimes(1);
    expect(callback2).toBeCalledTimes(2);
  });

  test("changed object should be reactive", () => {
    const observerObject = observableObject({
      user: {
        name: "Andrew",
        address: {
          street: "Pushkin's",
        },
      },
    });

    const callback = jest.fn(() => observerObject.user.address);
    autorun(callback);

    // @ts-ignore
    observerObject.user.address = "changed";
    expect(callback).toBeCalledTimes(2);
  });

  test("dynamic values should be call autorun function", () => {
    let key = "name";
    const observerObject = observableObject<any>({});
    const callback = jest.fn(() => {
      observerObject[key];
      key = "age";
    });
    autorun(callback);

    observerObject.name = "user";
    observerObject.age = 1;

    expect(callback).toBeCalledTimes(3);
  });

  test("for in iteration over on object", () => {
    const observerObject = observableObject<any>({ name: "Ann", age: 1, street: "pushkin" });
    const callback = jest.fn(() => {
      for (const item in observerObject) {
        observerObject[item];
      }
    });

    autorun(callback);

    observerObject.name = "Andrew";

    expect(callback).toBeCalledTimes(2);
  });

  test("for in iteration set values", () => {
    const observerObject = observableObject<any>({ name: "Ann", age: 1, street: "pushkin" });
    const callback = jest.fn(() => {
      for (const item in observerObject) {
        observerObject[item];
      }
    });

    autorun(callback);

    for (const item in observerObject) {
      observerObject[item] = "NEW";
    }

    expect(callback).toBeCalledTimes(4);
  });

  test("defineProperty value has been reactie", () => {
    const observerObject = observableObject<any>({});
    Object.defineProperty(observerObject, "name", {
      value: "Ann",
      writable: true,
      configurable: true,
      enumerable: true,
    });

    const callback = jest.fn(() => observerObject.name);
    autorun(callback);

    observerObject.name = 2;
    expect(callback).toBeCalledTimes(2);
  });

  test("functions should be usually observable value ", () => {
    const observerObject = observableObject<any>({
      fn() {},
    });

    const callback = jest.fn(() => observerObject.fn);
    autorun(callback);

    expect(typeof observerObject.fn).toBe("function");
    observerObject.fn = "Ann";
    expect(callback).toBeCalledTimes(2);
    expect(typeof observerObject.fn).toBe("string");
  });
});
