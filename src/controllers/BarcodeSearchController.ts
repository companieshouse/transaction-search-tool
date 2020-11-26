import { Request, Response } from "express";
import SqlData from "../sql/SqlData";
import ChipsDao from "../daos/CHIPS/ChipsDao";
import SearchResult from "../models/SearchResult";
import StaffwareService from "../service/StaffwareService";
import config from "../config";
import { createLogger } from "ch-structured-logging";
import ChipsService from "../service/ChipsService";

const logger = createLogger(config.applicationNamespace);

class BarcodeSearchController {

    public static getSearchPage(req: any, res: any) {
        res.render("barcodeSearch");
    }

    public static async searchBarcode(req: any, res: any) {
        var barcode = req.query.search;
        var searchResult = new SearchResult();
        var chipsDao = new ChipsDao();
        var swService = new StaffwareService();
        var chipsService = new ChipsService();
        var chipsSearch = await chipsDao.makeQuery(SqlData.transactionSQL, [barcode]);
        searchResult.transactionId = chipsSearch.rows[0]['TRANSACTION_ID'];
        searchResult.formBarcode = barcode;
        searchResult.incorporationNumber = chipsSearch.rows[0]['INCORPORATION_NUMBER'];
        searchResult.chipsStatus = chipsSearch.rows[0]['TRANSACTION_STATUS_DESC'];
        searchResult.documentId = chipsSearch.rows[0]['INPUT_DOCUMENT_ID'];
        searchResult.orgUnit = await swService.getOrgUnit(searchResult.documentId);
        searchResult.user = await chipsService.getUserFromId(chipsSearch.rows[0]['USER_ACCESS_ID']);
        logger.info(`Barcode searched: ${barcode}, result: ${searchResult.toString()}`);
        res.render("barcodeSearch", {
            barcode: barcode,
            result: searchResult.getResult()
        });
    }

}

export default BarcodeSearchController;