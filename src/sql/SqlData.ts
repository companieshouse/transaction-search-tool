class SqlData {

    public static transactionSQL: string = 
        `SELECT t.FORM_BARCODE, t.TRANSACTION_ID, TO_CHAR(t.TRANSACTION_STATUS_DATE, 'DD-MM-YYYY HH:MI:SS') as "TRANSACTION_STATUS_DATE",
        t.TRANSACTION_STATUS_TYPE_ID, t.USER_ACCESS_ID, t.ORGANISATIONAL_UNIT_ID, cb.INCORPORATION_NUMBER
        FROM TRANSACTION t LEFT OUTER JOIN CORPORATE_BODY cb
        ON t.CORPORATE_BODY_ID = cb.CORPORATE_BODY_ID
        WHERE t.FORM_BARCODE = :barcode AND ROWNUM = 1`
    
    public static chipsIncorporationNumberSQL: string = 
        `SELECT t.FORM_BARCODE, t.TRANSACTION_ID, TO_CHAR(t.TRANSACTION_STATUS_DATE, 'DD-MM-YYYY HH:MI:SS') as "TRANSACTION_STATUS_DATE",
        t.TRANSACTION_STATUS_TYPE_ID, t.USER_ACCESS_ID, t.ORGANISATIONAL_UNIT_ID, cb.INCORPORATION_NUMBER, tt.TRANSACTION_TYPE_SHORT_NAME,
        tdx.INPUT_DOCUMENT_ID, tst.TRANSACTION_STATUS_DESC
        FROM TRANSACTION t RIGHT OUTER JOIN CORPORATE_BODY cb
        ON t.CORPORATE_BODY_ID = cb.CORPORATE_BODY_ID
        LEFT OUTER JOIN TRANSACTION_TYPE tt ON t.TRANSACTION_TYPE_ID = tt.TRANSACTION_TYPE_ID
        LEFT OUTER JOIN TRANSACTION_DOC_XML tdx ON t.TRANSACTION_ID = tdx.TRANSACTION_ID
        LEFT OUTER JOIN TRANSACTION_STATUS_TYPE tst ON t.TRANSACTION_STATUS_TYPE_ID = tst.TRANSACTION_STATUS_TYPE_ID
        WHERE cb.INCORPORATION_NUMBER = :incno AND t.FORM_BARCODE IS NOT NULL`
    
    public static transactionXMLDocSQL =
        `SELECT tdx.INPUT_DOCUMENT_ID
        FROM TRANSACTION_DOC_XML tdx
        WHERE tdx.TRANSACTION_ID =:transactionID`

    public static transactionStatusTypeSQL =
        `SELECT tst.TRANSACTION_STATUS_DESC
        FROM TRANSACTION_STATUS_TYPE tst
        WHERE tst.TRANSACTION_STATUS_TYPE_ID = :transactionStatusID`
    
    public static getQueueAndUserFromDocumentSQL: string =
    `SELECT O_QUEUENAME, O_QPARAM1, O_CASENUM
    FROM STAFFO SO
    INNER JOIN CASE_DATA CD
    ON SO.O_CASENUM = CD.CASENUM
    WHERE CD.FIELD_NAME = 'X_QHADOCID'
    AND CD.FIELD_VALUE = :documentId
    AND ROWNUM = 1`

    public static getAuditTrailDate: string =
    `SELECT MIN(AUDIT_DATE)
    FROM AUDIT_TRAIL
    WHERE CASENUM = :casenum`

    public static orgUnitSql: string = 
    `SELECT ORGANISATIONAL_UNIT_DESC
    FROM ORGANISATIONAL_UNIT
    WHERE ORGANISATIONAL_UNIT_ID = :org_unit_id`;

    public static userSql: string =
    `SELECT LOGIN_ID
    FROM USER_ACCESS
    WHERE USER_ACCESS_ID = :user_id`;

    public static fesTransactionSql: string =
    `SELECT f.FORM_ENVELOPE_ID, TO_CHAR(f.FORM_BARCODE_DATE, 'DD-MM-YYYY HH:MI:SS') as "FORM_BARCODE_DATE", f.FORM_TYPE, fst.FORM_STATUS_TYPE_NAME, f.FORM_IMAGE_ID
    FROM FORM_STATUS_TYPE fst, FORM f
    WHERE FORM_BARCODE = :barcode
    AND fst.FORM_STATUS_TYPE_ID = f.FORM_STATUS`

    public static fesIncorporationNumberSql: string =
    `SELECT f.FORM_BARCODE, f.FORM_ENVELOPE_ID, TO_CHAR(f.FORM_BARCODE_DATE, 'DD-MM-YYYY HH:MI:SS') as "FORM_BARCODE_DATE", f.FORM_TYPE,
    fst.FORM_STATUS_TYPE_NAME, f.FORM_IMAGE_ID, ie.IMAGE_EXCEPTION_REASON, ie.IMAGE_EXCEPTION_FREE_TEXT, ie.IMAGE_EXCEPTION_ID,
    fe.FORM_EVENT_OCCURRED, fe.FORM_EVENT_TEXT
    FROM FORM_STATUS_TYPE fst, FORM f
    LEFT OUTER JOIN IMAGE_EXCEPTION ie ON f.FORM_IMAGE_ID = ie.IMAGE_EXCEPTION_IMAGE_ID 
    LEFT OUTER JOIN FORM_EVENT fe ON ie.IMAGE_EXCEPTION_ID = fe.FORM_EVENT_IMAGE_EXCEPTION_ID
    WHERE f.FORM_INCORPORATION_NUMBER = :incno
    AND fst.FORM_STATUS_TYPE_ID = f.FORM_STATUS AND f.FORM_BARCODE IS NOT NULL`

    public static fesImageExceptionSql: string = 
    `SELECT ie.IMAGE_EXCEPTION_REASON, ie.IMAGE_EXCEPTION_FREE_TEXT, ie.IMAGE_EXCEPTION_ID
    FROM IMAGE_EXCEPTION ie
    WHERE ie.IMAGE_EXCEPTION_IMAGE_ID = :imageId`

    public static fesRescannedSql: string =
    `SELECT FORM_EVENT_OCCURRED, FORM_EVENT_TEXT
    FROM FORM_EVENT
    WHERE FORM_EVENT_IMAGE_EXCEPTION_ID = :exceptionId`

    public static fesBatchNameSql: string =
    `SELECT b.BATCH_NAME 
    FROM BATCH b, ENVELOPE e
    WHERE e.ENVELOPE_BATCH_ID = b.BATCH_ID
    AND e.ENVELOPE_ID = :formEnvelopeId`

    public static fesTimeLineSql: string =
    `SELECT fe.FORM_EVENT_OCCURRED, fet.FORM_EVENT_TYPE_NAME, f.FORM_ORG_UNIT_NAME, f.FORM_USER_ID
    FROM FORM f, FORM_EVENT fe, FORM_EVENT_TYPE fet
    WHERE fe.FORM_EVENT_TYPE_ID = fet.FORM_EVENT_TYPE_ID
    AND f.FORM_ID = fe.FORM_EVENT_FORM_ID
    and f.FORM_BARCODE = :barcode`
}

export default SqlData;

