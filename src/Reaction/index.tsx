import { AnyFunction } from "../types";
import globalState from "../globalState";

export class Reaction {
  constructor(private callback: AnyFunction) {}

  run() {
    globalState.setExecutableCallback(this.callback);
    this.callback();
  }
}
