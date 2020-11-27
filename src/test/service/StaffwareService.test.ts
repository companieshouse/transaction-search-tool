import chai from 'chai';
import ChipsService from '../../service/ChipsService';
import sinon, { SinonMock, SinonSpy, SinonStub } from 'sinon';
import StaffwareService from '../../service/StaffwareService';
import StaffwareDao from '../../daos/staffware/StaffwareDao';
import SearchResult from '../../models/SearchResult';
chai.use(require('sinon-chai'));

describe('staffware service test', ()=>{

    var staffwareService: StaffwareService;
    var chipsService: ChipsService;
    var swDao: StaffwareDao;
    var orgUnitStub: SinonStub;
    var userStub: SinonStub;

    before(()=>{

        staffwareService = new StaffwareService();

        chipsService = new ChipsService();
        swDao = new StaffwareDao();

        orgUnitStub = sinon.stub(chipsService, 'getOrgUnitFromId').resolves("My Org Unit");
        userStub = sinon.stub(chipsService, 'getUserFromId').resolves("Test User");
        staffwareService.chipsService = chipsService;

        sinon.stub(swDao, 'makeQuery').resolves({rows : [{ 
            "O_QUEUENAME" : "Q1234",
            "O_QPARAM1" : "1"
        }]});
        staffwareService.dao = swDao;

    });

    it('test getOrgUnit return org unit desc', async ()=>{
        var searchResult = new SearchResult();
        searchResult.documentId = 1;
        var returnedSearchResult = await staffwareService.addStaffwareData(searchResult);
        chai.expect(orgUnitStub.calledWithMatch('1234')).to.be.true;
        chai.expect(userStub.calledWithMatch(1)).to.be.true;
        chai.expect(returnedSearchResult.orgUnit).to.be.equal("My Org Unit");
        chai.expect(returnedSearchResult.user).to.be.equal("Test User");
    });
})