import { RequestHandler } from "express";
import { SessionKey } from "ch-node-session-handler/lib/session/keys/SessionKey";
import { SignInInfoKeys } from "ch-node-session-handler/lib/session/keys/SignInInfoKeys";
import { UserProfileKeys } from "ch-node-session-handler/lib/session/keys/UserProfileKeys";
import config from "../config";
import { createLogger } from "ch-structured-logging";

const logger = createLogger(config.applicationNamespace);

const createAuthenticationMiddleware = function (): RequestHandler {

    return (req, res, next) => {

        const sessionData = req.session['data'];
        const signInInfo = (sessionData !== undefined)? sessionData[SessionKey.SignInInfo] : undefined;

        if (signInInfo !== undefined) {

            const signedIn = signInInfo[SignInInfoKeys.SignedIn] === 1;
            const userInfo = signInInfo[SignInInfoKeys.UserProfile];
            if (signedIn && userInfo !== undefined) {
                if (req.body === undefined) {
                    req.body = {};
                }

                req.body.loggedInUserEmail = userInfo[UserProfileKeys.Email];
                logger.info(req.body.loggedInUserEmail);
                return next();
            }
        }

        return res.redirect(`/signin?return_to=/${config.urlPrefix}/`);
    };
};

export default createAuthenticationMiddleware;
