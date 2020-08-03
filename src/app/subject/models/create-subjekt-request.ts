import { ISubjectPermission } from './subject-permission';

export interface CreateSubjektRequest {
    brojPredmeta: string,
    nazivPredmeta: string,
    datumOtvaranja: string | Date,
    statusPredmetaID: number;
    napomena: string,
    predmetKorisnici: ISubjectPermission[];
}