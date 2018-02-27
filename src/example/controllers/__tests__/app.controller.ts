import { expect } from "chai";
import appController from "../app.controller";

describe("app controller", () => {
  it("should work", async () => {
    expect(appController.get(), "value is bad").to.deep.equal({ foo: "bar" });
  });
});
