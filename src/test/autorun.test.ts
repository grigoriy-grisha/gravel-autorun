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
      console.log(observerObject[key]);
      key = "age";
    });
    autorun(callback);

    observerObject.name = "user";
    observerObject.age = 1;

    expect(callback).toBeCalledTimes(3);
  });
});
