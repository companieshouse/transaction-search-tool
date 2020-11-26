class SearchResult {
    transactionId: number;
    documentId: number;
    orgUnit: string;

    public toString(): string {
        return `SearchResult: [transactionId: ${this.transactionId}, documentId: ${this.documentId}, orgUnit: ${this.orgUnit}]`
    }

    public getResult(): Object {
        return {
            "Transaction Id" : this.transactionId,
            "Document Id" : this.documentId,
            "Org Unit" : this.orgUnit
        };
    }
}

export default SearchResult;