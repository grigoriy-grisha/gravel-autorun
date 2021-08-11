import defineProperty = Reflect.defineProperty;
import { ObservableValue } from "./observableValue";
import { entries, fromEntries } from "../utils";

const $gravelReactive = Symbol("gravelReactive");

export type ObservableValues<T extends object> = { [key in keyof T | string]: ObservableValue<T> };

export class ObservableObject<T extends object> {
  private readonly _values: ObservableValues<T> = {} as ObservableValues<T>;
  static create<T extends object>(target: T): ObservableObject<T> {
    return new ObservableObject(target);
  }

  constructor(private target: T) {
    this._values = fromEntries(
      entries(target).map(([key, value]) => [key, new ObservableValue(value)]),
    ) as ObservableValues<T>;
  }

  set(target: T, property: keyof T, value: any): boolean {
    const observableValue = this._getValue(property);
    observableValue.set(value);
    return true;
  }

  get(target: T, property: keyof T): T[keyof T] | T {
    const observableValue = this._getValue(property);
    return observableValue.get();
  }

  _getValue(property: keyof T) {
    return this._values[property];
  }
}

function delegateProxy<T extends object>(target: T): T {
  return new Proxy(target, {
    get(target: T, property: PropertyKey, receiver: any): any {
      // @ts-ignore
      return (target[$gravelReactive] as ObservableObject).get(target, property, receiver);
    },
    set(target: T, property: keyof T, value: any): any {
      // @ts-ignore
      return (target[$gravelReactive] as ObservableObject).set(target, property, value);
    },
  });
}

//todo переписать, добавить функционал
export function observableObject<T extends object>(target: T): T {
  defineProperty(target, $gravelReactive, {
    enumerable: false,
    configurable: false,
    writable: false,
    value: new ObservableObject<T>(target),
  });

  return delegateProxy(target);
}
