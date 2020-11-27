class BarcodeSearchModel {
    formBarcode: string;
    transactionId: number;
    documentId: number;
    incorporationNumber: string;
    chipsStatus: string;
    orgUnit: string;
    user: string;

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
            "User" : this.user
        };
    }
}

export default BarcodeSearchModel;