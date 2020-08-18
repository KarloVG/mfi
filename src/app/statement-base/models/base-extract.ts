export interface IBaseExtract {
    IzvodID: number;
    PredmetID: number;
    OsobaID: number;
    BrojRacuna: string;
    DatumVrijemeOd: string | Date;
    DatumVrijemeDo: string | Date; 
    DatumVrijemeUvoza: string | Date; 
    BrojTransakcija: number; 
    BrojIsplata: number;  
    Racun: string; 
    IznosTransakcija: number; 
    IznosUplata: number;
    IznosIsplata: number;
    HashDatoteke: string;  
    HashAlgoritam : string;
    brojTransakcija?: number,
    brojIsplata?: number,
    brojUplata?: number,
    iznosTransakcija?: number,
    iznosUplata?: number,
    iznosIsplata?: number
}