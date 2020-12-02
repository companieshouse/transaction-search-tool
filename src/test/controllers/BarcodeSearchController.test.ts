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

        let staffwareResult = new StaffwareResult();
        staffwareResult.orgUnitId = 1234;
        staffwareResult.userId = 1;

        let fesResult = new FesResult();
        fesResult.envNo = 1;
        fesResult.scanTime = "01/12/2020";
        fesResult.formIdentification = 1;
        fesResult.fesStatus = 6;
        fesResult.icoReturnedReason = "Not Returned";
        fesResult.icoAction = "No Action Required";

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
                "Transaction Id" : 1,
                "Document Id" : 1,
                "Incorp No." : "inco",
                "Chips Status" : "Pending",
                "Org Unit" : "My Org Unit",
                "User" : "Test User",
                "Env No" : 1,
                "Scan Time" : "01/12/2020",
                "Form Id" : 1,
                "FES Status" : 6,
                "ICO Returned Reason" : "Not Returned",
                "ICO Action" : "No Action Required"
            }
        }
        await barcodeSearchController.searchBarcode(req, res);
        chai.expect(orgUnitStub.calledWithMatch(1234)).to.be.true;
        chai.expect(userStub.calledWithMatch(1)).to.be.true;
        chai.expect(res.render.calledWithMatch("barcodeSearch", expectedRender)).to.be.true;
    }).timeout(5000)
})