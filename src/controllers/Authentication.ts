import { SessionKey } from "@companieshouse/node-session-handler/lib/session/keys/SessionKey";
import { SignInInfoKeys } from "@companieshouse/node-session-handler/lib/session/keys/SignInInfoKeys";
import { UserProfileKeys } from "@companieshouse/node-session-handler/lib/session/keys/UserProfileKeys";
import config from "../config";
import { createLogger } from "@companieshouse/structured-logging-node";
import { ISignInInfo } from "@companieshouse/node-session-handler/lib/session/model/SessionInterfaces";
import { RequestHandler } from "express";

const logger = createLogger(config.applicationNamespace);

const createAuthenticationMiddleware = function (): RequestHandler {

    return (req, res, next) => {

        const signInInfo: ISignInInfo | undefined = req.session?.data[SessionKey.SignInInfo];
        if (signInInfo !== undefined) {
            const signedIn = signInInfo[SignInInfoKeys.SignedIn] === 1;
            const userInfo = signInInfo[SignInInfoKeys.UserProfile];
            if (signedIn && userInfo !== undefined) {
                if (req.body === undefined) {
                    req.body = {};
                }
                req.body.loggedInUserEmail = userInfo[UserProfileKeys.Email];
                logger.info(`Logged in as: ${req.body.loggedInUserEmail}`);

                const permissions = userInfo[UserProfileKeys.Permissions];

                var engine = res.app.get('engine');
                engine.addGlobal("loggedInUserEmail", req.body.loggedInUserEmail);

                if (permissions !== undefined && permissions["/admin/transaction-search"] === 1) {
                    return next();
                } else {
                    logger.infoRequest(req, `Signed in user (${req.body.loggedInUserEmail}) does not have the correct permissions`);

                    res.status(403);

                    return res.render("notAuthorised");
                }
            }
        }
        return res.redirect(`/signin?return_to=/${config.urlPrefix}/`);
    };
};

export default createAuthenticationMiddleware;