import chai from 'chai';
import ChipsService from '../../service/ChipsService';
import sinon, { SinonMock, SinonSpy, SinonStub } from 'sinon';
import ChipsDao from '../../daos/chips/ChipsDao';
import SearchResult from '../../models/SearchResult';
chai.use(require('sinon-chai'));

describe('chips service test', ()=>{

    var chipsService: ChipsService;
    var dao: ChipsDao;
    var stub: SinonStub;

    before(()=>{

        chipsService = new ChipsService();
        dao = new ChipsDao();

    });

    it('test getTransactionDetailsFromBarcode returns searchResult', async ()=>{
        var queryResult = {
            TRANSACTION_ID : 1,
            INCORPORATION_NUMBER : 'inco',
            TRANSACTION_STATUS_DESC : 'Pending',
            INPUT_DOCUMENT_ID : 1
        }
        stub = sinon.stub(dao, 'makeQuery').resolves({rows: [queryResult]});
        chipsService.dao = dao;

        var returnedSearchResult = await chipsService.getTransactionDetailsFromBarcode("barcode");
        chai.expect(returnedSearchResult.getResult()).to.be.deep.equal({
            "Barcode" : "barcode",
            "Transaction Id" : 1,
            "Document Id" : 1,
            "Incorp No." : 'inco',
            "Chips Status" : 'Pending',
            "Org Unit" : undefined,
            "User" : undefined
        });
    });

    it('test getOrgUnitFromId returns orgUnit', async ()=>{
        var queryResult = {
            ORGANISATIONAL_UNIT_DESC : "My Org Unit"
        }
        stub = sinon.stub(dao, 'makeQuery').resolves({rows: [queryResult]});
        chipsService.dao = dao;

        var orgUnit = await chipsService.getOrgUnitFromId(1);
        chai.expect(orgUnit).to.be.equal("My Org Unit");
    });

    it('test getUserFromId returns user', async ()=>{
        var queryResult = {
            LOGIN_ID : "Test User"
        }
        stub = sinon.stub(dao, 'makeQuery').resolves({rows: [queryResult]});
        chipsService.dao = dao;

        var user = await chipsService.getUserFromId(1);
        chai.expect(user).to.be.equal("Test User");
    });

    afterEach(() => {
        stub.restore();
    });
})