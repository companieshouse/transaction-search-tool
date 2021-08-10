import chai from 'chai';
import ChipsService from '../../service/ChipsService';
import sinon, { SinonStub } from 'sinon';
import BarcodeSearchHandler from '../../handlers/BarcodeSearchHandler';
import StaffwareService from '../../service/StaffwareService';
import ChipsResult from '../../data/ChipsResult';
import StaffwareResult from '../../data/StaffwareResult';
import FesService from '../../service/FesService';
import FesResult from '../../data/FesResult';
import DocumentOverviewModel from '../../models/DocumentOverviewModel';
chai.use(require('sinon-chai'));

describe('barcode search handler', ()=>{

    var barcodeSearchHandler:BarcodeSearchHandler;
    var orgUnitStub: SinonStub;
    var userStub: SinonStub;

    before(()=>{

        barcodeSearchHandler = new BarcodeSearchHandler();

        let chipsService = new ChipsService();
        let swService = new StaffwareService();
        let fesService = new FesService();

        let chipsResult = new ChipsResult();
        chipsResult.transactionId = 1;
        chipsResult.incorporationNumber = "inco";
        chipsResult.documentId = 1;
        chipsResult.chipsStatus = "Pending";
        chipsResult.transactionDate = "01/12/2020";

        let staffwareResult = new StaffwareResult();
        staffwareResult.orgUnitId = 1234;
        staffwareResult.userId = 1;

        let fesResult = new FesResult();
        fesResult.envNo = 1;
        fesResult.scanTime = "01/12/2020";
        fesResult.formType = "IN01";
        fesResult.fesStatus = "Sent to CHIPS";
        fesResult.icoReturnedReason = "Not Returned";
        fesResult.icoAction = "No Action Required";
        fesResult.eventOccurredTime = "No exception occurred";
        fesResult.eventText = "No exception occurred";
        fesResult.batchName = "Batch Name";


        sinon.stub(chipsService, 'getTransactionDetailsFromBarcode').resolves(chipsResult);
        orgUnitStub = sinon.stub(chipsService, 'getOrgUnitFromId').resolves("My Org Unit");
        userStub = sinon.stub(chipsService, 'getUserFromId').resolves("Test User");
        barcodeSearchHandler.chipsService = chipsService;

        sinon.stub(swService, 'addStaffwareData').resolves(staffwareResult);
        barcodeSearchHandler.swService = swService;

        sinon.stub(fesService, 'getTransactionDetailsFromBarcode').resolves(fesResult);
        barcodeSearchHandler.fesService = fesService;
    })

    it('test barcodeSearch returns expected DocumentOverviewModel when called', async ()=>{

        let model = new DocumentOverviewModel();
        model.formBarcode = "XYZ123456";
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
        model.user = "Test User";

        var result = await barcodeSearchHandler.searchBarcode('XYZ123456');
        chai.expect(result).to.be.deep.equal(model);
    }).timeout(5000)
})