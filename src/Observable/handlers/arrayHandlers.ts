import { ReactiveHandler } from "./reactiveHandler";
import { TargetValue, TargetWithReactiveSymbol } from "../../types";
import { propertyIsLength } from "../../utils";
import { $gravelReactive } from "../../common/constants";
import { ObservableArray } from "../observableArray";

type ArrayMethodsNames = keyof typeof arrayMethods;
type ArrayMethods = typeof arrayMethods[ArrayMethodsNames];

const arrayMethods = {
  push(...items: any[]): number {
    const internalReactiveInstance = (this as any)[$gravelReactive] as ObservableArray<any>;
    internalReactiveInstance.spliceWithArray(internalReactiveInstance._getValues().length, 0, ...items);
    internalReactiveInstance.target.push(...items);
    return internalReactiveInstance.getLength();
  },

  splice(start: number, deleteCount: number, ...items: any[]) {
    const internalReactiveInstance = (this as any)[$gravelReactive] as ObservableArray<any>;
    const lengthArguments = arguments.length;

    if (lengthArguments === 0) return [];
    if (lengthArguments === 1) return internalReactiveInstance.spliceWithArray(start);
    if (lengthArguments === 2) return internalReactiveInstance.spliceWithArray(start, deleteCount);
    if (lengthArguments > 2) return internalReactiveInstance.spliceWithArray(start, deleteCount, ...items);
  },

  pop() {
    const internalReactiveInstance = (this as any)[$gravelReactive] as ObservableArray<any>;
    return internalReactiveInstance.spliceWithArray(Math.max(internalReactiveInstance.getLength() - 1, 0), 1)[0];
  },

  shift() {
    const internalReactiveInstance = (this as any)[$gravelReactive] as ObservableArray<any>;
    return internalReactiveInstance.spliceWithArray(0, 1)[0];
  },

  unshift(...items: any[]): number {
    const internalReactiveInstance = (this as any)[$gravelReactive] as ObservableArray<any>;
    internalReactiveInstance.spliceWithArray(0, 0, ...items);
    return internalReactiveInstance.getLength();
  },

  //todo нужны тесты для autorun
  reverse() {
    //todo тут нужно выплевывать исклчючение

    const internalReactiveInstance = (this as any)[$gravelReactive] as ObservableArray<any>;
    internalReactiveInstance.spliceWithArray(
      0,
      internalReactiveInstance.getLength(),
      ...internalReactiveInstance.target.reverse(),
    );

    return internalReactiveInstance.target;
  },

  //todo нужны тесты для autorun
  sort(): any[] {
    //todo тут нужно выплевывать исклчючение

    const internalReactiveInstance = (this as any)[$gravelReactive] as ObservableArray<any>;
    [].sort.apply(internalReactiveInstance.target, arguments as any);
    internalReactiveInstance.spliceWithArray(
      0,
      internalReactiveInstance.getLength(),
      ...internalReactiveInstance.target,
    );
    return internalReactiveInstance.target;
  },
};

export class ArrayHandlers<Target extends Array<any>> extends ReactiveHandler<Target> implements ProxyHandler<Target> {
  get(target: Target, property: PropertyKey, receiver: any): TargetValue<Target> | ArrayMethods {
    const arrayMethod = arrayMethods[property as ArrayMethodsNames];
    if (arrayMethod) return arrayMethod.bind(target);

    return this.getReactiveField(target as TargetWithReactiveSymbol<Target>).get(target, property);
  }

  set(target: Target, property: keyof Target, value: TargetValue<Target>): boolean {
    const reactiveField = this.getReactiveField(target as TargetWithReactiveSymbol<Target>);

    if (propertyIsLength(property)) return reactiveField.setLength(value);
    return reactiveField.set(target, property, value);
  }
}
