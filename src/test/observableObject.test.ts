import { observableObject } from "../Observable/observableObject";

describe("observableObject", () => {
  test("observableObject is defined", () => {
    expect(observableObject).toBeDefined();
  });

  test("value in observableObject should be changed", () => {
    const observerObject = observableObject({ user: "Andrew" });
    observerObject.user = "Ann";
    expect(observerObject.user).toBe("Ann");
  });

  test("value in nested observableObject should be changed", () => {
    const observerObject = observableObject({
      user: {
        name: "Andrew",
      },
    });
    observerObject.user.name = "Ann";
    expect(observerObject.user.name).toBe("Ann");
  });

  test("value should be changed in very nested observableObject", () => {
    const observerObject = observableObject({
      model: {
        office: {
          dealer: {
            location: {
              street: "Pushkin",
            },
          },
        },
      },
    });

    observerObject.model.office.dealer.location.street = "Sadovaya";
    expect(observerObject.model.office.dealer.location.street).toBe("Sadovaya");
  });

  test("objects in ObservableObject should be changed", () => {
    const observerObject = observableObject<any>({
      user: {
        name: "Andrew",
        address: {
          street: "Pushkin's",
        },
      },
    });

    observerObject.user.address = "changed";
    expect(observerObject.user.address).toBe("changed");
  });

  test("delete value has been success", () => {
    const observerObject = observableObject<any>({
      user: {
        name: "Andrew",
        address: {
          street: "Pushkin's",
        },
      },
    });

    delete observerObject.user;
    expect(observerObject.user).toBe(undefined);
    delete observerObject.user;
    expect(observerObject).toStrictEqual({});
  });

  test("set new value", () => {
    const observerObject = observableObject<any>({});
    observerObject.user = { name: "Ann" };
    expect(observerObject.user).toStrictEqual({ name: "Ann" });
    observerObject.user.name = "Andrew";
    expect(observerObject.user.name).toBe("Andrew");
  });

  test("defineProperty", () => {
    const observerObject = observableObject<any>({});
    Object.defineProperty(observerObject, "name", {
      value: "Ann",
      configurable: true,
      writable: true,
      enumerable: true,
    });
    expect(observerObject.name).toBe("Ann");
  });

  test("not configurable values should not be observable", () => {
    const observerObject = observableObject<any>({});
    try {
      Object.defineProperty(observerObject, "name", {
        value: "Ann",
        writable: false,
      });
    } catch (e) {
      expect(e.message).toBe(
        `[$gravel-reactive] Invariant failed: Cannot make property "name" observable, it is not configurable and writable in the target object`,
      );
    }
  });

  test("functions should be usually observable value ", () => {
    const observerObject = observableObject<any>({
      fn() {},
    });

    expect(typeof observerObject.fn).toBe("function");

    observerObject.fn = "Ann";

    expect(observerObject.fn).toBe("Ann");
    expect(typeof observerObject.fn).toBe("string");
  });
});
