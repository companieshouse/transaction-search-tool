class SqlData {

    public static transactionSQL: string = 
    `SELECT t.TRANSACTION_ID, o.ORGANISATIONAL_UNIT_DESC
    FROM TRANSACTION t, ORGANISATIONAL_UNIT o
    WHERE t.ORGANISATIONAL_UNIT_ID = o.ORGANISATIONAL_UNIT_ID
    AND t.FORM_BARCODE = :barcode`
    
}

export default SqlData;

