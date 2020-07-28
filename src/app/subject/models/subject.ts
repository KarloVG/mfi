import { ISubjectPermission } from './subject-permission';

export interface ISubject {
    id: number,
    PredmetID: number,
    BrojPredmeta: string,
    NazivPredmeta: string,
    DatumOtvaranja: string | Date,
    StatusPredmeta: number,
    Napomena: string,
    DozvoljeniKorisnici: ISubjectPermission[];
}