import { AnyFunction } from "../types";
import globalState from "../globalState";
import { isPrimitive, isPureObject } from "../utils";
import { observableObject } from "./observableObject";

export class ObservableValue {
  private readonly observers: AnyFunction[] = [];
  constructor(private value: any) {
    if (isPrimitive(value)) this.value = value;
    if (isPureObject(value)) this.value = observableObject(value);
  }

  set(value: any) {
    this.value = value;
    try {
      this.executeObservers();
    } catch (e) {
      console.log(e);
    }
  }

  get() {
    const executableCallback = globalState.getExecutableCallback();
    if (executableCallback) this.observe(executableCallback);
    return this.value;
  }

  observe(callback: AnyFunction) {
    this.observers.push(callback);
  }

  unobserve(callback: AnyFunction) {
    this.observers.splice(this.observers.indexOf(callback), 1);
  }

  private executeObservers() {
    this.observers.forEach((observer) => observer());
  }
}

export function observableValue(value: any) {
  return new ObservableValue(value);
}
