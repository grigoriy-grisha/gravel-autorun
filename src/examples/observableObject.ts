import { observableValue } from "../Observable/observableValue";
import { autorun } from "../autorun";

const observerValue = observableValue(0);

const callback = () => {
  console.log(observerValue.get());
};

autorun(callback);
observerValue.set(2);
observerValue.set(5);
observerValue.set(1);

console.log(observerValue);
