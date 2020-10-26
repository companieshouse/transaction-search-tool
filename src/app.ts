import * as express from "express";
import * as nunjucks from "nunjucks";
import * as dotenv from 'dotenv';
dotenv.config();

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

app.use('/barcodeSearch', BarcodeSearchRouter.create())

app.listen(process.env.APP_PORT, function () {
    console.log(`Server started on port ${process.env.APP_PORT}`);
});