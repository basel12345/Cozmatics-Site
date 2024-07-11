export interface ICart {
    id: number;
    name: string;
    price: number;
    qty: number;
    discountPercentage: number;
    coverImg: string;
    attrValueId?: number | undefined;
    attributeValue?: string | undefined
    num?: number;
}