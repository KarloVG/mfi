import { ISubjectPermission } from './subject-permission';

export interface ISubject {
    PredmetID: number,
    BrojPredmeta: string,
    NazivPredmeta: string,
    DatumOtvaranja: string | Date,
    StatusPredmeta: number,
    Napomena: string,
    DozvoljeniKorisnici: ISubjectPermission[];
}