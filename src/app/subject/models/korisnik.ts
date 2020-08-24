export interface IKorisnik {
    createdBy: number;
    dateCreated: Date | string;
    deleted: boolean;
    deletedBy: number;
    ime: string;
    korisnikID: number;
    loginName: string;
    modifiedBy: number;
    prezime: string;
    sid: string;
    trackingState: string;
}