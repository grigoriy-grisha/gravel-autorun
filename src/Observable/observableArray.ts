import defineProperty = Reflect.defineProperty;
import { $gravelReactive } from "../common/constants";
import { ReactiveHandler } from "./handlers/reactiveHandler";
import { AnyFunction, ObservableValues, PrimitivesTypes, TargetValue, TargetWithReactiveSymbol } from "../types";
import { isObservableValue, isPrimitive, isReaction, propertyIsLength } from "../utils";
import { observableValue, ObservableValue } from "./observableValue";
import globalState from "../globalState";
import { Reaction } from "../Reaction";

//todo переписать, наблюдаемыми значениями могут быть только объекты и массивы
export class ObservableArray<Target extends Array<any>> {
  private readonly observers: Set<AnyFunction> = new Set([]);
  private readonly _values: ObservableValues<Target>[] | any[] = [];

  constructor(private target: Target) {
    this._values = target.map((targetElement) => {
      if (isPrimitive(targetElement)) return targetElement;
      return new ObservableValue(targetElement);
    }) as ObservableValues<Target>[] | PrimitivesTypes[];
  }

  get(target: Target, property: number) {
    const executableCallback = globalState.getExecutableCallback();
    if (executableCallback) this.observe(executableCallback);

    return Reflect.get(this.target, property);
  }

  private _notifyObservers() {
    this.observers.forEach((observer) => observer());
  }

  set(target: Target, property: number, value: any): boolean {
    const isSetSuccess = Reflect.set(this.target, property, value);
    try {
      this._notifyObservers();
    } catch (e) {
      console.log(e);
    }

    const observableValue = this._getValue(property);
    if (isObservableValue(observableValue)) observableValue.set(value);
    else if (isPrimitive(observableValue)) this._setValue(property, value);

    return isSetSuccess;
  }

  setLength(target: Target, property: "length", value: number) {
    if (this.target.length === value) return true;
    this._changeValuesLength(value);
    const isSetSuccess = Reflect.set(this.target, property, value);
    this._notifyObservers();
    return isSetSuccess;
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

  _getValue(property: number) {
    return this._values[property];
  }

  _changeValuesLength(length: number) {
    this._values.length = length;
  }

  _setValue(property: number, value: any) {
    //todo перезатирает ли это старые значения? нужно проверить
    //todo нудна проверка на наличие того свойства
    this._values[property] = observableValue(value);
  }
}
//todo добавить обратботку всех методов массива
export class ArrayHandlers<Target extends Array<any>> extends ReactiveHandler<Target> implements ProxyHandler<Target> {
  get(target: Target, property: PropertyKey, receiver: any): TargetValue<Target> {
    return this.getReactiveField(target as TargetWithReactiveSymbol<Target>).get(target, property);
  }

  set(target: Target, property: keyof Target, value: TargetValue<Target>): boolean {
    const reactiveField = this.getReactiveField(target as TargetWithReactiveSymbol<Target>);
    if (propertyIsLength(property)) return reactiveField.setLength(target, property, value);
    return reactiveField.set(target, property, value);
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
