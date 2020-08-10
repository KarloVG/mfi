import { ISubjectPermission } from './subject-permission';
import { ISimpleDropdownItem } from 'src/app/shared/models/simple-dropdown-item';
import { IPredmetKorisnici } from './predmet-korisnici';

export interface ISubject {
    id?: number,
    predmetID: number,
    brojPredmeta: string,
    nazivPredmeta: string,
    datumOtvaranja: string | Date,
    statusPredmeta: ISimpleDropdownItem,
    statusPredmetaID: number;
    napomena: string,
    predmetKorisnici: IPredmetKorisnici[];
}
