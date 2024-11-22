import config from "../config";
import { SessionMiddleware, SessionStore } from "@companieshouse/node-session-handler";

export const createSessionMiddleware = (sessionStore: SessionStore) => SessionMiddleware({
            cookieName: config.session.cookieName,
            cookieSecret: config.session.cookieSecret,
            cookieDomain: config.session.cookieDomain
        }, sessionStore, true);
