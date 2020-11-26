import StaffwareDao from "../daos/staffware/StaffwareDao";
import SqlData from "../sql/SqlData";
import ChipsService from "./ChipsService";

class StaffwareService {

    chipsService: ChipsService;
    dao: StaffwareDao;

    constructor() {
        this.chipsService = new ChipsService();
        this.dao = new StaffwareDao();
    }

    public async getOrgUnit(documentId: number): Promise<string> {
        var swResult = await this.dao.makeQuery(SqlData.getQueueFromDocumentSQL(documentId));
        var orgUnitId: number = swResult.rows[0]['USER_NAME'].substring(1).split('@')[0];
        return await this.chipsService.getOrgUnitFromId(orgUnitId);
    }
}

export default StaffwareService;