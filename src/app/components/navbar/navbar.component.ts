import { Component, OnInit } from '@angular/core';
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
export class NavbarComponent implements OnInit {
    items: MenuItem[] | undefined;
    constructor(
        private categoriesService: CategoriesService,
        private router: Router
    ) {
        this.items = [
            {
                label: 'Home',
                items: [],
                routerLink: 'products'
            },
            {
                label: 'Categories',
                items: [],
                routerLink: 'products'
            }
        ];
        this.getCategories();
    }

    ngOnInit() { }

    getCategories() {
        this.categoriesService.getAllWithSubCategories().subscribe(res => {
            const category = this.handleCategories(res);
            if (this.items?.length) {
                this.items?.[1]?.items?.push(...category);
                for (let index = 1; index < 5; index++) {
                    if (res[index]) {
                        this.items[index + 1] = {
                            label: res[index - 1].name, command: (event: any) => {
                                this.navigateToCategories(res[index])
                            }
                        }
                    }
                }
                this.items.push({
                    label: 'Brands',
                    routerLink: 'brands'
                })
            }
        })
    }


    handleCategories(data: ICategory[]): any {
        return data.map((data: ICategory, index: number) => {
            return ({
                label: data.name, command: (event: any) => {
                    this.navigateToCategories(data)
                }, items: data.subCategories.length ? this.handleCategories(data.subCategories) : []
            })
        })
    }

    navigateToCategories(data: ICategory) {
        this.router.navigate([`productsByCategory`], {
            queryParams: {
                categoryId: data.id
            }
        })
    }
} 
