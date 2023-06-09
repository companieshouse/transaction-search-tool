import config from "../config";
import session from "express-session";
import genuuid from "uuid/v4";
import { SessionMiddleware, SessionStore } from "@companieshouse/node-session-handler";
import Redis from "ioredis";
import { RequestHandler } from "express";

// Get stubbed cookie and session middleware for node environments
// or use CH session middleware for production
const getSessionMiddleware = function(): RequestHandler {
    let sessionMiddleware;
    
    if (process.env.NODE_ENV === "development") {
        sessionMiddleware = session({
            name: config.session.cookieName,
            secret: config.session.cookieSecret,
            genid: function() { return genuuid(); },
            cookie: { 
                secure: config.session.cookieSecure === "1",
                maxAge: config.session.timeOut * 1000,
                httpOnly: true,
                domain: config.session.cookieDomain,
                path: "/"
            },
            resave: false,
            saveUninitialized: true,
        })
    } else {
        const sessionStore = new SessionStore(new Redis(`redis://${config.session.cacheServer}`));
        sessionMiddleware = SessionMiddleware({
            cookieName: config.session.cookieName,
            cookieSecret: config.session.cookieSecret,
            cookieDomain: config.session.cookieDomain
        }, sessionStore);
    }
    return sessionMiddleware;

}

export default getSessionMiddleware;