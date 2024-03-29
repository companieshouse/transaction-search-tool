import SqlData from "../sql/SqlData"
import FesResult from "../data/FesResult";
import FesDao from "../daos/FES/FesDao";

class FesService {
    dao: FesDao;

    constructor() {
        this.dao = new FesDao();
    }

    public async getTransactionDetailsFromBarcode(barcode: string): Promise<FesResult> {
        var result = new FesResult();
        var fesSearch = await this.dao.makeQuery(SqlData.fesTransactionSql, [barcode]);
        if (fesSearch.rows[0]) {
            result.barcode = barcode;
            result.envNo = fesSearch.rows[0]['FORM_ENVELOPE_ID'];
            result.scanTime = fesSearch.rows[0]['FORM_BARCODE_DATE'];
            result.formType = fesSearch.rows[0]['FORM_TYPE'];
            result.fesStatus = fesSearch.rows[0]['FORM_STATUS_TYPE_NAME'];
            var imageSearch = await this.dao.makeQuery(SqlData.fesImageExceptionSql, [fesSearch.rows[0]['FORM_IMAGE_ID']]);
            var imageResult = imageSearch.rows[0];
            result.icoReturnedReason = imageResult ? imageResult['IMAGE_EXCEPTION_REASON'] : "No image exception returned";
            result.icoAction = imageResult ? imageResult['IMAGE_EXCEPTION_FREE_TEXT'] : "No image exception returned";
            result.exceptionId = imageResult ? imageResult['IMAGE_EXCEPTION_ID'] : "";
            result.batchName = await this.getBatchNameFromEnvelopeId(result.envNo);
            if (result.exceptionId) {
                var exceptionSearch = await this.dao.makeQuery(SqlData.fesRescannedSql, [result.exceptionId]);
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
        var resultArray: FesResult[] = [];
        var fesSearch = await this.dao.makeQuery(SqlData.fesIncorporationNumberSql, [incno]);
        if (fesSearch.rows[0]) {
            for(let i=0; i<fesSearch.rows.length; i++) {
                let result = new FesResult();
                result.incorporationNumber = incno;
                result.barcode = fesSearch.rows[i]['FORM_BARCODE'];
                result.envNo = fesSearch.rows[i]['FORM_ENVELOPE_ID'];
                result.scanTime = fesSearch.rows[i]['FORM_BARCODE_DATE'];
                result.formType = fesSearch.rows[i]['FORM_TYPE'];
                result.fesStatus = fesSearch.rows[i]['FORM_STATUS_TYPE_NAME'];
                result.icoReturnedReason = fesSearch.rows[i]['IMAGE_EXCEPTION_REASON'] || "No image exception returned";
                result.icoAction = fesSearch.rows[i]['IMAGE_EXCEPTION_FREE_TEXT'] || "No image exception returned";
                result.exceptionId = fesSearch.rows[i]['IMAGE_EXCEPTION_ID'];
                if (result.exceptionId) {
                    result.eventOccurredTime = fesSearch.rows[i]['FORM_EVENT_OCCURRED'] || "No event yet";
                    result.eventText = fesSearch.rows[i]['FORM_EVENT_TEXT'] || "No event yet";
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
        var resultArray: FesResult[] = [];
        var timelineSearch = await this.dao.makeQuery(SqlData.fesTimelineSql, [barcode]);
        if (timelineSearch.rows[0]) {
            for (let row of timelineSearch.rows) {
                let result = new FesResult();
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
        var result = await this.dao.makeQuery(SqlData.fesBatchNameSql, [envNo]);
        return result.rows[0]['BATCH_NAME']? result.rows[0]['BATCH_NAME'] : "No batch name found";
    }
}

export default FesService;