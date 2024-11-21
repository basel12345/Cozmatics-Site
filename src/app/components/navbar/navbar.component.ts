import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, Inject, OnInit, PLATFORM_ID } from '@angular/core';
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
    resultSearch: any;
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
                }
            ];
        }
        this.getCategories();
    }

    ngOnInit() { }



    @HostListener('document:click', ['$event'])
    handleClickOutside(event: MouseEvent) {
        const menu = document.querySelector('.p-menubar');
        const menubarBtn = document.getElementsByClassName("p-menubar-button")[0] as HTMLElement;
        if (menu && !menu.contains(event.target as Node) && menubarBtn.getAttribute('aria-expanded') === 'true') {
            menubarBtn.click();
        }
    }

    getCategories() {
        this.categoriesService.getAllWithSubCategories().subscribe(res => {
            const category = this.handleCategories(res);
            if (this.items?.length) {
                this.items?.[1]?.items?.push(...category);
                this.items?.[1]?.items?.unshift({
                    label: this.lang === "ar" ? "الكل" : "ALL",
                    routerLink: 'products'
                })
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

    searchGolbal(event: any) {
        if (event.target.value) {
            this.productService.searchGolbal(event.target.value).subscribe(res => {
                this.resultSearch = res;
            })
        }
    }

    selectValue(event: AutoCompleteSelectEvent) {
        if (event.value.type === 0)
            this.router.navigate([`product/${event.value.key}`]);
        else if (event.value.type === 1) {
            this.router.navigate([`productsByCategory`], {
                queryParams: {
                    categoryId: event.value.key
                }
            });
        }
        else if (event.value.type === 3) {
            this.router.navigate([`productsByBrand`], {
                queryParams: {
                    brandId: event.value.key
                }
            });
        }
    }


    handleCategories(data: ICategory[], prevD?: ICategory): any {
        if (prevD) {
            data.unshift({
                id: prevD.id,
                name: this.lang === "ar" ? "الكل" : "ALL",
                description: "",
                icon: "",
                parentId: 0,
                isSelected: false,
                subCategories: [],
                img: "",
                imagePath: "",
            })
        }
        return data.map((data: ICategory, index: number) => {
            return ({
                label: data.name, command: (event: any) => {
                    if (data.subCategories.length) return;
                    this.navigateToCategories(data)
                }, items: data.subCategories.length ? this.handleCategories(data.subCategories, data) : []
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
