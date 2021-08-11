import { AnyFunction } from "../types";
import globalState from "../globalState";
import { isPrimitive, isPureObject, toPrimitive } from "../utils";
import { observableObject } from "./observableObject";

export class ObservableValue<T extends any> {
  private readonly observers: AnyFunction[] = [];
  constructor(private value: T) {
    if (isPrimitive(value)) this.value = value;
    if (isPureObject(value)) this.value = observableObject(value);
  }

  set(value: T) {
    this.value = value;
    try {
      this.executeObservers();
    } catch (e) {
      console.log(e);
    }
  }

  get(): T {
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

  toJSON() {
    return this.get();
  }

  toString() {
    return `${ObservableValue}[${this.value}]`;
  }

  valueOf(): T {
    return toPrimitive(this.get());
  }

  [Symbol.toPrimitive]() {
    return this.valueOf();
  }

  private executeObservers() {
    this.observers.forEach((observer) => observer());
  }
}

export function observableValue(value: any) {
  return new ObservableValue(value);
}
