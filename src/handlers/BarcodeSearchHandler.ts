import StaffwareResult from "../data/StaffwareResult";
import StaffwareService from "../service/StaffwareService";
import config from "../config";
import { createLogger } from "ch-structured-logging";
import ChipsService from "../service/ChipsService";
import ChipsResult from "../data/ChipsResult";
import FesService from "../service/FesService";
import FesResult from "../data/FesResult";
import DocumentOverviewModel from "../models/DocumentOverviewModel";
import { errorHandler } from "../utils/ErrorHandler";

const logger = createLogger(config.applicationNamespace);

class BarcodeSearchHandler {

    chipsService: ChipsService;
    swService: StaffwareService;
    fesService: FesService;

    constructor() {
        this.chipsService = new ChipsService();
        this.swService = new StaffwareService();
        this.fesService = new FesService();
    }

    public async searchBarcode(barcode: string): Promise<DocumentOverviewModel> {
        var chipsResult, fesResult;
        var model = new DocumentOverviewModel();

        try {
            chipsResult = await this.chipsService.getTransactionDetailsFromBarcode(barcode);
            fesResult = await this.fesService.getTransactionDetailsFromBarcode(barcode);
        } catch(err) {
            errorHandler.handleError(this.constructor.name, "searchBarcode", err);
            return model;
        }

        chipsResult = await this.getStaffwareEntries(chipsResult);
        if (!chipsResult.isEmpty() || !fesResult.isEmpty()) {
            model = this.createModel(barcode, chipsResult, fesResult);
            logger.info(`Search term: ${barcode}, returned result: ${JSON.stringify(model)} for barcode search`);
        }
        return model;
    }

    private async getStaffwareEntries(chipsResult: ChipsResult): Promise<ChipsResult> {
            if (chipsResult.documentId != undefined) {
                try {
                    var staffwareResult: StaffwareResult;
                    staffwareResult = await this.swService.addStaffwareData(chipsResult.documentId);

                    var orgUnitId = staffwareResult.orgUnitId || chipsResult.orgUnitId;
                    let orgUnit = await this.chipsService.getOrgUnitFromId(orgUnitId);

                    var userId = staffwareResult.userId || chipsResult.userAccessId;
                    let userLogin = await this.chipsService.getUserFromId(userId);
                    chipsResult.orgUnit = orgUnit;
                    chipsResult.userLogin = userLogin;
                } catch(err) {
                    errorHandler.handleError(this.constructor.name, "getStaffwareEntries", err);
                }
                
            }
        return chipsResult;
    }

    private createModel(barcode: string, chipsResult: ChipsResult, fesResult: FesResult): DocumentOverviewModel {
        var model = new DocumentOverviewModel();
        model.formBarcode = barcode;
        model.status = chipsResult.chipsStatus || fesResult.fesStatus;
        model.documentId = chipsResult.documentId;
        model.chipsStatus = chipsResult.chipsStatus;
        model.transactionId = chipsResult.transactionId;
        model.incorporationNumber = chipsResult.incorporationNumber;
        model.transactionDate = chipsResult.transactionDate;
        model.formType = fesResult.formType;
        model.orgUnit = chipsResult.orgUnit;
        model.userLogin = chipsResult.userLogin;
        model.envNo = fesResult.envNo;
        model.batchName = fesResult.batchName;
        model.scanTime = fesResult.scanTime;
        model.fesStatus = fesResult.fesStatus;
        model.icoReturnedReason = fesResult.icoReturnedReason;
        model.icoAction = fesResult.icoAction;
        model.eventOccurredTime = fesResult.eventOccurredTime;
        model.eventText = fesResult.eventText;
        return model;
    }

}

export default BarcodeSearchHandler;