import chai from 'chai';
import FesService from '../../service/FesService';
import sinon, { SinonStub } from 'sinon';
import FesDao from '../../daos/FES/FesDao';
import FesResult from '../../data/FesResult';
chai.use(require('sinon-chai'));

describe('chips service test', ()=>{

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
            FORM_ID : 1,
            FORM_STATUS : 6,
            IMAGE_EXCEPTION_REASON : 'Not Returned',
            IMAGE_EXCEPTION_FREE_TEXT : 'No Action Required'
        }
        var expectedResult = new FesResult();
        expectedResult.envNo = 1;
        expectedResult.scanTime = '01/12/2020';
        expectedResult.formIdentification = 1;
        expectedResult.fesStatus = 6;
        expectedResult.icoReturnedReason = 'Not Returned';
        expectedResult.icoAction = 'No Action Required'

        stub = sinon.stub(dao, 'makeQuery').resolves({rows: [queryResult]});
        fesService.dao = dao;

        var returnedSearchResult = await fesService.getTransactionDetailsFromBarcode("barcode");
        chai.expect(returnedSearchResult).to.be.deep.equal(expectedResult);
    });

    afterEach(() => {
        stub.restore();
    });
})