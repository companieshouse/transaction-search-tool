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
        let chipsResult, fesResult;
        let model = new DocumentOverviewModel();

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
                    const staffwareResult: StaffwareResult = await this.swService.addStaffwareData(chipsResult.documentId);

                    const orgUnitId = staffwareResult.orgUnitId || chipsResult.orgUnitId;
                    const orgUnit = await this.chipsService.getOrgUnitFromId(orgUnitId);

                    const userId = staffwareResult.userId || chipsResult.userAccessId;
                    const userLogin = await this.chipsService.getUserFromId(userId);
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
        const model = new DocumentOverviewModel();
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
        const model = new TimelineModel();
        model.date = this.splitDateAndTime(fesResult.eventOccurredTime);
        model.event = fesResult.eventText;
        model.location = "FES";
        model.userLogin = fesResult.userLogin;

        return model;
    }

    private buildTimelineModelsArray(fesResults: FesResult[], docModel: DocumentOverviewModel, swResult: StaffwareResult): object[] {
        const models: object[] = [];

        for(const result of fesResults) {
            const model = this.createTimelineModel(result);
            models.push(model.getModel());
        }

        const chipsEntry = new TimelineModel();
        chipsEntry.date = this.splitDateAndTime(docModel.transactionDate);
        chipsEntry.event = docModel.chipsStatus;
        chipsEntry.location = docModel.orgUnit;
        chipsEntry.userLogin = docModel.userLogin;

        const swEntry = new TimelineModel();
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

    public async getTimelineResult(barcode: string, docModel: DocumentOverviewModel): Promise<object[]> {

        let fesTimelineResults: FesResult[];
        let timelineModel: object[] = [];
        let staffwareResult: StaffwareResult;

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
