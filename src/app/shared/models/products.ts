export interface IProducts {
    id: number;
    name: string;
    categoryId: number;
    description: string;
    brandId: number;
    price: number;
    qty: number;
    discountPercentage: number;
    tag: number;
    coverImg: string;
    brandImg: string;
    rateValue: number;
    totalRate: number;
    categoryName: string;
    brandName: string;
    vat: number;
    productImgs: [
        {
            imagePath: string;
            isCover: boolean;
        }
    ];
    attributeValues: Array<any>;
    hasAttr: boolean;
    creationDate?: string;
    imagePath: string;
}