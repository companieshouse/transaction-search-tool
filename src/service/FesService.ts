import SqlData from "../sql/SqlData"
import FesResult from "../data/FesResult";
import FesDao from "../daos/FES/FesDao";

class FesService {
    dao: FesDao;

    constructor() {
        this.dao = new FesDao();
    }

    public async getTransactionDetailsFromBarcode(barcode: string): Promise<FesResult> {
        const result = new FesResult();
        const fesSearch = await this.dao.makeQuery(SqlData.fesTransactionSql, [barcode]);
        if (fesSearch.rows[0]) {
            result.barcode = barcode;
            result.envNo = fesSearch.rows[0]['FORM_ENVELOPE_ID'];
            result.scanTime = fesSearch.rows[0]['FORM_BARCODE_DATE'];
            result.formType = fesSearch.rows[0]['FORM_TYPE'];
            result.fesStatus = fesSearch.rows[0]['FORM_STATUS_TYPE_NAME'];
            const imageSearch = await this.dao.makeQuery(SqlData.fesImageExceptionSql, [fesSearch.rows[0]['FORM_IMAGE_ID']]);
            const imageResult = imageSearch.rows[0];
            result.icoReturnedReason = imageResult ? imageResult['IMAGE_EXCEPTION_REASON'] : "No image exception returned";
            result.icoAction = imageResult ? imageResult['IMAGE_EXCEPTION_FREE_TEXT'] : "No image exception returned";
            result.exceptionId = imageResult ? imageResult['IMAGE_EXCEPTION_ID'] : "";
            result.batchName = await this.getBatchNameFromEnvelopeId(result.envNo);
            if (result.exceptionId) {
                const exceptionSearch = await this.dao.makeQuery(SqlData.fesRescannedSql, [result.exceptionId]);
                result.eventOccurredTime = exceptionSearch.rows[0]['FORM_EVENT_OCCURED'] || "No event yet";
                result.eventText = exceptionSearch.rows[0]['FORM_EVENT_TEXT'] || "No event yet";
            } else {
                result.eventOccurredTime = "No exception occurred";
                result.eventText = "No exception occurred";
            }
        }
        return result;
    }

    public async getTransactionDetailsFromCompanyNumber(incno: string): Promise<FesResult[]> {
        const resultArray: FesResult[] = [];
        const fesSearch = await this.dao.makeQuery(SqlData.fesIncorporationNumberSql, [incno]);
        if (fesSearch.rows[0]) {
            for(const row of fesSearch.rows) {
                const result = new FesResult();
                result.incorporationNumber = incno;
                result.barcode = row['FORM_BARCODE'];
                result.envNo = row['FORM_ENVELOPE_ID'];
                result.scanTime = row['FORM_BARCODE_DATE'];
                result.formType = row['FORM_TYPE'];
                result.fesStatus = row['FORM_STATUS_TYPE_NAME'];
                result.icoReturnedReason = row['IMAGE_EXCEPTION_REASON'] || "No image exception returned";
                result.icoAction = row['IMAGE_EXCEPTION_FREE_TEXT'] || "No image exception returned";
                result.exceptionId = row['IMAGE_EXCEPTION_ID'];
                if (result.exceptionId) {
                    result.eventOccurredTime = row['FORM_EVENT_OCCURRED'] || "No event yet";
                    result.eventText = row['FORM_EVENT_TEXT'] || "No event yet";
                } else {
                    result.eventOccurredTime = "No exception occurred";
                    result.eventText = "No exception occurred";
                }
                result.batchName = await this.getBatchNameFromEnvelopeId(result.envNo);
                resultArray.push(result);
            }
        }
        return resultArray;
    }

    public async getFesTimelineDetails(barcode: string): Promise<FesResult []> {
        const resultArray: FesResult[] = [];
        const timelineSearch = await this.dao.makeQuery(SqlData.fesTimelineSql, [barcode]);
        if (timelineSearch.rows[0]) {
            for (const row of timelineSearch.rows) {
                const result = new FesResult();
                result.eventOccurredTime = row['FORM_EVENT_OCCURRED'];
                result.eventText = row['FORM_EVENT_TYPE_NAME'];
                result.location = row['FORM_ORG_UNIT_NAME'];
                result.userLogin = row['ACCOUNT_USERNAME'];
                resultArray.push(result);
            };
        }
        return resultArray;
    }

    private async getBatchNameFromEnvelopeId(envNo: number): Promise<string> {
        const result = await this.dao.makeQuery(SqlData.fesBatchNameSql, [envNo]);
        return result.rows[0]['BATCH_NAME']? result.rows[0]['BATCH_NAME'] : "No batch name found";
    }
}

export default FesService;
