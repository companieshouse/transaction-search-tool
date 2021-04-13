import { RequestHandler } from "express";
import { SessionKey } from "ch-node-session-handler/lib/session/keys/SessionKey";
import { SignInInfoKeys } from "ch-node-session-handler/lib/session/keys/SignInInfoKeys";
import { UserProfileKeys } from "ch-node-session-handler/lib/session/keys/UserProfileKeys";
import config from "../config";
import { createLogger } from "ch-structured-logging";

const logger = createLogger(config.applicationNamespace);

const createAuthenticationMiddleware = function (): RequestHandler {

    return (req, res, next) => {

        logger.info(`Request is currently: ${req}`)
        logger.info(`Session is currently: ${req.session}`);
        const sessionData = req.session['data'];
        logger.info(`Data is currently: ${sessionData}`);
        const signInInfo = (sessionData !== undefined)? sessionData[SessionKey.SignInInfo] : undefined;

        if (signInInfo !== undefined) {
            logger.info(`signInInfo is currently: ${signInInfo}`);

            const signedIn = signInInfo[SignInInfoKeys.SignedIn] === 1;
            const userInfo = signInInfo[SignInInfoKeys.UserProfile];
            logger.info(`user info is currently: ${userInfo}`);

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
