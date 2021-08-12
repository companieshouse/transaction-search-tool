import chai from 'chai';
import ChipsService from '../../service/ChipsService';
import sinon, { SinonStub } from 'sinon';
import CompanyNumberSearchHandler from '../../handlers/CompanyNumberSearchHandler';
import StaffwareService from '../../service/StaffwareService';
import ChipsResult from '../../data/ChipsResult';
import StaffwareResult from '../../data/StaffwareResult';
import FesService from '../../service/FesService';
import FesResult from '../../data/FesResult';
import DocumentOverviewModel from '../../models/DocumentOverviewModel';
chai.use(require('sinon-chai'));

describe('company number search handler', ()=>{

    var companyNumberSearchHandler:CompanyNumberSearchHandler;
    var orgUnitStub: SinonStub;
    var userStub: SinonStub;

    before(()=>{

        companyNumberSearchHandler = new CompanyNumberSearchHandler();

        let chipsService = new ChipsService();
        let swService = new StaffwareService();
        let fesService = new FesService();

        let chipsResultItem = new ChipsResult();
        chipsResultItem.barcode = "barcode";
        chipsResultItem.transactionId = 1;
        chipsResultItem.incorporationNumber = "inco";
        chipsResultItem.documentId = 1;
        chipsResultItem.chipsStatus = "Pending";
        chipsResultItem.transactionDate = "01/12/2020";
        let chipsResults:ChipsResult[] = [chipsResultItem];

        let staffwareResult = new StaffwareResult();
        staffwareResult.orgUnitId = 1234;
        staffwareResult.userId = 1;

        let fesResultItem = new FesResult();
        fesResultItem.envNo = 1;
        fesResultItem.barcode = "barcode";
        fesResultItem.incorporationNumber = "inco";
        fesResultItem.scanTime = "01/12/2020";
        fesResultItem.formType = "IN01";
        fesResultItem.fesStatus = "Sent to CHIPS";
        fesResultItem.icoReturnedReason = "Not Returned";
        fesResultItem.icoAction = "No Action Required";
        fesResultItem.eventOccurredTime = "No exception occurred";
        fesResultItem.eventText = "No exception occurred";
        fesResultItem.batchName = "Batch Name";
        let fesResults:FesResult[] = [fesResultItem];


        sinon.stub(chipsService, 'getTransactionDetailsFromCompanyNumber').resolves(chipsResults);
        orgUnitStub = sinon.stub(chipsService, 'getOrgUnitFromId').resolves("My Org Unit");
        userStub = sinon.stub(chipsService, 'getUserFromId').resolves("Test User");
        companyNumberSearchHandler.chipsService = chipsService;

        sinon.stub(swService, 'addStaffwareData').resolves(staffwareResult);
        companyNumberSearchHandler.swService = swService;

        sinon.stub(fesService, 'getTransactionDetailsFromCompanyNumber').resolves(fesResults);
        companyNumberSearchHandler.fesService = fesService;
    })

    it('test company number search returns expected DocumentOverviewModel map when called', async ()=>{

        let model = new DocumentOverviewModel();
        model.barcode = "barcode";
        model.transactionId = 1;
        model.incorporationNumber = "inco";
        model.documentId = 1;
        model.envNo = 1;
        model.status = "Pending";
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
        model.userLogin = "Test User";

        let expectedReturnValue: Map<String,DocumentOverviewModel> = new Map();
        expectedReturnValue.set("barcode", model);

        var result = await companyNumberSearchHandler.searchCompanyNumber("inco");
        chai.expect(result).to.be.deep.equal(expectedReturnValue);
    }).timeout(5000)
})