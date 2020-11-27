import StaffwareService from "../service/StaffwareService";
import config from "../config";
import { createLogger } from "ch-structured-logging";
import ChipsService from "../service/ChipsService";

const logger = createLogger(config.applicationNamespace);

class BarcodeSearchController {

    chipsService: ChipsService;
    swService: StaffwareService;

    constructor() {
        this.chipsService = new ChipsService();
        this.swService = new StaffwareService();
    }

    public getSearchPage(req: any, res: any) {
        res.render("barcodeSearch");
    }

    public async searchBarcode(req: any, res: any) {
        var barcode = req.query.search;
        var searchResult = await this.chipsService.getTransactionDetailsFromBarcode(barcode);
        searchResult = await this.swService.addStaffwareData(searchResult);
        logger.info(`Barcode searched: ${barcode}, result: ${searchResult.toString()}`);
        res.render("barcodeSearch", {
            barcode: barcode,
            result: searchResult.getResult()
        });
    }

}

export default BarcodeSearchController;