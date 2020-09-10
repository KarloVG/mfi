export interface ICreateGraphDataRequest {
    osobaID: number;
    izvodID: number;
    timespanID: number
    datumOd: Date | string;
    datumDo: Date | string;
    filterValues?: any
}