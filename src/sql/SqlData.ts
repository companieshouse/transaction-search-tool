class SqlData {

    public static transactionSQL: string = 
    `SELECT t.TRANSACTION_ID, tdx.INPUT_DOCUMENT_ID
    FROM TRANSACTION t, TRANSACTION_DOC_XML tdx
    WHERE t.TRANSACTION_ID = tdx.TRANSACTION_ID
    AND t.FORM_BARCODE = :barcode`;
    
    public static getQueueFromDocumentSQL(documentId: number) {
        return `SELECT at.USER_NAME 
        FROM case_information ci, audit_trail at
        WHERE ci.casenum = (
            SELECT casenum 
            FROM case_data 
            WHERE field_name = 'X_QHADOCID' 
            AND proc_id = 26
            AND field_value = '${documentId}'
        )
        and ci.casenum = at.casenum
        and at.type_id = 1`;
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

