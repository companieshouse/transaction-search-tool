import { SessionKey } from "ch-node-session-handler/lib/session/keys/SessionKey";
import { SignInInfoKeys } from "ch-node-session-handler/lib/session/keys/SignInInfoKeys";
import { UserProfileKeys } from "ch-node-session-handler/lib/session/keys/UserProfileKeys";
import config from "../config";
import { createLogger } from "ch-structured-logging";
import { ISignInInfo } from "ch-node-session-handler/lib/session/model/SessionInterfaces";
import { RequestHandler } from "express";
import { Session } from "ch-node-session-handler";

const logger = createLogger(config.applicationNamespace);

const createAuthenticationMiddleware = function (): RequestHandler {

    return (req, res, next) => {

        const signInInfo = req.session
            .chain((session: Session) => session.getValue<ISignInInfo>(SessionKey.SignInInfo))
            .extract();
        if (signInInfo !== undefined) {
            const signedIn = signInInfo[SignInInfoKeys.SignedIn] === 1;
            const userInfo = signInInfo[SignInInfoKeys.UserProfile];
            if (signedIn && userInfo !== undefined) {
                if (req.body === undefined) {
                    req.body = {};
                }
                req.body.loggedInUserEmail = userInfo[UserProfileKeys.Email];
                logger.info(`Logged in as: ${req.body.loggedInUserEmail}`);
                return next();
            }
        }
        return res.redirect(`/signin?return_to=/${config.urlPrefix}/`);
    };
};

export default createAuthenticationMiddleware;