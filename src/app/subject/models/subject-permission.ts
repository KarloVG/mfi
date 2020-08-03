export interface ISubjectPermission {
    id?: number,
    korisnikID: number,
    ime: string,
    prezime: string,
    loginName: string,
    email?: string,
    Flag: boolean,
    isFromAd?: boolean
}
