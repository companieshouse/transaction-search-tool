import express from "express";
import session from "express-session";
import genuuid from "uuid/v4";
import { createLogger, createLoggerMiddleware } from "ch-structured-logging";
import * as nunjucks from "nunjucks";
import config from "./config";
import path from "path";
import Redis from "ioredis";

import BarcodeSearchRouter from "./routes/BarcodeSearchRouter";
import authenticationMiddleware from "./controllers/Authentication";
import SigninRouter from "./routes/SigninRouter";
import cookieParser from "cookie-parser";

const app = express();
const logger = createLogger(config.applicationNamespace);

const viewPath = path.join(__dirname, "views");

var env = nunjucks
    .configure([
        viewPath,  
        "node_modules/govuk-frontend/",
        "node_modules/govuk-frontend/components",
    ], {
        autoescape: true,
        noCache: false,
        express: app
    });

app.set("views", viewPath);
app.set("view engine", "html");
app.use(`/${config.urlPrefix}/static`, express.static("dist/static"));
env.addGlobal("CSS_URL", `/${config.urlPrefix}/static/app.css`);

app.use(cookieParser());

app.use(session({
    name: config.session.cookieName,
    secret: config.session.cookieSecret,
    genid: function(req) { return genuuid(); },
    cookie: { 
        secure: true,
        expires: new Date(Date.now() + 3600000),
        httpOnly: true,
        domain: config.session.cookieDomain
    },
    store: new Redis(`redis://${config.session.cacheServer}`),
    resave: false,
    saveUninitialized: true,
}));
// app.use(`/${config.urlPrefix}`, SigninRouter.create());

app.use(authenticationMiddleware());
app.use(`/${config.urlPrefix}`, BarcodeSearchRouter.create());
app.use(createLoggerMiddleware(config.applicationNamespace));

app.listen(config.port, function () {
    logger.info(`Server started on port ${config.port}`);
});