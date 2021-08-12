import defineProperty = Reflect.defineProperty;
import { ObservableValue } from "./observableValue";
import { transformEach } from "../utils";
import { ObservableValues, TargetValue, TargetWithReactiveSymbol } from "../types";

export const $gravelReactive = Symbol("gravelReactive");
export class ObservableObject<Target extends object> {
  private readonly _values: ObservableValues<Target> = {} as ObservableValues<Target>;
  static create<Target extends object>(target: Target): ObservableObject<Target> {
    return new ObservableObject(target);
  }

  constructor(private target: Target) {
    this._values = transformEach(target)(([key, value]) => ({
      [key]: new ObservableValue(value),
    })) as ObservableValues<Target>;
  }

  set(target: Target, property: keyof Target, value: any): boolean {
    const observableValue = this._getValue(property);
    observableValue.set(value);
    return true;
  }

  get(target: Target, property: keyof Target): TargetValue<Target> | Target {
    const observableValue = this._getValue(property);
    return observableValue.get();
  }

  deleteProperty(target: Target, property: keyof Target) {
    const observableValue = this._getValue(property);
    observableValue._notifyObservers();
    return Reflect.deleteProperty(target, property);
  }

  _getValue(property: keyof Target) {
    return this._values[property];
  }
}

class ObjectHandlers<Target extends object> implements ProxyHandler<Target> {
  get(target: Target, property: PropertyKey, receiver: any): TargetValue<Target> {
    return this.getReactiveField(target as TargetWithReactiveSymbol<Target>).get(target, property);
  }
  set(target: Target, property: keyof Target, value: TargetValue<Target>): boolean {
    return this.getReactiveField(target as TargetWithReactiveSymbol<Target>).set(target, property, value);
  }
  deleteProperty(target: Target, property: keyof Target): boolean {
    return this.getReactiveField(target as TargetWithReactiveSymbol<Target>).deleteProperty(target, property);
  }

  getReactiveField(target: TargetWithReactiveSymbol<Target>): ObservableObject<any> {
    return target[$gravelReactive];
  }
}
function delegateProxy<Target extends object>(target: Target): Target {
  return new Proxy(target, new ObjectHandlers());
}

export function observableObject<Target extends object>(target: Target): Target {
  defineProperty(target, $gravelReactive, {
    enumerable: false,
    configurable: false,
    writable: false,
    value: new ObservableObject<Target>(target),
  });

  return delegateProxy(target);
}
