export interface IPagedResult<T> {
    itemsCount: number;
    pageCount: number;
    model: T[];
    message: string;
}
