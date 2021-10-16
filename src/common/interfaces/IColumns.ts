export interface IColumn {
    header: string,
    key: string,
    width?: number,
    outlineLevel?: number,
    type?: string,
    formulae?: any
};

export interface IColumnObj {
    columns: IColumn[]
}
