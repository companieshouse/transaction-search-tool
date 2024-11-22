import { assert } from "chai";
import sinon from "sinon";
import { CsrfError } from "@companieshouse/web-security-node";
import { csrfErrorHandler, csrfErrorTemplateName, createCsrfProtectionMiddleware } from "../../../src/middleware/csrf_middleware";

describe("csrfErrorHandler", () => {
  let nextStub, reqMock, resMock, sessionStoreMock;

  beforeEach(() => {
    nextStub = sinon.stub();
    reqMock = {};
    resMock = {
      status: sinon.stub().returnsThis(),
      render: sinon.stub().returnsThis(),
    };
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

  it("calls next when not a CSRF Error", () => {
    const notCsrfError = new Error("I am not a CSRF ERROR!");

    csrfErrorHandler(
      notCsrfError,
      reqMock,
      resMock,
      nextStub
    );

    assert(nextStub.calledOnceWithExactly(notCsrfError), "next should be called with the non-CSRF error");
    assert(resMock.status.notCalled, "status should not be called");
    assert(resMock.render.notCalled, "render should not be called");
  });

  it("renders 403 error when CSRF error", () => {
    const csrfError = new CsrfError("Token mismatch");

    csrfErrorHandler(
      csrfError,
      reqMock,
      resMock,
      nextStub
    );

    assert(nextStub.notCalled, "next should not be called for a CSRF error");
    assert(resMock.status.calledOnceWithExactly(403), "status should be set to 403");
    assert(
      resMock.render.calledOnceWithExactly(csrfErrorTemplateName, { csrfErrors: true }),
      "render should be called with the correct template and data"
    );
  });

  it("creates a CSRF protection middleware", () => {
      // const mockSessionStore = sinon.stub();
      const middleware = createCsrfProtectionMiddleware(sessionStoreMock);
      assert.isFunction(middleware);
  });

  it("uses the correct template name", () => {
    assert.equal(csrfErrorTemplateName, "csrf-error");
  });

});

