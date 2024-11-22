import { assert } from "chai";
import sinon from "sinon";
import { createSessionMiddleware } from "../../../src/middleware/session_middleware";

describe("session middleware", () => {
  let sessionStoreMock;

  beforeEach(() => {

    sessionStoreMock = {
      redis: sinon.stub().returnsThis(),
      redisWrapper: sinon.stub().returnsThis(),
      load: sinon.stub().returnsThis(),
      store: sinon.stub().returnsThis(),
      delete: sinon.stub().returnsThis(),
    };
  });

  afterEach(() => {
    sinon.restore();
  });

  it("creates a session middleware", () => {
      const middleware = createSessionMiddleware(sessionStoreMock);
      assert.isFunction(middleware);
  });

});

