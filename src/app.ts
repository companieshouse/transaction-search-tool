import express from "express";
import { createLogger, createLoggerMiddleware } from "ch-structured-logging";
import * as nunjucks from "nunjucks";
import config from "./config";
import path from "path";

import BarcodeSearchRouter from "./routes/BarcodeSearchRouter";

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
env.addGlobal("CSS_URL", "/static/app.css");

app.use(`/${config.urlPrefix}`, BarcodeSearchRouter.create());
app.use(createLoggerMiddleware(config.applicationNamespace));

app.listen(config.port, function () {
    logger.info(`Server started on port ${config.port}`);
});