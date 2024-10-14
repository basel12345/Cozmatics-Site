import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { InputTextModule } from 'primeng/inputtext';
import { CategoriesService } from '../../shared/services/categories/categories.service';
import { Router } from '@angular/router';
import { ICategory } from '../../shared/models/category';
import { ProductsService } from '../../shared/services/products/products.service';
import { LoadingService } from '../../shared/services/loading/loading.service';
import { AutoCompleteCompleteEvent, AutoCompleteModule, AutoCompleteSelectEvent } from 'primeng/autocomplete';
import { isPlatformBrowser, CommonModule } from '@angular/common';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [MenubarModule, InputTextModule, AutoCompleteModule, FormsModule, TranslateModule, CommonModule],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
    items: MenuItem[] | undefined;
    lang!: string | null;
    constructor(
        private categoriesService: CategoriesService,
        private router: Router,
        private translateService: TranslateService,
        private productService: ProductsService,
        private loadingService: LoadingService,
        @Inject(PLATFORM_ID) private platformId: object,

    ) {
        if (isPlatformBrowser(this.platformId)) {
            this.lang = localStorage.getItem("lang");
            this.items = [
                {
                    label: this.lang === "ar" ? "الصفحة الرئيسية" : this.translateService.instant('Home'),
                    items: [],
                    routerLink: 'home'
                },
                {
                    label: this.lang === "ar" ? "الأقسام" : this.translateService.instant('Categories'),
                    items: [],
                    routerLink: 'products'
                }
            ];
        }
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
                                this.navigateToCategories(res[index - 1])
                            }
                        }
                    }
                }
                this.items.push({
                    label: this.lang === "ar" ? "العلامات التجارية" : this.translateService.instant('Brands'),
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
