class SearchResult {
    formBarcode: string;
    transactionId: number;
    documentId: number;
    incorporationNumber: string;
    chipsStatus: string;
    orgUnit: string;
    user: string;
    userAccessId: number;

    public toString(): string {
        return `SearchResult: ${JSON.stringify(this.getResult())}`;
    }

    public getResult(): Object {
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

export default SearchResult;