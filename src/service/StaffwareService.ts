import StaffwareDao from "../daos/staffware/StaffwareDao";
import SqlData from "../sql/SqlData";
import StaffwareResult from "../data/StaffwareResult";

class StaffwareService {

    dao: StaffwareDao;

    constructor() {
        this.dao = new StaffwareDao();
    }

    public async addStaffwareData(documentId: number): Promise<StaffwareResult> {
        var swResult = await this.dao.makeQuery(SqlData.getQueueAndUserFromDocumentSQL, [documentId.toString()]);
        var result = new StaffwareResult();
        if (swResult.rows[0] != undefined) {
            result.orgUnitId = +swResult.rows[0]['O_QUEUENAME'].substring(1);
            result.userId = +swResult.rows[0]['O_QPARAM1'];
            result.casenum = swResult.rows[0]['O_CASENUM'];
        }
        return result;
    }

    public async getAuditDate(casenum: string): Promise<StaffwareResult> {
        var swResult = await this.dao.makeQuery(SqlData.getAuditTrailDate, [casenum.toString()]);
        var result = new StaffwareResult();
        if (swResult.rows[0] != undefined) {
            result.date = swResult.rows[0]['AUDIT_DATE'];
        }
        return result;
    }
}

export default StaffwareService;