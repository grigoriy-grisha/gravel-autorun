import { AnyFunction } from "../types";

export class Reaction {
  constructor(private callback: AnyFunction) {}

  run() {
    this.callback();
  }
}
