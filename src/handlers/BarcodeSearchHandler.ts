import StaffwareResult from "../data/StaffwareResult";
import StaffwareService from "../service/StaffwareService";
import config from "../config";
import { createLogger } from "@companieshouse/structured-logging-node";
import ChipsService from "../service/ChipsService";
import ChipsResult from "../data/ChipsResult";
import FesService from "../service/FesService";
import FesResult from "../data/FesResult";
import DocumentOverviewModel from "../models/DocumentOverviewModel";
import TimelineModel from "../models/TimelineModel";
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
                    chipsResult.casenum = staffwareResult.casenum;
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
        model.casenum = chipsResult.casenum;
        return model;
    }

    private createTimelineModel(fesResult: FesResult): TimelineModel {
        var model = new TimelineModel();
        model.date = this.splitDateAndTime(fesResult.eventOccurredTime);
        model.event = fesResult.eventText;
        model.location = "FES";
        model.userLogin = fesResult.userLogin;

        return model;
    }

    private buildTimelineModelsArray(fesResults: FesResult[], docModel: DocumentOverviewModel, swResult: StaffwareResult): Object[] {
        var models: Object[] = [];

        for(let result of fesResults) {
            let model = this.createTimelineModel(result);
            models.push(model.getModel());
        }

        var chipsEntry = new TimelineModel();
        chipsEntry.date = this.splitDateAndTime(docModel.transactionDate);
        chipsEntry.event = docModel.chipsStatus;
        chipsEntry.location = docModel.orgUnit;
        chipsEntry.userLogin = docModel.userLogin;

        var swEntry = new TimelineModel();
        swEntry.date = this.splitDateAndTime(swResult.date);
        swEntry.event = "Arrived in Staffware";
        swEntry.location = "Staffware";
        swEntry.userLogin = "User";

        if (docModel.transactionId != undefined) {
            models.push(chipsEntry.getModel());
        }

        if (swResult.date != undefined) {
            models.push(swEntry.getModel());
        }

        return models;
    }

    public async getTimelineResult(barcode: string, docModel: DocumentOverviewModel): Promise<Object[]> {

        var fesTimelineResults: FesResult[];
        var timelineModel: Object[] = [];
        var staffwareResult: StaffwareResult;

        try {
            fesTimelineResults = await this.fesService.getFesTimelineDetails(barcode);
            staffwareResult = docModel.casenum ? await this.swService.getAuditDate(docModel.casenum) : new StaffwareResult();
        } catch(err) {
            errorHandler.handleError(this.constructor.name, "getTimelineResult", err);
            return timelineModel;
        }

        timelineModel = this.buildTimelineModelsArray(fesTimelineResults, docModel, staffwareResult);

        return timelineModel;
    }

    private splitDateAndTime(str: string) {
        if (!str) return str;
        const strArr = str.split(" ");
        str = strArr[0] + (strArr[1] ? " at " + strArr[1] : "");
        str = str.replace(/-/g," ");
        return str;
    }

}

export default BarcodeSearchHandler;