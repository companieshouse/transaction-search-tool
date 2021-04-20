class ChipsResult {
    transactionId: number;
    documentId: number;
    incorporationNumber: string;
    chipsStatus: string;
    transactionDate: string;

    public isEmpty() {
        return Object.keys(this).length === 0;
    }
}

export default ChipsResult;