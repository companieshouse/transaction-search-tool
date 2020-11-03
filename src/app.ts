import * as express from "express";
import * as nunjucks from "nunjucks";
import config from "./config";

import BarcodeSearchRouter from "./routes/BarcodeSearchRouter";

const app = express();

var env = nunjucks
    .configure([
        "src/views",  
        "node_modules/govuk-frontend/",
        "node_modules/govuk-frontend/components",
    ], {
        autoescape: true,
        noCache: false,
        express: app
    });

app.set("views", "src/views");
app.set("view engine", "html");

app.use("/static", express.static("dist/static"));
env.addGlobal("CSS_URL", "/static/app.css");

app.use(`/${config.urlPrefix}/`, BarcodeSearchRouter.create())

app.listen(config.port, function () {
    console.log(`Server started on port ${config.port}`);
});