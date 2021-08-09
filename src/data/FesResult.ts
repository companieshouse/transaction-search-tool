class FesResult {
    barcode: string;
    incorporationNumber: string;
    envNo: number;
    scanTime: string;
    formType: string;
    fesStatus: string;
    icoReturnedReason: string;
    icoAction: string;
    exceptionId: number;
    eventOccurredTime: string;
    eventText: string;
    batchName: string;

    public isEmpty() {
        return Object.keys(this).length === 0;
    }
}

export default FesResult;