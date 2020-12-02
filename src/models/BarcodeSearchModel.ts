class BarcodeSearchModel {
    formBarcode: string;
    transactionId: number;
    documentId: number;
    incorporationNumber: string;
    chipsStatus: string;
    orgUnit: string;
    user: string;
    envNo: number;
    scanTime: string;
    formIdentification: number;
    fesStatus: number;
    icoReturnedReason: string;
    icoAction: string;

    public toString(): string {
        return `BarcodeSearchModel: ${JSON.stringify(this.getModel())}`;
    }

    public getModel(): Object {
        return {
            "Barcode" : this.formBarcode,
            "Transaction Id" : this.transactionId,
            "Document Id" : this.documentId,
            "Incorp No." : this.incorporationNumber,
            "Chips Status" : this.chipsStatus,
            "Org Unit" : this.orgUnit,
            "User" : this.user,
            "Env No" : this.envNo,
            "Scan Time": this.scanTime,
            "Form Id" : this.formIdentification,
            "FES Status" : this.fesStatus,
            "ICO Returned Reason" : this.icoReturnedReason,
            "ICO Action" : this.icoAction
        
        };
    }
}

export default BarcodeSearchModel;