import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { InputTextModule } from 'primeng/inputtext';
import { CategoriesService } from '../../shared/services/categories/categories.service';
import { Router } from '@angular/router';
import { ICategory } from '../../shared/models/category';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [MenubarModule, InputTextModule],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
    items: MenuItem[] | undefined;
    constructor(
        private categoriesService: CategoriesService,
        private router: Router
    ) {

    }

    ngOnInit() {
        this.items = [
            {
                label: 'Categories',
                items: [],
                routerLink: 'products'
            }
        ];
        this.getCategories();
    }

    getCategories() {
        this.categoriesService.getAllCategories().subscribe((res: ICategory[]) => {
            const category = res.map((data: ICategory, index: number) => ({
                label: data.name, command: (event: any) => {
                    this.navigateToCategories(data)
                }
            }))
            if (this.items?.length) {
                this.items?.[0]?.items?.push(...category);
                for (let index = 0; index < 4; index++) {
                    this.items[index + 1] = {
                        label: res[index].name, command: (event: any) => {
                            this.navigateToCategories(res[index])
                        }
                    }
                }
                this.items.push({
                    label: 'Brands',
                    routerLink: 'brands'
                })
            }
        });
    }

    navigateToCategories(data: ICategory) {
        this.router.navigate([`productsByCategory`], {
            queryParams: {
                categoryId: data.id
            }
        })
    }
} 
