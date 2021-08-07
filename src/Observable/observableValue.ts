import { AnyFunction } from "../types";

class ObservableValue {
  private readonly observers = [];
  constructor(private value: any) {}

  set(value) {
    try {
      this.executeObservers();
    } catch (e) {
      console.log(e);
    }

    this.value = value;
  }

  get() {
    return this.value;
  }

  observe(callback: AnyFunction) {
    this.observers.push(callback);
  }

  private executeObservers() {
    this.observers.forEach((observer) => observer());
  }
}

export function observableValue(value: any) {
  return new ObservableValue(value);
}
