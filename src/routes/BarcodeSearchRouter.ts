import BarcodeSearchController from '../controllers/BarcodeSearchController';
import * as express from "express";

class BarcodeSearchRouter {

    public static create() {
        const router = express.Router();

        var barcodeSearchController = new BarcodeSearchController();

        router.get("/", (req, res) => barcodeSearchController.getSearchPage(req, res));
        router.get("/search", (req, res) => barcodeSearchController.searchBarcode(req, res));

        return router;
    }

}

export default BarcodeSearchRouter;