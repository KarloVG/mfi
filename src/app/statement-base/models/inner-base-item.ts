export interface IInnerbaseItem {
    izvodID: number;
    banka: string;
    swift: string;
    brojRacuna: string;
    datumVrijemeUvoza: Date;
    nazivOsobe: string;
    datumVrijemeOd: Date | string;
    datumVrijemeDo: Date | string;
    brojTransakcija: string;
    iznosTransakcija: string;
    BaseItemID: number;
    brojUplata?: number;
    brojIsplata?: number;
    iznosUplata?: string;
    iznosIsplata?: string;
}