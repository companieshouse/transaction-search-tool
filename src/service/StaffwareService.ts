import StaffwareDao from "../daos/staffware/StaffwareDao";
import SqlData from "../sql/SqlData";
import ChipsService from "./ChipsService";

class StaffwareService {

    public async getOrgUnit(documentId: number): Promise<string> {
        var staffwareDao = new StaffwareDao();
        var swResult = await staffwareDao.makeQuery(SqlData.getQueueFromDocumentSQL(documentId));
        var orgUnitId: number = swResult.rows[0]['USER_NAME'].substring(1).split('@')[0];
        var chipsService = new ChipsService();
        return await chipsService.getOrgUnitFromId(orgUnitId);
    }
}

export default StaffwareService;