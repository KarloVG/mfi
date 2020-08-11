import { ISubjectPermission } from './subject-permission';
import { IPredmetKorisnici } from './predmet-korisnici';

export interface CreateSubjektRequest {
    brojPredmeta: string,
    nazivPredmeta: string,
    datumOtvaranja: string | Date,
    statusPredmetaID: number;
    napomena: string,
    predmetKorisnici: IPredmetKorisnici[];
}