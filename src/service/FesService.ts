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
        console.log(fesSearch.rows[0]);
        result.envNo = fesSearch.rows[0]['FORM_ENVELOPE_ID'];
        result.scanTime = fesSearch.rows[0]['FORM_BARCODE_DATE'];
        result.formIdentification = fesSearch.rows[0]['FORM_ID'];
        result.fesStatus = fesSearch.rows[0]['FORM_STATUS'];
        result.icoReturnedReason = fesSearch.rows[0]['IMAGE_EXCEPTION_REASON'] || "No image exception returned";
        result.icoAction = fesSearch.rows[0]['IMAGE_EXCEPTION_FREE_TEXT'] || "No image exception returned";
        return result;
    }
}

export default FesService;