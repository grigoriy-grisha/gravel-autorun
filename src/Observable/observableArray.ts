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
  public $$observable$$ = true;

  constructor(public target: Target) {
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
    return Reflect.get(this.target, property);
  }

  _notifyObservers() {
    this.observers.forEach((observer) => observer());
  }

  set(target: Target, property: number, value: any): boolean {
    this.spliceWithArray(property, 0, value);
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

  spliceWithArray(start: number, deleteCount?: number, ...items: any[]) {
    const enhuncersItems = items.map((item) => {
      if (!isPrimitive(item)) return observableValue(item);
      return item;
    });

    const lengthArguments = arguments.length;
    let splicesValues = [];

    if (lengthArguments === 1) {
      splicesValues = this._values.splice(start);
      this.target.splice(start);
    }
    if (lengthArguments === 2) {
      splicesValues = this._values.splice(start, deleteCount);
      this.target.splice(start, deleteCount);
    }
    if (lengthArguments > 2) {
      splicesValues = this._values.splice(start, deleteCount || 0, ...enhuncersItems);
      this.target.splice(start, deleteCount || 0, ...items);
    }

    this._notifyObservers();
    return splicesValues;
  }

  _getValue(property: number) {
    return this._values[property];
  }

  _changeValuesLength(length: number) {
    this._values.length = length;
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
