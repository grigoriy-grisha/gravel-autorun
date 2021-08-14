import { isPrimitive, isPureObject, isReaction, toPrimitive } from "../utils";
import { observableObject } from "./observableObject";

import globalState from "../globalState";
import { AnyFunction } from "../types";
import { Reaction } from "../Reaction";

//todo проверка на удаление свойств
export class ObservableValue<Value extends any> {
  private readonly observers: Set<AnyFunction> = new Set([]);
  constructor(private value: Value) {
    if (isPrimitive(value)) this.value = value;
    if (isPureObject(value)) this.value = observableObject(value);
  }

  set(value: Value) {
    this.value = value;
    try {
      this._notifyObservers();
    } catch (e) {
      console.log(e);
    }
  }

  get(): Value {
    const executableCallback = globalState.getExecutableCallback();
    if (executableCallback) this.observe(executableCallback);
    return this.value;
  }

  observe(observer: Reaction | AnyFunction) {
    if (isReaction(observer)) {
      this.observers.add((observer as Reaction).run);
      return;
    }
    this.observers.add(observer as AnyFunction);
  }

  unobserve(observer: Reaction | AnyFunction) {
    if (isReaction(observer)) {
      this.observers.delete((observer as Reaction).run);
      return;
    }
    this.observers.delete(observer as AnyFunction);
  }

  toJSON() {
    return this.get();
  }

  toString(): string {
    return `[ObservableValue ${this.value}]`;
  }

  valueOf(): Value {
    return toPrimitive(this.get());
  }

  [Symbol.toPrimitive]() {
    return this.valueOf();
  }

  _notifyObservers() {
    this.observers.forEach((observer) => observer());
  }
}

export function observableValue(value: any) {
  return new ObservableValue(value);
}
