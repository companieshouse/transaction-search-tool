import chai from 'chai';
import ChipsService from '../../service/ChipsService';
import sinon, { SinonStub } from 'sinon';
import BarcodeSearchController from '../../controllers/BarcodeSearchController';
import StaffwareService from '../../service/StaffwareService';
import ChipsResult from '../../data/ChipsResult';
import StaffwareResult from '../../data/StaffwareResult';
import FesService from '../../service/FesService';
import FesResult from '../../data/FesResult';
chai.use(require('sinon-chai'));

describe('barcode search controller', ()=>{

    const req = {
        query: {
            search: 'barcode'
        }
    }
    const res = {
        render: sinon.spy()
    };

    var barcodeSearchController: BarcodeSearchController;
    var orgUnitStub: SinonStub;
    var userStub: SinonStub;

    before(()=>{

        barcodeSearchController = new BarcodeSearchController();

        let chipsService = new ChipsService();
        let swService = new StaffwareService();
        let fesService = new FesService();

        let chipsResult = new ChipsResult();
        chipsResult.transactionId = 1;
        chipsResult.incorporationNumber = 'inco';
        chipsResult.documentId = 1;
        chipsResult.chipsStatus = 'Pending';
        chipsResult.transactionDate = '01/12/2020';

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
        fesResult.icoReturnedReason = "No exception occurred";
        fesResult.icoAction = "No exception occurred";

        sinon.stub(chipsService, 'getTransactionDetailsFromBarcode').resolves(chipsResult);
        orgUnitStub = sinon.stub(chipsService, 'getOrgUnitFromId').resolves("My Org Unit");
        userStub = sinon.stub(chipsService, 'getUserFromId').resolves("Test User");
        barcodeSearchController.chipsService = chipsService;

        sinon.stub(swService, 'addStaffwareData').resolves(staffwareResult);
        barcodeSearchController.swService = swService;

        sinon.stub(fesService, 'getTransactionDetailsFromBarcode').resolves(fesResult);
        barcodeSearchController.fesService = fesService;
    })

    it('test getSearchPage calls response render', ()=>{
        barcodeSearchController.getSearchPage(req, res);
        chai.expect(res.render.calledOnce).to.be.true;
    })

    it('test barcodeSearch calls response render method with barcode when called', async ()=>{

        const expectedRender = {
            barcode: 'barcode',
            result: {
                "Barcode" : "barcode",
                "User" : "Test User",
                "CoNumb" : "inco",
                "Type" : "IN01",
                "ChipsStatus" : "Pending",
                "TransactionDate": "01/12/2020",
                "FESStatus" : "Sent to CHIPS",
                "Location" : "My Org Unit",
                "TransactionId" : 1,
                "DocumentId" : 1,
                "EnvNo" : 1,
                "ScanTime": "01/12/2020",
                "ICOReturnedReason" : "No exception occurred",
                "ICOAction" : "No exception occurred",
            }
        }
        await barcodeSearchController.searchBarcode(req, res);
        chai.expect(orgUnitStub.calledWithMatch(1234)).to.be.true;
        chai.expect(userStub.calledWithMatch(1)).to.be.true;
        chai.expect(res.render.calledWithMatch("documentOverview", expectedRender)).to.be.true;
    }).timeout(5000)
})