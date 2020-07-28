import { ISubjectPermission } from './subject-permission';

export interface ISubject {
    id?: number,
    predmetID: number,
    brojPredmeta: string,
    nazivPredmeta: string,
    datumOtvaranja: string | Date,
    statusPredmetaID: number,
    statusPredmeta?: string,
    dijagramPredmetaID?: number,
    napomena: string,
    predmetKorisnici: ISubjectPermission[];
}
/*
export interface ISubject {
    id: number,
    predmetID: number,
    brojPredmeta: string,
    nazivPredmeta: string,
    datumOtvaranja: string | Date,
    statusPredmeta: number,
    napomena: string,
    predmetKorisnici: ISubjectPermission[];
}
*/
