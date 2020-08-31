import { IInnerBaseDetail } from './inner-base-detail';
import { IBaseExtract } from './base-extract';

export interface IBaseItem {
    osobaID: number,
    naziv: string,
    izvodi?: IBaseExtract[],
    uvezeneIzliste?: number,
    brojTransakcija?: number,
    brojIsplata?: number,
    brojUplata?: number,
    iznosTransakcija?: number,
    iznosUplata?: number,
    iznosIsplata?: number
}