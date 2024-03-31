export interface IProducts {
    id: number;
    name: string;
    categoryId: number;
    description: string;
    brandId: number;
    price: number;
    qty: number;
    discountPercentage: number;
    tagName: string;
    coverImg: string;
    brandImg: string;
    rateValue: number;
    totalRate: number;
    brandName: string;
    productImgs: [
        {
            image: string;
            isCover: boolean;
        }
    ]
}