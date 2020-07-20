import { IFinancijskaTransakcija } from 'src/app/shared/models/financijska-transakcija';

export interface ITablicaIzvod {
    izvodID: number,
    predmetID: number,
    brojRacuna: string,
    dateTimeOffset: string | Date,
    brojTransakcija: number,
    brojUplata: number,
    brojIsplata: number,
    racun: string,
    iznosTransakcija: number,
    iznosUplata: number,
    hashDatoteke: string,
    hashAlgoritam: string,
    financijskeTransakcije: IFinancijskaTransakcija[];
}