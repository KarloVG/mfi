export interface IInnerBaseDetail {
    ID: number;
    a_RN: string; // broj racuna
    a_FIS: string; // swift
    a_FIN: string; // banka
    a_FID: string; // drzava 
    a_NA: string; // naziv
    t_DV: Date; // datum transakcije
    t_REF: string; // referentni broj
    t_VR: string; // vrsta transakcije
    t_DESC: string; // opis
    t_IZ: string; // iznos
    t_VL: string; // valuta
    t_KONV_IZ: number; // konvertirani iznos
    t_DIR: string; // smjer
    b_RN: string; // broj racuna
    b_FIS: string; // swift
    b_FIN: string; // banka
    b_FID: string; // drzava
    b_NA: string; // naziv
}