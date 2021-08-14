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
});
