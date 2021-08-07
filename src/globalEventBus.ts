import events from "events";
import { EventEmitter } from "./EventEmitter";

export enum GlobalEventName {
  ExecutableCallback = "ExecutableCallback",
}

export const globalEventBus = new EventEmitter<{ [GlobalEventName.ExecutableCallback]: undefined }>(events);
