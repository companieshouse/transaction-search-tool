import SearchResult from "../models/SearchResult";
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

    public async addStaffwareData(searchResult: SearchResult): Promise<SearchResult> {
        var swResult = await this.dao.makeQuery(SqlData.getQueueAndUserFromDocumentSQL, [searchResult.documentId.toString()]);
        var orgUnitId: number = swResult.rows[0]['O_QUEUENAME'].substring(1);
        var userId = swResult.rows[0]['O_QPARAM1'];
        searchResult.orgUnit = await this.chipsService.getOrgUnitFromId(orgUnitId);
        searchResult.user = await this.chipsService.getUserFromId(userId);
        return searchResult;
    }
}

export default StaffwareService;