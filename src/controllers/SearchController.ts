import DocumentOverviewModel from "../models/DocumentOverviewModel";
import { errorHandler } from "../utils/ErrorHandler";
import BarcodeSearchHandler from "../handlers/BarcodeSearchHandler";
import CompanyNumberSearchHandler from "../handlers/CompanyNumberSearchHandler";

class SearchController {

    barcodeSearchHandler: BarcodeSearchHandler;
    companyNumberSearchHandler: CompanyNumberSearchHandler;

    constructor() {
        this.barcodeSearchHandler = new BarcodeSearchHandler();
        this.companyNumberSearchHandler = new CompanyNumberSearchHandler();
    }

    public getSearchPage(req: any, res: any) {
        res.render("search");
    }

    public async searchQuery(req: any, res: any) {
        var searchTerm = req.query.search;
        var resultsMap: Map<string,DocumentOverviewModel>;

        try {
            resultsMap = await this.companyNumberSearchHandler.searchCompanyNumber(searchTerm);
            let barcodeSearchResult = await this.barcodeSearchHandler.searchBarcode(searchTerm);
            if (!barcodeSearchResult.isEmpty()) resultsMap.set(searchTerm, barcodeSearchResult);
        } catch(err) {
            errorHandler.handleError(this.constructor.name, "searchQuery", err, res);
            return;
        }

        if (resultsMap.size === 0) {
            res.render("search", {
                barcode: searchTerm,
                error: true
            });
        } else {
            var models = this.getModelsAsArray(resultsMap);
            if(resultsMap.size === 1) {
                var barcode = resultsMap.keys().next().value;
                var timelineModel = await this.barcodeSearchHandler.getTimelineResult(barcode, resultsMap.values().next().value);
                res.render("documentOverview", {
                    barcode: barcode,
                    result: models[0],
                    timeline: timelineModel
                })
            } else {
                res.render("resultsPage", {
                    searchTerm: searchTerm,
                    results: models
                });
            }
        }
    }

    private getModelsAsArray(resultsMap:Map<string,DocumentOverviewModel>): Object[] {
        var models: Object[] = [];
        for(let model of resultsMap.values()) {
            models.push(model.getModel());
        }
        return models;
    }

}

export default SearchController;