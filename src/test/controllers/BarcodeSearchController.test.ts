import chai from 'chai';
import ChipsService from '../../service/ChipsService';
import sinon from 'sinon';
import BarcodeSearchController from '../../controllers/BarcodeSearchController';
import SearchResult from '../../models/SearchResult';
import StaffwareService from '../../service/StaffwareService';
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

    before(()=>{

        barcodeSearchController = new BarcodeSearchController();

        let chipsService = new ChipsService();
        let swService = new StaffwareService();

        let searchResult = new SearchResult();
        searchResult.transactionId = 1;
        searchResult.incorporationNumber = 'inco';
        searchResult.documentId = 1;
        searchResult.chipsStatus = 'Pending';
        searchResult.formBarcode = 'barcode';
        searchResult.orgUnit = 'My Org Unit';
        searchResult.user = 'Test User';

        sinon.stub(chipsService, 'getTransactionDetailsFromBarcode').resolves(searchResult);
        sinon.stub(chipsService, 'getUserFromId').resolves("Test User");
        barcodeSearchController.chipsService = chipsService;

        sinon.stub(swService, 'addStaffwareData').resolves(searchResult);
        barcodeSearchController.swService = swService;

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
                "User" : "Test User"
            }
        }
        await barcodeSearchController.searchBarcode(req, res);
        chai.expect(res.render.calledWithMatch("barcodeSearch", expectedRender)).to.be.true;
    }).timeout(5000)
})