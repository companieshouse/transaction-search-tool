class ChipsResult {
    barcode: string;
    transactionId: number;
    documentId: number;
    incorporationNumber: string;
    chipsStatus: string;
    transactionDate: string;
    userAccessId: number;
    orgUnitId: number;
    orgUnit: string;
    userLogin: string;

    public isEmpty() {
        return Object.keys(this).length === 0;
    }
}

export default ChipsResult;