import StaffwareService from "../service/StaffwareService";
import config from "../config";
import { createLogger } from "ch-structured-logging";
import ChipsService from "../service/ChipsService";
import BarcodeSearchModel from "../models/BarcodeSearchModel";
import ChipsResult from "../data/ChipsResult";

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
        var chipsResult = await this.chipsService.getTransactionDetailsFromBarcode(barcode);
        var staffwareResult = await this.swService.addStaffwareData(chipsResult.documentId);
        var orgUnit = await this.chipsService.getOrgUnitFromId(staffwareResult.orgUnitId);
        var userLogin = await this.chipsService.getUserFromId(staffwareResult.userId);
        var model = this.createModel(barcode, chipsResult, orgUnit, userLogin);
        logger.info(`Barcode searched: ${barcode}, result: ${model.toString()}`);
        res.render("barcodeSearch", {
            barcode: barcode,
            result: model.getModel()
        });
    }

    private createModel(barcode: string, chipsResult: ChipsResult, orgUnit: string, userLogin: string): BarcodeSearchModel {
        var model = new BarcodeSearchModel();
        model.formBarcode = barcode;
        model.documentId = chipsResult.documentId;
        model.chipsStatus = chipsResult.chipsStatus;
        model.transactionId = chipsResult.transactionId;
        model.incorporationNumber = chipsResult.incorporationNumber;
        model.orgUnit = orgUnit;
        model.user = userLogin;
        return model;
    }

}

export default BarcodeSearchController;