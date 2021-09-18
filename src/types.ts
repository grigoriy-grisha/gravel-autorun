import { ObservableObject } from "./Observable/observableObject";
import { ObservableValue } from "./Observable/observableValue";
import { ObservableArray } from "./Observable/observableArray";
import { $gravelReactive } from "./common/constants";

export type AnyFunction = (...args: any) => any;

export type CommonlyConstructors =
  | StringConstructor
  | NumberConstructor
  | FunctionConstructor
  | ArrayConstructor
  | ObjectConstructor;

export type ObservableEntities<Target extends any> =
  | ObservableObject<Target extends object ? Target : object>
  | ObservableArray<Target extends Array<any> ? Target : Array<any>>;

export type TargetWithReactiveSymbol<Target extends any> = Target & ReactiveKey<Target>;

export type ReactiveKey<Target extends any> = {
  [$gravelReactive]: ObservableEntities<Target>;
};

export type TargetValue<Target extends object> = Target[keyof Target];

export type ObservableValues<Target extends object> = {
  [key in keyof Target]: ObservableValue<TargetValue<Target>>;
};
