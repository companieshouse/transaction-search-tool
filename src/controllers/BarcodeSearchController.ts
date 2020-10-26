import { Request, Response } from "express";
import SqlData from "../sql/SqlData";
import ChipsDao from "../daos/CHIPS/ChipsDao";

class BarcodeSearchController {

    public static getSearchPage(req: Request, res: Response) {
        res.render("barcodeSearch");
    }

    public static searchBarcode(req: Request, res: Response) {
        var barcode = req.query.search;
        var chipsDao = new ChipsDao();
        chipsDao.makeQuery(SqlData.transactionSQL, [barcode])
            .then(result => {
            res.render("barcodeSearch", {
                barcode: barcode,
                result: result.rows[0] 
            });
        });
    }

}

export default BarcodeSearchController;