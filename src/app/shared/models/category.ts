export interface ICategory {
    id: number;
    name: string,
    description: string;
    icon: string;
    parentId: number;
    isSelected: boolean,
    subCategories: []
}