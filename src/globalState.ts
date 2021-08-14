import { Reaction } from "./Reaction";

class GlobalState {
  private executableCallback: Reaction | null = null;

  getExecutableCallback() {
    return this.executableCallback;
  }

  setExecutableCallback(callback: Reaction) {
    this.executableCallback = callback;
  }

  removeExecutableCallback() {
    this.executableCallback = null;
  }
}

const globalState = new GlobalState();
export default globalState;
