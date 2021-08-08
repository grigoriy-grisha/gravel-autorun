import { AnyFunction } from "../types";
import globalState from "../globalState";

export class ObservableObject<T extends object> {
  static create<T extends object>(target: T): ObservableObject<T> {
    return new ObservableObject(target);
  }

  private readonly observers: AnyFunction[] = [];
  constructor(private target: T) {}

  set(target: T, property: keyof T, value: any): boolean {
    const success = Reflect.set(target, property, value);
    if (success) this.executeObservers();
    return success;
  }

  get(target: T, property: keyof T): T[keyof T] {
    if (typeof target[property] === "object" && this.target[property] !== null) {
      return new Proxy(target[property] as any, this);
    }

    const executableCallback = globalState.getExecutableCallback();
    if (executableCallback) this.observe(executableCallback);
    return target[property];
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
