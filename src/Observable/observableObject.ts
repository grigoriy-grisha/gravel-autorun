import defineProperty = Reflect.defineProperty;
import { observableValue, ObservableValue } from "./observableValue";
import { isObservableValue, transformEach } from "../utils";
import { ObservableValues, TargetValue, TargetWithReactiveSymbol } from "../types";
import globalState from "../globalState";

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
    if (observableValue) observableValue.set(value);
    else this._setValue(property, value);

    return Reflect.set(target, property, value);
  }

  get(target: Target, property: keyof Target): TargetValue<Target> | Target | undefined {
    const observableValue = this._getValue(property);
    const haveProp = observableValue && Reflect.has(target, property);

    const executableCallback = globalState.getExecutableCallback();

    if (executableCallback && !haveProp) {
      Reflect.set(target, property, undefined);
      this._setValue(property, undefined);
    }

    const observableValueOutExecutableCallback = this._getValue(property);
    const havePropOutExecutableCallback = observableValueOutExecutableCallback && Reflect.has(target, property);

    if (havePropOutExecutableCallback && isObservableValue(observableValueOutExecutableCallback))
      return observableValueOutExecutableCallback.get();

    return Reflect.get(target, property);
  }

  deleteProperty(target: Target, property: keyof Target) {
    const observableValue = this._getValue(property);
    if (isObservableValue(observableValue)) observableValue._notifyObservers();

    const valuesDeleted = Reflect.deleteProperty(this._values, property);
    const originalDeleted = Reflect.deleteProperty(target, property);

    return valuesDeleted && originalDeleted;
  }

  _getValue(property: keyof Target) {
    return this._values[property];
  }

  _setValue(property: keyof Target, value: any) {
    return (this._values[property] = observableValue(value));
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
