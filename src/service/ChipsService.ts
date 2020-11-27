import SearchResult from "../models/SearchResult";
import ChipsDao from "../daos/CHIPS/ChipsDao";
import SqlData from "../sql/SqlData"

class ChipsService {
    dao: ChipsDao;

    constructor() {
        this.dao = new ChipsDao();
    }

    public async getTransactionDetailsFromBarcode(barcode: string): Promise<SearchResult> {
        var searchResult = new SearchResult();
        var chipsSearch = await this.dao.makeQuery(SqlData.transactionSQL, [barcode]);
        searchResult.transactionId = chipsSearch.rows[0]['TRANSACTION_ID'];
        searchResult.formBarcode = barcode;
        searchResult.incorporationNumber = chipsSearch.rows[0]['INCORPORATION_NUMBER'];
        searchResult.chipsStatus = chipsSearch.rows[0]['TRANSACTION_STATUS_DESC'];
        searchResult.documentId = chipsSearch.rows[0]['INPUT_DOCUMENT_ID'];
        return searchResult;
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