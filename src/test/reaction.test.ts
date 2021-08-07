import { Reaction } from "../Reaction";

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
});
