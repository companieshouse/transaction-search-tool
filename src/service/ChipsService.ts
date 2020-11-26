import ChipsDao from "../daos/CHIPS/ChipsDao";
import SqlData from "../sql/SqlData"

class ChipsService {
    dao: ChipsDao;

    constructor() {
        this.dao = new ChipsDao();
    }

    public async getOrgUnitFromId(orgUnitId: number): Promise<string> {
        var result = await this.dao.makeQuery(SqlData.orgUnitSql, [orgUnitId]);
        return result.rows[0]['ORGANISATIONAL_UNIT_DESC'];
    }

    public async getUserFromId(userId: number): Promise<string> {
        var result = await this.dao.makeQuery(SqlData.userSql, [userId]);
        return result.rows[0]['LOGIN_ID'];
    }
}

export default ChipsService;