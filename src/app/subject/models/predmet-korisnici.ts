import { IKorisnik } from './korisnik';

export interface IPredmetKorisnici {
    createdBy: number
    dateCreated: Date | string
    deleted: boolean
    deletedBy: number
    korisnik: IKorisnik;
    korisnikID: number
    modifiedBy: number
    predmetID: number
    trackingState: string
}