import defineProperty = Reflect.defineProperty;
import { $gravelReactive } from "../common/constants";
import { ReactiveHandler } from "./handlers/reactiveHandler";
import { ObservableValues, TargetValue, TargetWithReactiveSymbol } from "../types";
import { isObservableValue, objectRow, transformEach } from "../utils";
import { observableValue, ObservableValue } from "./observableValue";

//todo переписать, наблюдаемыми значениями могут быть только объекты и массивы
export class ObservableArray<Target extends Array<any>> {
  private readonly _values: ObservableValues<Target> = {} as ObservableValues<Target>;

  constructor(private target: Target) {
    this._values = transformEach(target)(([key, value]) =>
      objectRow(key, new ObservableValue(value)),
    ) as ObservableValues<Target>;
  }

  get(target: Target, property: number) {
    const observableValue = this._getValue(property);
    const haveProp = Reflect.has(this.target, property);

    const havePropOutExecutableCallback = observableValue && haveProp;
    if (havePropOutExecutableCallback && isObservableValue(observableValue)) return observableValue.get();

    return Reflect.get(this.target, property);
  }

  set(target: Target, property: number, value: any): boolean {
    const observableValue = this._getValue(property);
    if (observableValue) observableValue.set(value);
    else this._setValue(property, value);

    return Reflect.set(this.target, property, value);
  }

  _getValue(property: number) {
    return this._values[property];
  }

  _setValue(property: number, value: any) {
    this._values[property] = observableValue(value);
  }
}

export class ArrayHandlers<Target extends Array<any>> extends ReactiveHandler<Target> implements ProxyHandler<Target> {
  get(target: Target, property: PropertyKey, receiver: any): TargetValue<Target> {
    return this.getReactiveField(target as TargetWithReactiveSymbol<Target>).get(target, property);
  }

  set(target: Target, property: keyof Target, value: TargetValue<Target>): boolean {
    console.log(target, property, value);
    return this.getReactiveField(target as TargetWithReactiveSymbol<Target>).set(target, property, value);
  }
}

function delegateProxy<Target extends Array<any>>(target: Target): Target {
  return new Proxy(target, new ArrayHandlers());
}

export function observableArray<Target extends Array<any>>(target: Target): Target {
  defineProperty(target, $gravelReactive, {
    enumerable: false,
    configurable: false,
    writable: false,
    value: new ObservableArray<Target>(target),
  });

  return delegateProxy(target);
}
