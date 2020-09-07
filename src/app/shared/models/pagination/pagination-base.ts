export interface IPaginationBase {
    page: number;
    pageSize: number;
    orderBy?: string;
    searchString?: string;
    predmetID?: number;
}
