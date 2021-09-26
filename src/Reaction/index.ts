import { AnyFunction } from "../types";
import globalState from "../globalState";

//todo спроектировать detach или удаление слушателей
export class Reaction {
  constructor(private callback: AnyFunction) {
    this.run = this.run.bind(this);
  }

  run() {
    globalState.setExecutableCallback(this);
    try {
      this.callback.apply(this);
    } catch (e) {
      console.log(e);
    }
    globalState.removeExecutableCallback();
  }
}
