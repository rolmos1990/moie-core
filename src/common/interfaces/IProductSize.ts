export interface IProductSize {
    name: string,
    color: string,
    qty: number,
    id?: number
};

export interface IProductDetail {
    reference: string,
    color: string,
    size: string,
    discountPercent: string,
    qty: string
};
