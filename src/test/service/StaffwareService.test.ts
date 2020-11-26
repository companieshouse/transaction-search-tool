import chai from 'chai';
import ChipsService from '../../service/ChipsService';
import sinon, { SinonMock, SinonSpy, SinonStub } from 'sinon';
import StaffwareService from '../../service/StaffwareService';
import StaffwareDao from '../../daos/staffware/StaffwareDao';
chai.use(require('sinon-chai'));

describe('staffware service test', ()=>{

    var staffwareService: StaffwareService;
    var chipsService: ChipsService;
    var swDao: StaffwareDao;
    var stub: SinonStub;

    before(()=>{

        staffwareService = new StaffwareService();

        chipsService = new ChipsService();
        swDao = new StaffwareDao();

        stub = sinon.stub(chipsService, 'getOrgUnitFromId').resolves("My Org Unit");
        staffwareService.chipsService = chipsService;

        sinon.stub(swDao, 'makeQuery').resolves({rows : [{ "USER_NAME" : "Q1234@swpro"}]});
        staffwareService.dao = swDao;

    });

    it('test getOrgUnit return org unit desc', async ()=>{

        var orgUnit = await staffwareService.getOrgUnit(1);
        chai.expect(stub.calledWithMatch('1234')).to.be.true;
        chai.expect(orgUnit).to.be.equal("My Org Unit");
    });
})