export interface IReview {
    id?: number;
    comment: string;
    rate: number;
    productId: number;
    customerId: number;
    customerName: string;
    createdOn: string;
}