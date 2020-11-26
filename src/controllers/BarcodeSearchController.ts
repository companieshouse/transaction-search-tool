import { Request, Response } from "express";
import SqlData from "../sql/SqlData";
import ChipsDao from "../daos/CHIPS/ChipsDao";

class BarcodeSearchController {

    public static getSearchPage(req: any, res: any) {
        res.render("barcodeSearch");
    }

    public static searchBarcode(req: any, res: any) {
        var barcode = req.query.search;
        var chipsDao = new ChipsDao();
        return chipsDao.makeQuery(SqlData.transactionSQL, [barcode])
            .then(result => {
            res.render("barcodeSearch", {
                barcode: barcode,
                result: result.rows[0] 
            });
        });
    }

}

export default BarcodeSearchController;