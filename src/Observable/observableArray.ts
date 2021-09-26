import defineProperty = Reflect.defineProperty;
import { $gravelReactive } from "../common/constants";
import { AnyFunction, ObservableValues, PrimitivesTypes } from "../types";
import { isObservableValue, isPrimitive, isReaction } from "../utils";
import { observableValue, ObservableValue } from "./observableValue";
import globalState from "../globalState";
import { Reaction } from "../Reaction";
import { ArrayHandlers } from "./handlers/arrayHandlers";

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

    const observableValue = this._getValue(property);
    if (isObservableValue(observableValue)) return observableValue.get();
    return observableValue;
  }

  private _notifyObservers() {
    this.observers.forEach((observer) => observer());
  }

  set(target: Target, property: number, value: any): boolean {
    this._setValue(property, value);
    this._notifyObservers();
    return true;
  }

  setLength(value: number) {
    if (this.target.length === value) return true;
    this._changeValuesLength(value);
    const isSetSuccess = Reflect.set(this.target, "length", value);
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

  spliceWithArray(index: number = 0, deleteCount: number = 0, newItems: any[] = []) {
    const length = this._values.length;
    //todo посмотерть как могут изменться индексы в разных кейсах
    if (index > length) index = length;

    newItems.forEach((item, index) => this._setValue(length + index, item));
    //todo это делать в конце push и других методах массивов
    this._notifyObservers();
  }

  _getValue(property: number) {
    return this._values[property];
  }

  _changeValuesLength(length: number) {
    this._values.length = length;
  }

  _justSetValue(property: number, value: any) {
    this._values[property] = value;
  }

  _setObservableValue(property: number, value: any) {
    //todo перезатирает ли это старые значения? нужно проверить
    //todo нудна проверка на наличие этого свойства
    this._values[property] = observableValue(value);
  }

  _setValue(property: number, value: any) {
    //todo вынести в enhuncer
    const observableValue = this._getValue(property);

    if (isObservableValue(observableValue)) observableValue.set(value);
    else if (!isPrimitive(observableValue)) this._setObservableValue(property, value);
    else this._justSetValue(property, value);
  }

  _getValues() {
    return this._values;
  }

  getLength() {
    return this._values.length;
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
