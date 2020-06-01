import { IPerson } from './person';

export interface IBaseItem {
    ID: number,
    Osoba: IPerson,
    UvezeneIzliste: number,
    BrojTransakcija: string,
    IznosTransakcija: string
}