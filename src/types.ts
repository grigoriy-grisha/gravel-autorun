import { $gravelReactive, ObservableObject } from "./Observable/observableObject";
import { ObservableValue } from "./Observable/observableValue";

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

export type ReactiveKey<Target extends object> = {
  [$gravelReactive]: ObservableObject<Target>;
};

export type TargetValue<Target extends object> = Target[keyof Target];

export type ObservableValues<Target extends object> = {
  [key in keyof Target]: ObservableValue<TargetValue<Target>>;
};
