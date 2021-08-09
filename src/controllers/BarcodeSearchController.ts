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

class BarcodeSearchController {

    chipsService: ChipsService;
    swService: StaffwareService;
    fesService: FesService;

    constructor() {
        this.chipsService = new ChipsService();
        this.swService = new StaffwareService();
        this.fesService = new FesService();
    }

    public getSearchPage(req: any, res: any) {
        res.render("barcodeSearch");
    }

    public async searchBarcode(req: any, res: any) {
        var searchTerm = req.query.search;
        var resultsMap: Map<String,DocumentOverviewModel> = new Map();
        var chipsResults: ChipsResult[] = [];
        var fesResults: FesResult[] = [];

        try {
            let chipsResult = await this.chipsService.getTransactionDetailsFromBarcode(searchTerm);
            let fesResult = await this.fesService.getTransactionDetailsFromBarcode(searchTerm);
            chipsResults = await this.chipsService.getTransactionDetailsFromCompanyNumber(searchTerm);
            fesResults = await this.fesService.getTransactionDetailsFromCompanyNumber(searchTerm);
            if (!chipsResult.isEmpty()) chipsResults.push(chipsResult);
            if (!fesResult.isEmpty()) fesResults.push(fesResult);
        } catch(err) {
            errorHandler.handleError(this.constructor.name, "searchBarcode", err, res);
            return;
        }

        chipsResults = await this.getStaffwareEntries(chipsResults);
        resultsMap = this.buildResultsMap(chipsResults,fesResults);

        logger.info("resultsMap size is: " + resultsMap.size);

        if (!resultsMap.entries()) {
            res.render("barcodeSearch", {
                barcode: searchTerm,
                error: true
            });
        } else if(resultsMap.size === 1) {
            var models = this.getModelsAsArray(resultsMap);
            logger.info(`Search term: ${searchTerm}, returned result: ${JSON.stringify(models)}`);

            res.render("documentOverview", {
                barcode: searchTerm,
                model: models[0]
            });
        } else {
            var models = this.getModelsAsArray(resultsMap);
            logger.info(`Search term: ${searchTerm}, returned result: ${JSON.stringify(models)}`);

            res.render("resultsPage", {
                searchTerm: searchTerm,
                models: models
            });
        }
    }

    private async getStaffwareEntries(chipsResults: ChipsResult[]): Promise<ChipsResult[]> {
        for(let i=0; i<chipsResults.length; i++) {
            if (chipsResults[i].documentId != undefined) {
                try {
                    var staffwareResult: StaffwareResult;
                    staffwareResult = await this.swService.addStaffwareData(chipsResults[i].documentId);

                    var orgUnitId = staffwareResult.orgUnitId || chipsResults[i].orgUnitId;
                    let orgUnit = await this.chipsService.getOrgUnitFromId(orgUnitId);

                    var userId = staffwareResult.userId || chipsResults[i].userAccessId;
                    let userLogin = await this.chipsService.getUserFromId(userId);
                    chipsResults[i].orgUnit = orgUnit;
                    chipsResults[i].userLogin = userLogin;
                } catch(err) {
                    errorHandler.handleError(this.constructor.name, "getStaffwareEntries", err);
                }
                
            }
        }
        return chipsResults;
    }

    private buildResultsMap(chipsResults:ChipsResult[], fesResults:FesResult[]): Map<String,DocumentOverviewModel> {
        var resultMap:Map<String,DocumentOverviewModel> = new Map();
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

    private getModelsAsArray(resultsMap:Map<String,DocumentOverviewModel>): Object[] {
        var models: Object[] = [];
        for(let model of resultsMap.values()) {
            models.push(model.getModel());
        }
        return models;
    }

    private populateModel(result: Object, model: DocumentOverviewModel): DocumentOverviewModel {
        if(result instanceof ChipsResult || result instanceof FesResult) {
            Object.keys(result).forEach(key=>{
                    model[key] = result[key];
            });
        }
        return model;
    }

}

export default BarcodeSearchController;