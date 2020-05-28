export interface IInnerbaseItem {
    ID: number;
    Izvor: string;
    SWIFT: string;
    BrojRacuna: string;
    DatumUvoza: Date;
    Naziv: string;
    IzvodOd: Date;
    IzvodDo: Date;
    BrTransakcija: string;
    IznosTransakcija: string;
    BaseItemID: number;
    BrUplata?: number;
    BrIsplata?: number;
    IznosUplata?: string;
    IznosIsplata?: string;
}