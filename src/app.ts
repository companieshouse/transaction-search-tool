import express from "express";
import { createLogger, createLoggerMiddleware } from "ch-structured-logging";
import * as nunjucks from "nunjucks";
import config from "./config";
import path from "path";

import SearchRouter from "./routes/SearchRouter";
import authenticationMiddleware from "./controllers/Authentication";
import SigninRouter from "./routes/SigninRouter";
import cookieParser from "cookie-parser";
import getSessionMiddleware from "./utils/SessionHelper";
import helmet from "helmet";

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

app.use(cookieParser());
app.use(getSessionMiddleware());
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
app.use(`/${config.urlPrefix}`, SigninRouter.create());

app.use(authenticationMiddleware());
app.use(`/${config.urlPrefix}`, SearchRouter.create());
app.use(createLoggerMiddleware(config.applicationNamespace));
app.use(`/${config.urlPrefix}/static`, express.static("dist/app/static"));
env.addGlobal("CSS_URL", `/${config.urlPrefix}/static/app.css`);

app.set('engine', env);

app.listen(config.port, function () {
    logger.info(`Server started on port ${config.port}`);
});