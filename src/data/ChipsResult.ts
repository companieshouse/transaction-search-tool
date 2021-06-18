class ChipsResult {
    transactionId: number;
    documentId: number;
    incorporationNumber: string;
    chipsStatus: string;
    transactionDate: string;
    userAccessId: number;
    orgUnitId: number;

    public isEmpty() {
        return Object.keys(this).length === 0;
    }
}

export default ChipsResult;