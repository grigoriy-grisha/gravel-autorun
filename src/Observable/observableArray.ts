import { $gravelReactive, ObservableObject } from "./observableObject";
import defineProperty = Reflect.defineProperty;

class ObservableArray<Target extends Array<any>> {
  constructor(target: Target) {}
}

function delegateProxy<Target extends Array<any>>(target: Target): Target {
  return new Proxy(target, {});
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
