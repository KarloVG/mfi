// import { IChartDrzava } from './chart-drzava';
// import { IChartOsoba } from './chart-osoba';

export interface IChartResponse {
    ulazneOsobeLabels: string[];
    ulazneOsobeData: number[];
    izlazneOsobeLabels: string[];
    izlazneOsobeData: number[];
    ulazneDrzaveLabels: string[];
    ulazneDrzaveData: number[];
    izlazneDrzaveLabels: string[];
    izlazneDrzaveData: number[];
}