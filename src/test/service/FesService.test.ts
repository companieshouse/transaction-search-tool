import chai from 'chai';
import FesService from '../../service/FesService';
import sinon, { SinonStub } from 'sinon';
import FesDao from '../../daos/FES/FesDao';
import FesResult from '../../data/FesResult';
chai.use(require('sinon-chai'));

describe('FES service test', ()=>{

    var fesService: FesService;
    var dao: FesDao;
    var stub: SinonStub;

    before(()=>{

        fesService = new FesService();
        dao = new FesDao();

    });

    it('test getTransactionDetailsFromBarcode returns searchResult', async ()=>{
        var queryResult = {
            FORM_ENVELOPE_ID : 1,
            FORM_BARCODE_DATE : '01/12/2020',
            FORM_TYPE : "IN01",
            FORM_STATUS_TYPE_NAME : "Sent to CHIPS",
            IMAGE_EXCEPTION_REASON : 'Not Returned',
            IMAGE_EXCEPTION_FREE_TEXT : 'No Action Required',
            IMAGE_EXCEPTION_ID : 1
        }
        var expectedResult = new FesResult();
        expectedResult.barcode = "barcode";
        expectedResult.envNo = 1;
        expectedResult.eventOccurredTime = "No event yet";
        expectedResult.eventText = "No event yet";
        expectedResult.scanTime = '01/12/2020';
        expectedResult.formType = "IN01";
        expectedResult.fesStatus = "Sent to CHIPS";
        expectedResult.icoReturnedReason = 'Not Returned';
        expectedResult.icoAction = 'No Action Required';
        expectedResult.exceptionId = 1;

        stub = sinon.stub(dao, 'makeQuery').resolves({rows: [queryResult]});
        fesService.dao = dao;

        var returnedSearchResult = await fesService.getTransactionDetailsFromBarcode("barcode");
        chai.expect(returnedSearchResult).to.be.deep.equal(expectedResult);
    });

    it('test getBatchNameFromEnvelopeId returns batch name', async ()=>{
        var queryResult = {
            BATCH_NAME : "Test Batch Name"
        }
        stub = sinon.stub(dao, 'makeQuery').resolves({rows: [queryResult]});
        fesService.dao = dao;

        var batchName = await fesService.getBatchNameFromEnvelopeId(1);
        chai.expect(batchName).to.be.equal("Test Batch Name");
    });

    afterEach(() => {
        stub.restore();
    });
})