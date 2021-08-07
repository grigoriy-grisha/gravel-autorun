import { AnyFunction } from "../types";
import { Reaction } from "../Reaction";

export function autorun(callback: AnyFunction) {
  const reaction = new Reaction(callback);
  reaction.run();
}
