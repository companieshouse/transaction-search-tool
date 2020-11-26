class SqlData {

    public static transactionSQL: string = 
    `SELECT t.FORM_BARCODE, t.TRANSACTION_ID, cb.INCORPORATION_NUMBER, tst.TRANSACTION_STATUS_DESC, tdx.INPUT_DOCUMENT_ID, t.USER_ACCESS_ID
    FROM TRANSACTION t, CORPORATE_BODY cb, TRANSACTION_STATUS_TYPE tst, TRANSACTION_DOC_XML tdx
    WHERE t.CORPORATE_BODY_ID = cb.CORPORATE_BODY_ID AND t.TRANSACTION_ID = tdx.TRANSACTION_ID AND t.TRANSACTION_STATUS_TYPE_ID = tst.TRANSACTION_STATUS_TYPE_ID
    AND t.FORM_BARCODE = :barcode AND ROWNUM = 1`
    
    public static getQueueFromDocumentSQL(documentId: number) {
        return `SELECT at.USER_NAME 
        FROM audit_trail at
        WHERE at.casenum = (
            SELECT casenum 
            FROM case_data 
            WHERE field_name = 'X_QHADOCID' 
            AND proc_id = 26
            AND field_value = '${documentId}'
            AND ROWNUM = 1
        )
        and at.type_id = 1 AND ROWNUM = 1`;
    }

    public static orgUnitSql: string = 
    `SELECT ORGANISATIONAL_UNIT_DESC
    FROM ORGANISATIONAL_UNIT
    WHERE ORGANISATIONAL_UNIT_ID = :org_unit_id`;

    public static userSql: string =
    `SELECT LOGIN_ID
    FROM USER_ACCESS
    WHERE USER_ACCESS_ID = :user_id`
}

export default SqlData;

