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
        if (chipsSearch.rows[0]) {
            result.transactionId = chipsSearch.rows[0]['TRANSACTION_ID'];
            result.incorporationNumber = chipsSearch.rows[0]['INCORPORATION_NUMBER'] || "No Company Number";
            result.transactionDate = chipsSearch.rows[0]['TRANSACTION_STATUS_DATE'];
            result.userAccessId = chipsSearch.rows[0]['USER_ACCESS_ID'];
            result.orgUnitId = chipsSearch.rows[0]['ORGANISATIONAL_UNIT_ID'];
            var transactionStatusSearch = await this.dao.makeQuery(SqlData.transactionStatusTypeSQL, [chipsSearch.rows[0]['TRANSACTION_STATUS_TYPE_ID']]);
            result.chipsStatus = transactionStatusSearch.rows[0] ? transactionStatusSearch.rows[0]['TRANSACTION_STATUS_DESC'] : undefined;
            var transactionXMLSearch = await this.dao.makeQuery(SqlData.transactionXMLDocSQL, [chipsSearch.rows[0]['TRANSACTION_ID']]);
            result.documentId = transactionXMLSearch.rows[0] ? transactionXMLSearch.rows[0]['INPUT_DOCUMENT_ID'] : undefined;
        }
        return result;
    }

    public async getOrgUnitFromId(orgUnitId: number): Promise<string> {
        var result = await this.dao.makeQuery(SqlData.orgUnitSql, [orgUnitId]);
        return result.rows[0] ? result.rows[0]['ORGANISATIONAL_UNIT_DESC'] : "No org unit assigned";
    }

    public async getUserFromId(userId: number): Promise<string> {
        var result = await this.dao.makeQuery(SqlData.userSql, [userId]);
        return result.rows[0] ? result.rows[0]['LOGIN_ID'] : "No user allocated";
    }
}

export default ChipsService;