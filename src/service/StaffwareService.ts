import StaffwareDao from "../daos/staffware/StaffwareDao";
import SqlData from "../sql/SqlData";
import ChipsService from "./ChipsService";
import StaffwareResult from "../data/StaffwareResult";

class StaffwareService {

    chipsService: ChipsService;
    dao: StaffwareDao;

    constructor() {
        this.chipsService = new ChipsService();
        this.dao = new StaffwareDao();
    }

    public async addStaffwareData(documentId: number): Promise<StaffwareResult> {
        var swResult = await this.dao.makeQuery(SqlData.getQueueAndUserFromDocumentSQL, [documentId.toString()]);
        var result = new StaffwareResult();
        result.orgUnitId = +swResult.rows[0]['O_QUEUENAME'].substring(1);
        result.userId = +swResult.rows[0]['O_QPARAM1'];
        return result;
    }
}

export default StaffwareService;