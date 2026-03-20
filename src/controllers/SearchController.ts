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
        const searchTerm = req.query.search;
        let resultsMap: Map<string,DocumentOverviewModel> = new Map();

        try {
            resultsMap = await this.companyNumberSearchHandler.searchCompanyNumber(searchTerm);
            const barcodeSearchResult = await this.barcodeSearchHandler.searchBarcode(searchTerm);
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
            const models = this.getModelsAsArray(resultsMap);
            if(resultsMap.size === 1) {
                const barcode = resultsMap.keys().next().value;
                const timelineModel = await this.barcodeSearchHandler.getTimelineResult(barcode, resultsMap.values().next().value);
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

    private getModelsAsArray(resultsMap:Map<string,DocumentOverviewModel>): object[] {
        const models: object[] = [];
        for(const model of resultsMap.values()) {
            models.push(model.getModel());
        }
        return models;
    }

}

export default SearchController;