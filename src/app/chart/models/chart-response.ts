import { IChartDrzava } from './chart-drzava';
import { IChartOsoba } from './chart-osoba';

export interface IChartResponse {
    izlazneTransakcijePoDrzavi: IChartDrzava[];
    izlazneTransakcijePoOsobi: IChartOsoba[];
    ulazneTransakcijePoDrzavi: IChartDrzava[];
    ulazneTransakcijePoOsobi: IChartOsoba[];
}