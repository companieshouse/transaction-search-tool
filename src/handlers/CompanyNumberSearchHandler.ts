import StaffwareResult from "../data/StaffwareResult";
import StaffwareService from "../service/StaffwareService";
import config from "../config";
import { createLogger } from "@companieshouse/structured-logging-node";
import ChipsService from "../service/ChipsService";
import ChipsResult from "../data/ChipsResult";
import FesService from "../service/FesService";
import FesResult from "../data/FesResult";
import DocumentOverviewModel from "../models/DocumentOverviewModel";
import { errorHandler } from "../utils/ErrorHandler";

const logger = createLogger(config.applicationNamespace);

class CompanyNumberSearchHandler {

    chipsService: ChipsService;
    swService: StaffwareService;
    fesService: FesService;

    constructor() {
        this.chipsService = new ChipsService();
        this.swService = new StaffwareService();
        this.fesService = new FesService();
    }

    public async searchCompanyNumber(searchTerm: string): Promise<Map<string, DocumentOverviewModel>> {
        var resultsMap: Map<string,DocumentOverviewModel> = new Map();
        var chipsResults: ChipsResult[] = [];
        var fesResults: FesResult[] = [];

        try {
            chipsResults = await this.chipsService.getTransactionDetailsFromCompanyNumber(searchTerm);
            fesResults = await this.fesService.getTransactionDetailsFromCompanyNumber(searchTerm);
        } catch(err) {
            errorHandler.handleError(this.constructor.name, "searchCompanyNumber", err);
            return resultsMap;
        }

        chipsResults = await this.getStaffwareEntries(chipsResults);
        resultsMap = this.buildResultsMap(chipsResults,fesResults);
        logger.info(`Search term: ${searchTerm}, returned ${JSON.stringify(resultsMap.size)} results for company number search`);
        return resultsMap;
    }

    private async getStaffwareEntries(chipsResults: ChipsResult[]): Promise<ChipsResult[]> {
        for (let chipsResult of chipsResults) {
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
        }
        return chipsResults;
    }

    private buildResultsMap(chipsResults:ChipsResult[], fesResults:FesResult[]): Map<string,DocumentOverviewModel> {
        var resultMap:Map<string,DocumentOverviewModel> = new Map();
        chipsResults.forEach(chipsResult=> {
            let model = new DocumentOverviewModel();
            model = this.populateModel(chipsResult, model);
            resultMap.set(chipsResult.barcode, model);
        });
        fesResults.forEach(fesResult => {
            let model = new DocumentOverviewModel(); 
            if(resultMap.has(fesResult.barcode)) {
                model = resultMap.get(fesResult.barcode) as DocumentOverviewModel;
            }
            model = this.populateModel(fesResult, model);
            resultMap.set(fesResult.barcode, model);
        });
        return resultMap;
    }

    private populateModel(result: Object, model: DocumentOverviewModel): DocumentOverviewModel {
        if(result instanceof ChipsResult || result instanceof FesResult) {
            Object.keys(result).forEach(key=>{
                    model[key] = result[key];
            });
            if (model.status == undefined) model.status = result['chipsStatus'] || result['fesStatus'];
        }
        return model;
    }

}

export default CompanyNumberSearchHandler;