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
        let resultsMap: Map<string,DocumentOverviewModel> = new Map();
        let chipsResults: ChipsResult[];
        let fesResults: FesResult[];

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
        for(const result of chipsResults) {
            if (result.documentId != undefined) {
                try {
                    const staffwareResult: StaffwareResult = await this.swService.addStaffwareData(result.documentId);

                    const orgUnitId = staffwareResult.orgUnitId || result.orgUnitId;
                    const orgUnit = await this.chipsService.getOrgUnitFromId(orgUnitId);

                    const userId = staffwareResult.userId || result.userAccessId;
                    const userLogin = await this.chipsService.getUserFromId(userId);
                    result.orgUnit = orgUnit;
                    result.userLogin = userLogin;
                } catch(err) {
                    errorHandler.handleError(this.constructor.name, "getStaffwareEntries", err);
                }

            }
        }
        return chipsResults;
    }

    private buildResultsMap(chipsResults:ChipsResult[], fesResults:FesResult[]): Map<string,DocumentOverviewModel> {
        const resultMap:Map<string,DocumentOverviewModel> = new Map();
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

    private populateModel(result: object, model: DocumentOverviewModel): DocumentOverviewModel {
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
