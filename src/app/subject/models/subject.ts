import { ISubjectPermission } from './subject-permission';

export interface ISubject {
    id?: number,
    predmetID: number,
    brojPredmeta: string,
    nazivPredmeta: string,
    datumOtvaranja: string | Date,
    statusPredmetaID: number,
    statusPredmeta?: any,
    dijagramPredmetaID?: number,
    napomena: string,
    predmetKorisnici: ISubjectPermission[];
}
