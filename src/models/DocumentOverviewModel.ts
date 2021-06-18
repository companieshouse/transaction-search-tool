import BarcodeSearchModel from "./BarcodeSearchModel";

class DocumentOverviewModel extends BarcodeSearchModel {
    transactionId: number;
    documentId: number;
    envNo: number;
    batchName: string;
    scanTime: string;
    icoReturnedReason: string;
    icoAction: string;
    eventOccurredTime: string;
    eventText: string;
    transactionDate: string;

    public toString(): string {
        return `DocumentOverviewModel: ${JSON.stringify(this.getModel())}`;
    }

    public getModel(): Object {
        return {
            "Barcode" : this.formBarcode,
            "User" : this.user,
            "CoNumb" : this.incorporationNumber,
            "Type" : this.formType,
            "ChipsStatus" : this.chipsStatus,
            "FESStatus" : this.fesStatus,
            "Location" : this.orgUnit,
            "TransactionId" : this.transactionId,
            "DocumentId" : this.documentId,
            "EnvNo" : this.envNo,
            "BatchName" : this.batchName,
            "ScanTime": this.scanTime,
            "ICOReturnedReason" : this.icoReturnedReason,
            "ICOAction" : this.icoAction,
            "eventOccurredTime" : this.eventOccurredTime,
            "eventText" : this.eventText,
            "TransactionDate" : this.transactionDate
        };
    }
}

export default DocumentOverviewModel;