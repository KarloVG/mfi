import { IGraphList } from './graph-list';

export interface IGraphDataResponse {
    labeleI: string[];
    iznosiI: number[];
    podaciI: IGraphList[];
    labeleU: string[];
    iznosiU: number[];
    podaciU: IGraphList[];
}
