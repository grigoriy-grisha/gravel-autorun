import { $gravelReactive, ObservableObject } from "./Observable/observableObject";

export type AnyFunction = (...args: any) => any;

export type CommonlyConstructors =
  | StringConstructor
  | NumberConstructor
  | FunctionConstructor
  | ArrayConstructor
  | ObjectConstructor;

export type TargetWithReactiveSymbol<Target extends object> = {
  [key in keyof Target]: Target[keyof Target];
} &
  ReactiveKey<Target>;

type ReactiveKey<Target extends object> = {
  [$gravelReactive]: ObservableObject<Target>;
};

export type TargetValue<Target extends object> = Target[keyof Target];
