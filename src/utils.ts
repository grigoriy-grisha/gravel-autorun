import { CommonlyConstructors } from "./types";

export const fromEntries = Object.fromEntries;
export const entries = Object.entries;

export function is(Ctor: CommonlyConstructors, val: { constructor: any } | null) {
  return (val != null && val.constructor === Ctor) || val instanceof Ctor;
}

export function isString(arg: any): arg is string {
  return is(String, arg);
}

export function isNumber(arg: any): arg is number {
  return is(Number, arg);
}

export function isFunction(arg: any): arg is Function {
  return is(Function, arg);
}

export function isArray(arg: any): arg is Array<any> {
  return is(Array, arg);
}

export function isPureObject(arg: any): arg is Record<string, any> {
  return is(Object, arg) && !Array.isArray(arg);
}

export function isPrimitive(arg: any): arg is string | number {
  return isString(arg) || isNumber(arg);
}
