import { Reaction } from "../Reaction";
import globalState from "../globalState";

//todo треюуется рефакторинг тестов
describe("reaction", () => {
  test("reaction is defined", () => {
    expect(Reaction).toBeDefined();
  });

  test("when run is executed,then prop have been called", () => {
    const callback = jest.fn();
    const reaction = new Reaction(callback);
    reaction.run();
    expect(callback).toBeCalled();
  });

  test("callback must be in global state, when run is executed", () => {
    globalState.removeExecutableCallback();
    const callback = jest.fn(() => {
      expect(globalState.getExecutableCallback()).toBeDefined();
    });
    const reaction = new Reaction(callback);
    reaction.run();
    expect(globalState.getExecutableCallback()).toBeNull();
  });
});
