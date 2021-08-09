import config from "../config";
import { createLogger } from "ch-structured-logging";
import DocumentOverviewModel from "../models/DocumentOverviewModel";
import { errorHandler } from "../utils/ErrorHandler";
import BarcodeSearchHandler from "../handlers/BarcodeSearchHandler";
import CompanyNumberSearchHandler from "../handlers/CompanyNumberSearchHandler";

const logger = createLogger(config.applicationNamespace);

class SearchController {

    private barcodeSearchHandler: BarcodeSearchHandler;
    private companyNumberSearchHandler: CompanyNumberSearchHandler;

    constructor() {
        this.barcodeSearchHandler = new BarcodeSearchHandler();
        this.companyNumberSearchHandler = new CompanyNumberSearchHandler();
    }

    public getSearchPage(req: any, res: any) {
        res.render("barcodeSearch");
    }

    public async searchQuery(req: any, res: any) {
        var searchTerm = req.query.search;
        var resultsMap: Map<String,DocumentOverviewModel> = new Map();

        try {
            resultsMap = await this.companyNumberSearchHandler.searchCompanyNumber(searchTerm);
            let barcodeSearchResult = await this.barcodeSearchHandler.searchBarcode(searchTerm);
            if (barcodeSearchResult != undefined) resultsMap.set(searchTerm, barcodeSearchResult);
        } catch(err) {
            errorHandler.handleError(this.constructor.name, "searchQuery", err, res);
            return;
        }

        if (resultsMap.size == 0) {
            res.render("barcodeSearch", {
                barcode: searchTerm,
                error: true
            });
        } else {
            var models = this.getModelsAsArray(resultsMap);
            logger.info(`Search term: ${searchTerm}, returned result: ${JSON.stringify(models)}`);
            if(models.length === 1) {
                res.render("documentOverview", {
                    barcode: searchTerm,
                    result: models[0]
                })
            } else {
                res.render("resultsPage", {
                    searchTerm: searchTerm,
                    results: models
                });
            }
        }
    }

    private getModelsAsArray(resultsMap:Map<String,DocumentOverviewModel>): Object[] {
        var models: Object[] = [];
        for(let model of resultsMap.values()) {
            models.push(model.getModel());
        }
        return models;
    }

}

export default SearchController;