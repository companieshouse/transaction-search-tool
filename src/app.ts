import express from "express";
import { createLogger, createLoggerMiddleware } from "@companieshouse/structured-logging-node";
import * as nunjucks from "nunjucks";
import config from "./config";
import path from "path";

import SearchRouter from "./routes/SearchRouter";
import authenticationMiddleware from "./controllers/Authentication";
import HealthCheckRouter from "./routes/HealthCheckRouter";
import cookieParser from "cookie-parser";
import { createSessionMiddleware } from "./middleware/session_middleware";
import helmet from "helmet";
import { SessionStore } from "@companieshouse/node-session-handler";
import { createCsrfProtectionMiddleware, csrfErrorHandler } from "./middleware/csrf_middleware";
import Redis from "ioredis";

export const app = express();
const logger = createLogger(config.applicationNamespace);

const sessionStore = new SessionStore(new Redis(`redis://${config.session.cacheServer}`));
const sessionMiddleware = createSessionMiddleware(sessionStore);
const csrfProtectionMiddleware = createCsrfProtectionMiddleware(sessionStore);

const viewPath = path.join(__dirname, "views");

var env = nunjucks
    .configure([
        viewPath,
        "node_modules/govuk-frontend/",
        "node_modules/govuk-frontend/components",
        "node_modules/@companieshouse/",
    ], {
        autoescape: true,
        noCache: false,
        express: app
    });

app.set("views", viewPath);
app.set("view engine", "html");

app.use(cookieParser());
app.use(sessionMiddleware);
app.use(csrfProtectionMiddleware);
app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        fontSrc: ["'self'", 'https:', 'data:', config.cdnUrl],
        imgSrc: ["'self'", 'data:', config.cdnUrl],
        styleSrc: ["'self'", 'https:', "'unsafe-inline'", config.cdnUrl],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          config.cdnUrl
        ],
        objectSrc: ["'none'"]
      }
    }
  }));

app.use(express.urlencoded({ extended: true }));
env.addGlobal("CDN_URL", config.cdnUrl);
app.use(`/${config.urlPrefix}`, HealthCheckRouter.create());

app.use(authenticationMiddleware());
app.use(`/${config.urlPrefix}`, SearchRouter.create());
app.use(createLoggerMiddleware(config.applicationNamespace));
app.use(`/${config.urlPrefix}/static`, express.static("dist/app/static"));
env.addGlobal("CSS_URL", `/${config.urlPrefix}/static/app.css`);
app.use(csrfErrorHandler);

app.set('engine', env);

const oracledb = require("oracledb");

// This example runs in both node-oracledb Thin and Thick modes.
//
// Optionally run in node-oracledb Thick mode
if (process.env.NODE_ORACLEDB_DRIVER_MODE === 'thick') {

    // Thick mode requires Oracle Client or Oracle Instant Client libraries.
    // On Windows and macOS Intel you can specify the directory containing the
    // libraries at runtime or before Node.js starts.  On other platforms (where
    // Oracle libraries are available) the system library search path must always
    // include the Oracle library path before Node.js starts.  If the search path
    // is not correct, you will get a DPI-1047 error.  See the node-oracledb
    // installation documentation.
    let clientOpts = {};
    if (process.platform === 'win32') {                                   // Windows
        clientOpts = { libDir: 'C:\\oracle\\instantclient_19_17' };
    } else if (process.platform === 'darwin' && process.arch === 'x64') { // macOS Intel
        clientOpts = { libDir: process.env.HOME + '/Downloads/instantclient_19_8' };
    }
    oracledb.initOracleClient(clientOpts);  // enable node-oracledb Thick mode
}

app.listen(config.port, function () {
    logger.info(`Server started on port ${config.port}`);
});
