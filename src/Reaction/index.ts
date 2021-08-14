import { AnyFunction } from "../types";
import globalState from "../globalState";

export class Reaction {
  constructor(private callback: AnyFunction) {
    this.run = this.run.bind(this);
  }

  run() {
    globalState.setExecutableCallback(this);
    try {
      this.callback();
    } catch (e) {
      console.log(e);
    }
    globalState.removeExecutableCallback();
  }
}
