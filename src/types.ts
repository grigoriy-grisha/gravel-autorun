export type AnyFunction = (...args: any) => any;

export type CommonlyConstructors =
  | StringConstructor
  | NumberConstructor
  | FunctionConstructor
  | ArrayConstructor
  | ObjectConstructor;
