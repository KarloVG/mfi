import { ISimpleDropdownItem } from 'src/app/shared/models/simple-dropdown-item';

export interface IPerson {
    OsobaID: number,
    Naziv: string
    TipOsobe: ISimpleDropdownItem
    IdBroj: number,
    VrstaIdBroja: ISimpleDropdownItem
}