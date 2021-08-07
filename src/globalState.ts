import { AnyFunction } from "./types";

class GlobalState {
  private executableCallback: AnyFunction | null = null;

  getExecutableCallback() {
    return this.executableCallback;
  }

  setExecutableCallback(callback: AnyFunction) {
    this.executableCallback = callback;
  }

  removeExecutableCallback() {
    this.executableCallback = null;
  }
}

const globalState = new GlobalState();
export default globalState;
