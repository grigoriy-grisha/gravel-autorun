import { AnyFunction } from "../types";
import globalState from "../globalState";

export function ExecutableCallback(target: any, key: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = function (this: { observe: (callback: AnyFunction) => void }) {
    const executableCallback = globalState.getExecutableCallback();
    if (executableCallback) this.observe(executableCallback);
    return originalMethod.apply(this);
  };
}
