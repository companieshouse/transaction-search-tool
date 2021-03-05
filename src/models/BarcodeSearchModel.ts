class BarcodeSearchModel {
    formBarcode: string;
    incorporationNumber: string;
    chipsStatus: string;
    orgUnit: string;
    user: string;
    formType: string;
    fesStatus: string;

    public toString(): string {
        return `BarcodeSearchModel: ${JSON.stringify(this.getModel())}`;
    }

    public getModel(): Object {
        return {
            "Barcode" : this.formBarcode,
            "Allocated to" : this.user,
            "Company number" : this.incorporationNumber,
            "Type" : this.formType,
            "Chips Status" : this.chipsStatus,
            "FES Status" : this.fesStatus,
            "Location" : this.orgUnit,
        
        };
    }
}

export default BarcodeSearchModel;