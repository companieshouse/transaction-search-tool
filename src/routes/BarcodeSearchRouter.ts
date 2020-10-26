import BarcodeSearchController from '../controllers/BarcodeSearchController';
import * as express from "express";

class BarcodeSearchRouter {

    public static create() {
        const router = express.Router();

        router.get("/", BarcodeSearchController.getSearchPage);
        router.get("/search", BarcodeSearchController.searchBarcode);

        return router;
    }

}

export default BarcodeSearchRouter;