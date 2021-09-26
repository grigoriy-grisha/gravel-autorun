import { TargetWithReactiveSymbol } from "../../types";
import { $gravelReactive } from "../../common/constants";

export class ReactiveHandler<Target extends any> {
  //todo типы
  protected getReactiveField(target: TargetWithReactiveSymbol<Target>): any {
    return target[$gravelReactive];
  }
}
