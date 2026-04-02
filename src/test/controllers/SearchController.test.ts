import chai from 'chai';
import dirtyChai from 'dirty-chai';
import sinon from 'sinon';
import BarcodeSearchHandler from '../../handlers/BarcodeSearchHandler';
import CompanyNumberSearchHandler from '../../handlers/CompanyNumberSearchHandler';
import DocumentOverviewModel from '../../models/DocumentOverviewModel';
import SearchController from '../../controllers/SearchController';
import sinon_chai from 'sinon-chai';
chai.use(sinon_chai);
chai.use(dirtyChai);

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

    let searchController: SearchController;

    let model:DocumentOverviewModel;

    before(()=>{
        searchController = new SearchController();

        const barcodeSearchHandler = new BarcodeSearchHandler();
        const companyNumberSearchHandler = new CompanyNumberSearchHandler();

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
        model.casenum = "11439511";

        const resultMap: Map<string,DocumentOverviewModel> = new Map();
        const resultMapEmpty: Map<string,DocumentOverviewModel> = new Map();
        resultMap.set("barcode2", model);
        resultMap.set("barcode3", model);

        const barcodeSearchStub = sinon.stub(barcodeSearchHandler, 'searchBarcode');
        const companyNumbStub = sinon.stub(companyNumberSearchHandler, 'searchCompanyNumber');
        const timelineStub = sinon.stub(barcodeSearchHandler, 'getTimelineResult');
        const timelineArray = [{"date" : "02-DEC-2020", "event" : "Scan", "location" : "fes", "user" : "sbowen"}];

        barcodeSearchStub.withArgs("barcode").resolves(model);
        companyNumbStub.withArgs("barcode").resolves(resultMapEmpty);
        barcodeSearchStub.withArgs("barcode1").resolves(model);
        companyNumbStub.withArgs("barcode1").resolves(resultMap);
        timelineStub.withArgs("barcode", model).resolves(timelineArray);

        searchController.barcodeSearchHandler = barcodeSearchHandler;
        searchController.companyNumberSearchHandler = companyNumberSearchHandler;
    })

    it('test getSearchPage calls response render', ()=>{
        searchController.getSearchPage(req, res);
        chai.expect(res.render.calledOnce).to.be.true();
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
            },
            "timeline" : [{"date" : "02-DEC-2020", "event" : "Scan", "location" : "fes", "user" : "sbowen"}]
        }
        await searchController.searchQuery(req, res);
        chai.expect(res.render.calledWithMatch("documentOverview", expectedRender)).to.be.true();
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
                "TransactionDate" : "01/12/2020",
                "CaseNum" : "11439511"
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
                "TransactionDate" : "01/12/2020",
                "CaseNum" : "11439511"
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
                "TransactionDate" : "01/12/2020",
                "CaseNum" : "11439511"
            }]
        }
        await searchController.searchQuery(req2, res);
        chai.expect(res.render.calledWithMatch("resultsPage", expectedRender)).to.be.true();
    }).timeout(5000)
})
