import { autorun } from "../autorun";
import { observableObject } from "../Observable/observableObject";

const observerObject = observableObject({
  user: {
    name: "Andrew",
    address: {
      street: "Pushkin's",
    },
    model: {
      office: {
        dealer: {
          location: {
            street: "Pushkin",
          },
        },
      },
    },
  },
});

let count = 0;
const callback = () => {
  console.log(observerObject.user.address, ++count);
};

autorun(callback);
observerObject.user.name = "Ann";
observerObject.user.model.office.dealer.location.street = "Sadovaya";

// @ts-ignore
observerObject.user.address = "object";
// @ts-ignore
observerObject.user.address = "object1";
// @ts-ignore
observerObject.user.address = "object2";

console.log(observerObject);
