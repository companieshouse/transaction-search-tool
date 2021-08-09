import SearchController from '../controllers/SearchController';
import * as express from "express";

class BarcodeSearchRouter {

    public static create() {
        const router = express.Router();

        var searchController = new SearchController();

        router.get("/", (req, res) => searchController.getSearchPage(req, res));
        router.get("/barcodeSearch", (req, res) => searchController.getSearchPage(req, res));
        router.get("/search", (req, res) => searchController.searchQuery(req, res));

        return router;
    }

}

export default BarcodeSearchRouter;