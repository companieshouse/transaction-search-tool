import chai from 'chai';
import ChipsService from '../../service/ChipsService';
import sinon from 'sinon';
import CompanyNumberSearchHandler from '../../handlers/CompanyNumberSearchHandler';
import StaffwareService from '../../service/StaffwareService';
import ChipsResult from '../../data/ChipsResult';
import StaffwareResult from '../../data/StaffwareResult';
import FesService from '../../service/FesService';
import FesResult from '../../data/FesResult';
import DocumentOverviewModel from '../../models/DocumentOverviewModel';
import sinon_chai from 'sinon-chai';
chai.use(sinon_chai);

describe('company number search handler', ()=>{

    let companyNumberSearchHandler:CompanyNumberSearchHandler;

    before(()=>{

        companyNumberSearchHandler = new CompanyNumberSearchHandler();

        const chipsService = new ChipsService();
        const swService = new StaffwareService();
        const fesService = new FesService();

        const chipsResultItem = new ChipsResult();
        chipsResultItem.barcode = "barcode";
        chipsResultItem.transactionId = 1;
        chipsResultItem.incorporationNumber = "inco";
        chipsResultItem.documentId = 1;
        chipsResultItem.chipsStatus = "Pending";
        chipsResultItem.transactionDate = "01/12/2020";
        const chipsResults:ChipsResult[] = [chipsResultItem];

        const staffwareResult = new StaffwareResult();
        staffwareResult.orgUnitId = 1234;
        staffwareResult.userId = 1;

        const fesResultItem = new FesResult();
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
        const fesResults:FesResult[] = [fesResultItem];


        sinon.stub(chipsService, 'getTransactionDetailsFromCompanyNumber').resolves(chipsResults);
        const orgUnitStub = sinon.stub(chipsService, 'getOrgUnitFromId').resolves("My Org Unit");
        const userStub = sinon.stub(chipsService, 'getUserFromId').resolves("Test User");
        companyNumberSearchHandler.chipsService = chipsService;

        sinon.stub(swService, 'addStaffwareData').resolves(staffwareResult);
        companyNumberSearchHandler.swService = swService;

        sinon.stub(fesService, 'getTransactionDetailsFromCompanyNumber').resolves(fesResults);
        companyNumberSearchHandler.fesService = fesService;
    })

    it('test company number search returns expected DocumentOverviewModel map when called', async ()=>{

        const model = new DocumentOverviewModel();
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

        const expectedReturnValue: Map<string,DocumentOverviewModel> = new Map();
        expectedReturnValue.set("barcode", model);

        const result = await companyNumberSearchHandler.searchCompanyNumber("inco");
        chai.expect(result).to.be.deep.equal(expectedReturnValue);
    }).timeout(5000)
})
