import chai from 'chai';
import sinon, { SinonStub } from 'sinon';
import BarcodeSearchHandler from '../../handlers/BarcodeSearchHandler';
import CompanyNumberSearchHandler from '../../handlers/CompanyNumberSearchHandler';
import DocumentOverviewModel from '../../models/DocumentOverviewModel';
import SearchController from '../../controllers/SearchController';
chai.use(require('sinon-chai'));

describe('search bar controller', ()=>{

    const req = {
        query: {
            search: 'barcode'
        }
    }

    const req2 = {
        query: {
            search: 'barcode1'
        }
    }

    const res = {
        status: () => {},
        render: sinon.spy(),
    };

    var searchController: SearchController;

    var model:DocumentOverviewModel;

    before(()=>{
        searchController = new SearchController();

        var barcodeSearchHandler = new BarcodeSearchHandler();
        var companyNumberSearchHandler = new CompanyNumberSearchHandler();

        model = new DocumentOverviewModel();
        model.barcode = "barcode";
        model.transactionId = 1;
        model.incorporationNumber = "inco";
        model.status = "Pending";
        model.documentId = 1;
        model.envNo = 1;
        model.batchName = "Batch Name";
        model.scanTime = "01/12/2020";
        model.icoReturnedReason = "Not Returned";
        model.icoAction = "No Action Required";
        model.eventOccurredTime = "No exception occurred";
        model.eventText = "No exception occurred";
        model.transactionDate = "01/12/2020";
        model.chipsStatus = "Pending";
        model.fesStatus = "Sent to CHIPS";
        model.orgUnit = "My Org Unit";
        model.formType = "IN01";
        model.user = "No user allocated";


        let resultMap: Map<String,DocumentOverviewModel> = new Map();
        let resultMapEmpty: Map<String,DocumentOverviewModel> = new Map();
        resultMap.set("barcode2", model);
        resultMap.set("barcode3", model);

        var barcodeSearchStub = sinon.stub(barcodeSearchHandler, 'searchBarcode');
        var companyNumbStub = sinon.stub(companyNumberSearchHandler, 'searchCompanyNumber');
        barcodeSearchStub.withArgs("barcode").resolves(model);
        companyNumbStub.withArgs("barcode").resolves(resultMapEmpty);
        barcodeSearchStub.withArgs("barcode1").resolves(model);
        companyNumbStub.withArgs("barcode1").resolves(resultMap);


        searchController.barcodeSearchHandler = barcodeSearchHandler;
        searchController.companyNumberSearchHandler = companyNumberSearchHandler;
    })

    it('test getSearchPage calls response render', ()=>{
        searchController.getSearchPage(req, res);
        chai.expect(res.render.calledOnce).to.be.true;
    })

    it('test search renders documentOverview page when single result is returned', async ()=>{

        const expectedRender = {
            barcode: 'barcode',
            result: {
                "Barcode" : "barcode",
                "Status" : "Pending",
                "User" : "No user allocated",
                "CoNumb" : "inco",
                "Type" : "IN01",
                "ChipsStatus" : "Pending",
                "FESStatus" : "Sent to CHIPS",
                "Location" : "My Org Unit",
                "TransactionId" : 1,
                "DocumentId" : 1,
                "EnvNo" : 1,
                "BatchName" : "Batch Name",
                "ScanTime": "01/12/2020",
                "ICOReturnedReason" :"Not Returned",
                "ICOAction" : "No Action Required",
                "eventOccurredTime" : "No exception occurred",
                "eventText" : "No exception occurred",
                "TransactionDate" : "01/12/2020"
            }
        }
        await searchController.searchQuery(req, res);
        chai.expect(res.render.calledWithMatch("documentOverview", expectedRender)).to.be.true;
    }).timeout(5000)

    it('test search renders results page when multiple results are returned', async ()=>{

        const expectedRender = {
            searchTerm: 'barcode1',
            results: [{
                "Barcode" : "barcode",
                "Status" : "Pending",
                "User" : "No user allocated",
                "CoNumb" : "inco",
                "Type" : "IN01",
                "ChipsStatus" : "Pending",
                "FESStatus" : "Sent to CHIPS",
                "Location" : "My Org Unit",
                "TransactionId" : 1,
                "DocumentId" : 1,
                "EnvNo" : 1,
                "BatchName" : "Batch Name",
                "ScanTime": "01/12/2020",
                "ICOReturnedReason" :"Not Returned",
                "ICOAction" : "No Action Required",
                "eventOccurredTime" : "No exception occurred",
                "eventText" : "No exception occurred",
                "TransactionDate" : "01/12/2020"
            }, {
                "Barcode" : "barcode",
                "Status" : "Pending",
                "User" : "No user allocated",
                "CoNumb" : "inco",
                "Type" : "IN01",
                "ChipsStatus" : "Pending",
                "FESStatus" : "Sent to CHIPS",
                "Location" : "My Org Unit",
                "TransactionId" : 1,
                "DocumentId" : 1,
                "EnvNo" : 1,
                "BatchName" : "Batch Name",
                "ScanTime": "01/12/2020",
                "ICOReturnedReason" :"Not Returned",
                "ICOAction" : "No Action Required",
                "eventOccurredTime" : "No exception occurred",
                "eventText" : "No exception occurred",
                "TransactionDate" : "01/12/2020"
            },{
                "Barcode" : "barcode",
                "Status" : "Pending",
                "User" : "No user allocated",
                "CoNumb" : "inco",
                "Type" : "IN01",
                "ChipsStatus" : "Pending",
                "FESStatus" : "Sent to CHIPS",
                "Location" : "My Org Unit",
                "TransactionId" : 1,
                "DocumentId" : 1,
                "EnvNo" : 1,
                "BatchName" : "Batch Name",
                "ScanTime": "01/12/2020",
                "ICOReturnedReason" :"Not Returned",
                "ICOAction" : "No Action Required",
                "eventOccurredTime" : "No exception occurred",
                "eventText" : "No exception occurred",
                "TransactionDate" : "01/12/2020"
            }]
        }
        await searchController.searchQuery(req2, res);
        chai.expect(res.render.calledWithMatch("resultsPage", expectedRender)).to.be.true;
    }).timeout(5000)
})