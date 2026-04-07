import chai from 'chai';
import sinon from 'sinon';
import StaffwareService from '../../service/StaffwareService';
import StaffwareDao from '../../daos/staffware/StaffwareDao';
import StaffwareResult from '../../data/StaffwareResult';
import sinon_chai from 'sinon-chai';
chai.use(sinon_chai);

describe('staffware service test', ()=>{

    let staffwareService: StaffwareService;
    let swDao: StaffwareDao;

    before(()=>{

        staffwareService = new StaffwareService();

        swDao = new StaffwareDao();

        sinon.stub(swDao, 'makeQuery').resolves({rows : [{
            "O_QUEUENAME" : "Q1234",
            "O_QPARAM1" : "1",
            "O_CASENUM" : "11439511",
            "AUDIT_DATE" : "02-DEC-2020"
        }]});
        staffwareService.dao = swDao;

    });

    it('test getOrgUnit return org unit desc', async ()=>{
        const returnedSearchResult: StaffwareResult = await staffwareService.addStaffwareData(1);
        chai.expect(returnedSearchResult.orgUnitId).to.be.equal(1234);
        chai.expect(returnedSearchResult.userId).to.be.equal(1);
        chai.expect(returnedSearchResult.casenum).to.be.equal("11439511");
    });

    it('test auditdate return a date', async ()=>{
        const returnedSearchResult: StaffwareResult = await staffwareService.getAuditDate("11439511");
        chai.expect(returnedSearchResult.date).to.be.equal("02-DEC-2020");
    });
})
