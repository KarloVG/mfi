export interface ITirmItem {
    ID: number
    TemeljTrazenja: string;
    Status?: string;
    VrstaTrazenja: string;
    Vrsta: string;
    Clanak: string;
    RazloziTrazenja: string;
    UrudzbeniBroj: string;
    OPKP: string;
    Podnositelj: string;
    UstrojstvenaJedinica: string;
    Stvoren: Date | string;
}