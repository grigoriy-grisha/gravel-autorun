import defineProperty = Reflect.defineProperty;

import { observableValue, ObservableValue } from "./observableValue";
import { ObservableValues, TargetValue } from "../types";
import { ObjectHandlers } from "./handlers/objectHandlers";

import { invariant, isObservableValue, objectRow, transformEach } from "../utils";
import globalState from "../globalState";
import { $gravelReactive } from "../common/constants";

export class ObservableObject<Target extends object> {
  private readonly _values: ObservableValues<Target> = {} as ObservableValues<Target>;
  public $$observable$$ = true;

  static create<Target extends object>(target: Target): ObservableObject<Target> {
    return new ObservableObject(target);
  }

  constructor(private target: Target) {
    this._values = transformEach(target)(([key, value]) =>
      objectRow(key, new ObservableValue(value)),
    ) as ObservableValues<Target>;
  }

  set(target: Target, property: keyof Target, value: any): boolean {
    const observableValue = this._getValue(property);
    if (observableValue) observableValue.set(value);
    else this._setValue(property, value);

    return Reflect.set(this.target, property, value);
  }

  get(target: Target, property: keyof Target): TargetValue<Target> | Target | undefined {
    const haveProp = Reflect.has(this.target, property);
    const executableCallback = globalState.getExecutableCallback();

    if (executableCallback && !haveProp) {
      Reflect.set(this.target, property, undefined);
      this._setValue(property, undefined);
    }

    const observableValueOutExecutableCallback = this._getValue(property);
    const havePropOutExecutableCallback = observableValueOutExecutableCallback && Reflect.has(this.target, property);

    if (havePropOutExecutableCallback && isObservableValue(observableValueOutExecutableCallback))
      return observableValueOutExecutableCallback.get();

    return Reflect.get(this.target, property);
  }

  deleteProperty(target: Target, property: keyof Target) {
    const observableValue = this._getValue(property);
    if (isObservableValue(observableValue)) observableValue._notifyObservers();

    const valuesDeleted = Reflect.deleteProperty(this._values, property);
    const originalDeleted = Reflect.deleteProperty(this.target, property);

    return valuesDeleted && originalDeleted;
  }

  defineProperty(target: Target, property: keyof Target, descriptor: PropertyDescriptor): boolean {
    invariant(
      Boolean(descriptor.configurable) || Boolean(descriptor.writable),
      `Cannot make property "${property.toString()}" observable, it is not configurable and writable in the target object`,
    );

    this._setValue(property, descriptor.value);
    return Reflect.defineProperty(this.target, property, descriptor);
  }

  ownKeys() {
    return Reflect.ownKeys(this.target);
  }

  _getValue(property: keyof Target) {
    return this._values[property];
  }

  _setValue(property: keyof Target, value: any) {
    return (this._values[property] = observableValue(value));
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
