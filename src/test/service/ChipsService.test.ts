import chai from 'chai';
import ChipsService from '../../service/ChipsService';
import sinon, { SinonStub } from 'sinon';
import ChipsDao from '../../daos/CHIPS/ChipsDao';
import ChipsResult from '../../data/ChipsResult';
chai.use(require('sinon-chai'));

describe('chips service test', ()=>{

    let chipsService: ChipsService;
    let dao: ChipsDao;
    let stub: SinonStub;

    before(()=>{

        chipsService = new ChipsService();
        dao = new ChipsDao();

    });

    it('test getTransactionDetailsFromBarcode returns searchResult', async ()=>{
        const queryResult = {
            TRANSACTION_ID : 1,
            INCORPORATION_NUMBER : 'inco',
            TRANSACTION_STATUS_DESC : 'Pending',
            INPUT_DOCUMENT_ID : 1,
            TRANSACTION_STATUS_DATE : '01/12/2020',
            USER_ACCESS_ID : 100000,
            ORGANISATIONAL_UNIT_ID : 1
        }
        const expectedResult = new ChipsResult();
        expectedResult.barcode = 'barcode';
        expectedResult.transactionId = 1;
        expectedResult.chipsStatus = 'Pending';
        expectedResult.documentId = 1;
        expectedResult.incorporationNumber = 'inco';
        expectedResult.transactionDate = '01/12/2020';
        expectedResult.userAccessId = 100000;
        expectedResult.orgUnitId = 1;

        stub = sinon.stub(dao, 'makeQuery').resolves({rows: [queryResult]});
        chipsService.dao = dao;

        const returnedSearchResult = await chipsService.getTransactionDetailsFromBarcode("barcode");
        chai.expect(returnedSearchResult).to.be.deep.equal(expectedResult);
    });

    it('test getTransactionDetailsFromCompanyNumber returns searchResult', async ()=>{
        const queryResult =
        {
            FORM_BARCODE: 'X12A4CVM',
            TRANSACTION_ID: 3052085475,
            TRANSACTION_STATUS_DATE: '08-Feb-2012 09:29',
            TRANSACTION_STATUS_TYPE_ID: 1,
            USER_ACCESS_ID: 1000002,
            ORGANISATIONAL_UNIT_ID: 3000002513,
            INCORPORATION_NUMBER: '03347220',
            TRANSACTION_TYPE_SHORT_NAME: 'PR01',
            INPUT_DOCUMENT_ID: null,
            TRANSACTION_STATUS_DESC: 'Accepted'
        };
        const expectedResult = new ChipsResult();
        expectedResult.barcode = 'X12A4CVM';
        expectedResult.chipsStatus = 'Accepted';
        expectedResult.documentId = null;
        expectedResult.formType = 'PR01';
        expectedResult.incorporationNumber = '03347220';
        expectedResult.orgUnitId = 3000002513;
        expectedResult.transactionDate = '08-Feb-2012 09:29';
        expectedResult.transactionId = 3052085475;
        expectedResult.userAccessId = 1000002;
        const expectedResults: ChipsResult[] = [];
        expectedResults.push(expectedResult);

        stub = sinon.stub(dao, 'makeQuery').resolves({rows: [queryResult]});
        chipsService.dao = dao;

        const returnedSearchResult = await chipsService.getTransactionDetailsFromCompanyNumber("03347220");
        chai.expect(returnedSearchResult).to.be.deep.equal(expectedResults);
    });

    it('test getOrgUnitFromId returns orgUnit', async ()=>{
        const queryResult = {
            ORGANISATIONAL_UNIT_DESC : "My Org Unit"
        }
        stub = sinon.stub(dao, 'makeQuery').resolves({rows: [queryResult]});
        chipsService.dao = dao;

        const orgUnit = await chipsService.getOrgUnitFromId(1);
        chai.expect(orgUnit).to.be.equal("My Org Unit");
    });

    it('test getUserFromId returns user', async ()=>{
        const queryResult = {
            LOGIN_ID : "Test User"
        }
        stub = sinon.stub(dao, 'makeQuery').resolves({rows: [queryResult]});
        chipsService.dao = dao;

        const user = await chipsService.getUserFromId(1);
        chai.expect(user).to.be.equal("Test User");
    });

    afterEach(() => {
        stub.restore();
    });
})
