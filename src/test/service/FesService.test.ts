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
        expectedResult.batchName = "No batch name found";
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

    it('test getTransactionDetailsFromCompanyNumber returns an array of fes results', async ()=>{

        var queryResult = {
            FORM_BARCODE: "barcode",
            FORM_ENVELOPE_ID : 1,
            FORM_BARCODE_DATE : '01/12/2020',
            FORM_TYPE : "IN01",
            FORM_STATUS_TYPE_NAME : "Sent to CHIPS",
            IMAGE_EXCEPTION_REASON : 'Not Returned',
            IMAGE_EXCEPTION_FREE_TEXT : 'No Action Required',
            IMAGE_EXCEPTION_ID : 1,
            BATCH_NAME : "Test Batch Name",
        }
        var expectedResult = new FesResult();
        expectedResult.incorporationNumber = "inco";
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
        expectedResult.batchName = "Test Batch Name";

        var resultsArray: FesResult[] = [expectedResult];
        stub = sinon.stub(dao, 'makeQuery').resolves({rows: [queryResult]});
        fesService.dao = dao;

        var returnedSearchResult = await fesService.getTransactionDetailsFromCompanyNumber("inco");
        chai.expect(returnedSearchResult).to.be.deep.equal(resultsArray);
    });

    it('test getFesTimelineDetails returns an array of fes results', async ()=>{

        var queryResult = {
            FORM_EVENT_OCCURRED: "02-DEC-2020",
            FORM_EVENT_TYPE_NAME : "Sent to chips",
            FORM_ORG_UNIT_NAME : "FrontE Scanning",
            USER_ACCESS_ID : "sbowen"
        }

        var expectedResult = new FesResult();
        expectedResult.eventOccurredTime = "02-DEC-2020";
        expectedResult.eventText = "Sent to chips";
        expectedResult.location = "FrontE Scanning";
        expectedResult.userLogin = "sbowen";

        var resultsArray: FesResult[] = [expectedResult];
        stub = sinon.stub(dao, 'makeQuery').resolves({rows: [queryResult]});
        fesService.dao = dao;

        var returnedSearchResult = await fesService.getFesTimelineDetails("barcode");
        chai.expect(returnedSearchResult).to.be.deep.equal(resultsArray);
    });

    afterEach(() => {
        stub.restore();
    });
})