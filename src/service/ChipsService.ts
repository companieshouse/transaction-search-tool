import ChipsDao from "../daos/CHIPS/ChipsDao";
import SqlData from "../sql/SqlData"
import ChipsResult from "../data/ChipsResult";

import config from "../config";
import { createLogger } from "ch-structured-logging";

const logger = createLogger(config.applicationNamespace);

class ChipsService {
    dao: ChipsDao;

    constructor() {
        this.dao = new ChipsDao();
    }

    public async getTransactionDetailsFromBarcode(barcode: string): Promise<ChipsResult> {
        var result = new ChipsResult();
        var chipsSearch = await this.dao.makeQuery(SqlData.transactionSQL, [barcode]);
        if (chipsSearch.rows[0]) {
            result.barcode = barcode;
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

    public async getTransactionDetailsFromCompanyNumber(incno: string): Promise<ChipsResult[]> {
        var resultArray: ChipsResult[] = [];
        var chipsSearch = await this.dao.makeQuery(SqlData.corporateBodySQL, [incno]);
        if (chipsSearch.rows[0]) {
            for(let i=0; i < chipsSearch.rows.length; i++) {
                let result = new ChipsResult();
                result.barcode = chipsSearch.rows[i]['FORM_BARCODE'];
                result.transactionId = chipsSearch.rows[i]['TRANSACTION_ID'];
                result.incorporationNumber = chipsSearch.rows[i]['INCORPORATION_NUMBER'] || "No Company Number";
                result.transactionDate = chipsSearch.rows[i]['TRANSACTION_STATUS_DATE'];
                result.userAccessId = chipsSearch.rows[i]['USER_ACCESS_ID'];
                result.orgUnitId = chipsSearch.rows[i]['ORGANISATIONAL_UNIT_ID'];
                var transactionStatusSearch = await this.dao.makeQuery(SqlData.transactionStatusTypeSQL, [chipsSearch.rows[i]['TRANSACTION_STATUS_TYPE_ID']]);
                result.chipsStatus = transactionStatusSearch.rows[i] ? transactionStatusSearch.rows[i]['TRANSACTION_STATUS_DESC'] : undefined;
                var transactionXMLSearch = await this.dao.makeQuery(SqlData.transactionXMLDocSQL, [chipsSearch.rows[0]['TRANSACTION_ID']]);
                result.documentId = transactionXMLSearch.rows[i] ? transactionXMLSearch.rows[i]['INPUT_DOCUMENT_ID'] : undefined;
                if (!result.isEmpty()) resultArray.push(result);
            };
        }
        logger.info("Our result array in CHIPS is: " + JSON.stringify(resultArray));
        return resultArray;
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