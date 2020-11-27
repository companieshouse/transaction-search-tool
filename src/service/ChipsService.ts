import ChipsDao from "../daos/CHIPS/ChipsDao";
import SqlData from "../sql/SqlData"
import ChipsResult from "../data/ChipsResult";

class ChipsService {
    dao: ChipsDao;

    constructor() {
        this.dao = new ChipsDao();
    }

    public async getTransactionDetailsFromBarcode(barcode: string): Promise<ChipsResult> {
        var result = new ChipsResult();
        var chipsSearch = await this.dao.makeQuery(SqlData.transactionSQL, [barcode]);
        result.transactionId = chipsSearch.rows[0]['TRANSACTION_ID'];
        result.incorporationNumber = chipsSearch.rows[0]['INCORPORATION_NUMBER'];
        result.chipsStatus = chipsSearch.rows[0]['TRANSACTION_STATUS_DESC'];
        result.documentId = chipsSearch.rows[0]['INPUT_DOCUMENT_ID'];
        return result;
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