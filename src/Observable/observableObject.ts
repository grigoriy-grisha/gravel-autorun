import { AnyFunction } from "../types";
import globalState from "../globalState";

export class ObservableObject<T extends object> {
  static create<T extends object>(target: T): ObservableObject<T> {
    return new ObservableObject(target);
  }

  private readonly observers: AnyFunction[] = [];
  constructor(private target: T) {}

  set(target: T, property: PropertyKey, value: any) {
    const success = Reflect.set(this.target, property, value);
    if (success) this.executeObservers();
    return success;
  }

  get(target: T, property: keyof T) {
    const executableCallback = globalState.getExecutableCallback();
    if (executableCallback) this.observe(executableCallback);
    return this.target[property];
  }

  observe(callback: AnyFunction) {
    this.observers.push(callback);
  }

  private executeObservers() {
    this.observers.forEach((observer) => observer());
  }
}

//todo переписать, добавить функционал
export function observableObject<T extends object>(target: T): T {
  return new Proxy(target, new ObservableObject<T>(target));
}
