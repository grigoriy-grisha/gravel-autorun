import { isArray, isObservable, isPrimitive, isPureObject, isReaction, toPrimitive } from "../utils";
import { observableObject } from "./observableObject";
import { observableArray } from "./observableArray";

import globalState from "../globalState";
import { Reaction } from "../Reaction";
import { AnyFunction } from "../types";

// todo добавить возмоность трансофрмироаться в обычные js значения
//todo проверка на удаление свойств
export class ObservableValue<Value extends any> {
  private readonly observers: Set<AnyFunction> = new Set([]);
  public $$observable$$ = true;
  constructor(private value: Value) {
    if (isObservable(value)) {
      this.value = value;
      return;
    }
    if (isPrimitive(value)) {
      this.value = value;
      return;
    }
    if (isPureObject(value)) {
      this.value = observableObject(value);
      return;
    }
    if (isArray(value)) {
      this.value = observableArray(value);
      return;
    }
  }

  set(value: Value) {
    this.value = value;
    this._notifyObservers();
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
