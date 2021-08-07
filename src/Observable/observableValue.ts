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
