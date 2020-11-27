import chai from 'chai';
import sinon from 'sinon';
import StaffwareService from '../../service/StaffwareService';
import StaffwareDao from '../../daos/staffware/StaffwareDao';
import StaffwareResult from '../../data/StaffwareResult';
chai.use(require('sinon-chai'));

describe('staffware service test', ()=>{

    var staffwareService: StaffwareService;
    var swDao: StaffwareDao;

    before(()=>{

        staffwareService = new StaffwareService();

        swDao = new StaffwareDao();

        sinon.stub(swDao, 'makeQuery').resolves({rows : [{ 
            "O_QUEUENAME" : "Q1234",
            "O_QPARAM1" : "1"
        }]});
        staffwareService.dao = swDao;

    });

    it('test getOrgUnit return org unit desc', async ()=>{
        var returnedSearchResult: StaffwareResult = await staffwareService.addStaffwareData(1);
        chai.expect(returnedSearchResult.orgUnitId).to.be.equal(1234);
        chai.expect(returnedSearchResult.userId).to.be.equal(1);
    });
})