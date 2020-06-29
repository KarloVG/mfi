export interface IFilterCriteria {
    Naziv?: string,
    NazivB?: string,
    BrojRacuna?: string,
    BrojRacunaB?: string,
    Banka?: string,
    BankaB?: string,
    Drzava?: string,
    DrzavaB?: string,
    DatumTrasakcijeOd?: Date | string,
    DatumTrasakcijeDo?: Date | string,
    IznosOd?: number,
    IznosDo?: number,
    Smjer?: string;
    VrstaTransakcije?: string,
}