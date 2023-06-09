import sinon, { SinonStubbedInstance } from "sinon";

import { ISignInInfo } from "@companieshouse/node-session-handler/lib/session/model/SessionInterfaces";
import { RequestHandler } from "express";
import { SignInInfoKeys } from "@companieshouse/node-session-handler/lib/session/keys/SignInInfoKeys";
import { SessionKey } from "@companieshouse/node-session-handler/lib/session/keys/SessionKey";
import { UserProfileKeys } from "@companieshouse/node-session-handler/lib/session/keys/UserProfileKeys";

import chai from 'chai';
import ApplicationLogger from "@companieshouse/structured-logging-node/lib/ApplicationLogger";

const proxyquire = require("proxyquire");

describe("authenticationMiddleware", function () {

    const createMockRequest = function (signInInfo?: ISignInInfo) {
        return {
            session: {
                data: {
                    [SessionKey.SignInInfo]: signInInfo
                }
            },
        };
    };

    const createMockResponse = function () {
        return {
            redirect: sinon.spy(),
            status: sinon.stub(),
            render: sinon.spy(),
            app: sinon.stub()
        };
    };

    let next: any;
    let mockResponse: any;
    const mockLogger: SinonStubbedInstance<ApplicationLogger> = sinon.createStubInstance(ApplicationLogger);

    let middleware: RequestHandler;

    let mockUrl = "transactionsearch";

    const requireMiddleware = function () {

        return proxyquire("../../controllers/Authentication", {
            "@companieshouse/structured-logging-node": {
                createLogger: function () {
                    return mockLogger;
                }
            },
            "../config": {
                default: {
                    urlPrefix:mockUrl
                }
            }
        }).default();
    };

    beforeEach(function () {
        next = sinon.stub();
        mockResponse = createMockResponse();
        middleware = requireMiddleware();
        var engine = {
            addGlobal: sinon.stub()
          };
        sinon.stub(mockResponse.app, "get").returns(engine);

    });


    it("redirects to signin if session does not exist", function () {

        const mockRequest: any = createMockRequest();
        middleware(mockRequest, mockResponse, next);

        chai.expect(mockResponse.redirect.calledOnceWith(`/signin?return_to=/${mockUrl}/`)).to.be.true;
    });

    it("calls next if signed in and user profile exists with permission", function () {
        const mockRequest: any = createMockRequest({
                [SignInInfoKeys.SignedIn]: 1,
                [SignInInfoKeys.UserProfile]: {
                    [UserProfileKeys.Email]: 'email',
                    [UserProfileKeys.Permissions]: {
                        "/admin/transaction-search" : 1
                    }
                },
            });

        middleware(mockRequest, mockResponse, next);

        chai.expect(next.calledOnce).to.be.true;
    });

    it("renders not authorised if signed in and user profile exists without permission", function () {
        const mockRequest: any = createMockRequest({
                [SignInInfoKeys.SignedIn]: 1,
                [SignInInfoKeys.UserProfile]: {
                    [UserProfileKeys.Email]: 'email'
                },
            });

        middleware(mockRequest, mockResponse, next);

        chai.expect(mockResponse.status.calledOnceWith(403)).to.be.true;
        chai.expect(mockResponse.render.calledOnceWith("notAuthorised")).to.be.true;
    });

    it("redirects to signin if signed in is set to 0", function () {

        const mockRequest: any = createMockRequest({
            [SignInInfoKeys.SignedIn]: 0,
                [SignInInfoKeys.UserProfile]: {
                    [UserProfileKeys.Email]: 'email',
                }
        });
        middleware(mockRequest, mockResponse, next);

        chai.expect(mockResponse.redirect.calledOnceWith(`/signin?return_to=/${mockUrl}/`)).to.be.true;
    });
});
