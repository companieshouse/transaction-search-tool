import { SessionKey } from "ch-node-session-handler/lib/session/keys/SessionKey";
import { SignInInfoKeys } from "ch-node-session-handler/lib/session/keys/SignInInfoKeys";
import { UserProfileKeys } from "ch-node-session-handler/lib/session/keys/UserProfileKeys";
import config from "../config";
import { createLogger } from "ch-structured-logging";
import { ISignInInfo } from "ch-node-session-handler/lib/session/model/SessionInterfaces";
import { NextFunction, Request, Response } from 'express';

const logger = createLogger(config.applicationNamespace);

export default (req: Request, res: Response, next: NextFunction): void => {

    try {
        logger.info(`Session is currently: ${req.session}`);
        const signInInfo = getSignInInfo(req.session);
        logger.info(`Sign in info is: ${signInInfo}`);
        if (checkUserSignedIn(signInInfo)) {
            const userInfo = signInInfo[SignInInfoKeys.UserProfile];
            if (req.body === undefined) {
                req.body = {};
            }
            req.body.loggedInUserEmail = userInfo?.[UserProfileKeys.Email];
            logger.info(`logged in as: ${req.body.loggedInUserEmail}`);
            return next();
        }
        return res.redirect(`/signin?return_to=/${config.urlPrefix}/`);
    } catch (err) {
        logger.error(err);
    }
};

function checkUserSignedIn(signInInfo): boolean {
    return signInInfo?.[SignInInfoKeys.SignedIn] === 1;
}

function getSignInInfo(session): ISignInInfo {
    return session?.data?.[SessionKey.SignInInfo];
}