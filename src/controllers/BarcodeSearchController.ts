import { Request, Response } from "express";
import SqlData from "../sql/SqlData";
import ChipsDao from "../daos/CHIPS/ChipsDao";
import SearchResult from "../models/SearchResult";
import StaffwareService from "../service/StaffwareService";
import config from "../config";
import { createLogger } from "ch-structured-logging";

const logger = createLogger(config.applicationNamespace);

class BarcodeSearchController {

    public static getSearchPage(req: Request, res: Response) {
        res.render("barcodeSearch");
    }

    public static async searchBarcode(req: Request, res: Response) {
        var barcode = req.query.search;
        var searchResult = new SearchResult();
        var chipsDao = new ChipsDao();
        var swService = new StaffwareService();
        var chipsSearch = await chipsDao.makeQuery(SqlData.transactionSQL, [barcode]);
        searchResult.transactionId = chipsSearch.rows[0]['TRANSACTION_ID'];
        searchResult.documentId = chipsSearch.rows[0]['INPUT_DOCUMENT_ID'];
        searchResult.orgUnit = await swService.getOrgUnit(searchResult.documentId);
        logger.info(`Barcode searched: ${barcode}, result: ${searchResult.toString()}`);
        res.render("barcodeSearch", {
            barcode: barcode,
            result: searchResult.getResult()
        });
    }

}

export default BarcodeSearchController;