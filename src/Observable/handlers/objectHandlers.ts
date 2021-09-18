import { TargetValue, TargetWithReactiveSymbol } from "../../types";
import { $gravelReactive, ObservableObject } from "../observableObject";

export class ObjectHandlers<Target extends object> implements ProxyHandler<Target> {
  get(target: Target, property: PropertyKey, receiver: any): TargetValue<Target> {
    return this.getReactiveField(target as TargetWithReactiveSymbol<Target>).get(target, property);
  }

  set(target: Target, property: keyof Target, value: TargetValue<Target>): boolean {
    return this.getReactiveField(target as TargetWithReactiveSymbol<Target>).set(target, property, value);
  }

  deleteProperty(target: Target, property: keyof Target): boolean {
    return this.getReactiveField(target as TargetWithReactiveSymbol<Target>).deleteProperty(target, property);
  }

  ownKeys(target: Target): any {
    return this.getReactiveField(target as TargetWithReactiveSymbol<Target>).ownKeys();
  }

  defineProperty(target: Target, property: PropertyKey, descriptor: PropertyDescriptor): boolean {
    return this.getReactiveField(target as TargetWithReactiveSymbol<Target>).defineProperty(
      target,
      property,
      descriptor,
    );
  }

  private getReactiveField(target: TargetWithReactiveSymbol<Target>): ObservableObject<any> {
    return target[$gravelReactive];
  }
}
