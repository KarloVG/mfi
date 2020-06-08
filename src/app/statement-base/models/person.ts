import { ISimpleDropdownItem } from 'src/app/shared/models/simple-dropdown-item';

export interface IPerson {
    OsobaID: number,
    Naziv: string
    TipOsobeId: number,
    TipOsobe?: ISimpleDropdownItem,
    VrstaIdBroja?: ISimpleDropdownItem,
    IdBroj?: number,
    VrstaId?: number
}