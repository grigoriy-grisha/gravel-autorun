let handlers = Symbol("handlers");

//todo переписать, добавить функционал
export function observableObject(target: any) {
  target[handlers] = [];

  target.observe = function (handler: any) {
    this[handlers].push(handler);
  };

  return new Proxy(target, {
    set(target, property, value, receiver) {
      let success = Reflect.set(target, property, value, receiver);
      if (success) target[handlers].forEach((handler: any) => handler(property, value));
      return success;
    },
  });
}
