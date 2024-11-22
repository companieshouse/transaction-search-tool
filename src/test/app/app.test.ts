import express from "express";
import sinon from "sinon";
import { createSessionMiddleware } from "../../../src/middleware/session_middleware";
import { createCsrfProtectionMiddleware, csrfErrorHandler } from "../../../src/middleware/csrf_middleware";

describe("App Middleware Setup", () => {
  let useStub: sinon.SinonStub, sessionStoreMock;

  beforeEach(() => {

    // Stub the `use` method of an Express app instance
    useStub = sinon.stub(express.application, "use");
    sessionStoreMock = {
      redis: sinon.stub().returnsThis(),
      redisWrapper: sinon.stub().returnsThis(),
      load: sinon.stub().returnsThis(),
      store: sinon.stub().returnsThis(),
      delete: sinon.stub().returnsThis(),
    };
  });

  afterEach(() => {
    // Restore the stubbed method
    useStub.restore();
  });

  it("should register session and CSRF middleware", () => {
    const app = express();

    const csrfProtectionMiddleware = createCsrfProtectionMiddleware(sessionStoreMock);
    const sessionMiddleware = createSessionMiddleware(sessionStoreMock);

    // Apply middleware
    app.use(sessionMiddleware);
    app.use(csrfProtectionMiddleware);
    app.use(csrfErrorHandler);

    // Assert that `use` was called with the correct middleware
    sinon.assert.calledWith(useStub, sessionMiddleware);
    sinon.assert.calledWith(useStub, csrfProtectionMiddleware);
    sinon.assert.calledWith(useStub, csrfErrorHandler);
  });
});

