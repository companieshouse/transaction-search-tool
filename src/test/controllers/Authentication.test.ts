import sinon from "sinon";

import { ISignInInfo } from "ch-node-session-handler/lib/session/model/SessionInterfaces";
import { RequestHandler } from "express";
import { SignInInfoKeys } from "ch-node-session-handler/lib/session/keys/SignInInfoKeys";
import { SessionKey } from "ch-node-session-handler/lib/session/keys/SessionKey";
import { UserProfileKeys } from "ch-node-session-handler/lib/session/keys/UserProfileKeys";

import chai from 'chai';

const proxyquire = require("proxyquire");

describe("authenticationMiddleware", function () {

    const createMockRequest = function (signInInfo?: ISignInInfo) {
        return {
            session: {
                chain: function () {
                    return {
                        extract: () => signInInfo
                    };
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

    let middleware: RequestHandler;

    let mockUrl = "transactionsearch";

    const requireMiddleware = function () {

        return proxyquire("../../controllers/Authentication", {
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
