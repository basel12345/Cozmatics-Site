import { TranslateModule } from '@ngx-translate/core';
import { CartService } from '../../shared/services/cart/cart.service';
import { IProducts } from './../../shared/models/products';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TrimDecimalPipe } from '../../shared/pipes/fixed-number.pipe';
import { PanelModule } from 'primeng/panel';
import { CheckboxModule } from 'primeng/checkbox';
import { PaginatorModule } from 'primeng/paginator';
import { RatingModule } from 'primeng/rating';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../shared/services/products/products.service';
import { Observable, Subscription, of } from 'rxjs';
import { IBrand } from '../../shared/models/brand';
import { SliderModule } from 'primeng/slider';
import { ICategory } from '../../shared/models/category';
import { Tags } from '../../shared/models/tags';
import { ICart } from '../../shared/models/cart';
import { PrimeIcons } from 'primeng/api';
import { SidebarModule } from 'primeng/sidebar';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AddVatPipe } from '../../shared/pipes/add-vat.pipe';

@Component({
    selector: 'app-most-popular-products',
    standalone: true,
    imports: [AddVatPipe, SidebarModule, CardModule, ButtonModule, CommonModule, TrimDecimalPipe, PanelModule, CheckboxModule, PaginatorModule, RatingModule, SliderModule, TranslateModule],
    templateUrl: './most-popular-products.component.html',
    styleUrl: './most-popular-products.component.scss'
})
export class MostPopularProductsComponent {
    subscription!: Subscription;
    totalCount: number = 0;
    titlePage!: string;
    Brands!: IBrand[];
    Products$!: Observable<IProducts[]>;
    arrOfFilterBrand: Array<number> = [];
    arrOfFilterCategory: Array<number> = [];
    first: number = 0;
    rows: number = 10;
    rangePrice: number[] = [0, 0];
    Category!: ICategory[];
    Tags = Tags;
    Cart = PrimeIcons.SHOPPING_CART;
    isMobile: boolean = false;
    sidebarVisible: boolean = false;
    lang!: string | null;
    panelBrand: boolean = true;
    panelCategory: boolean = true;
    panelPrice: boolean = true;
	addVatPipe = new AddVatPipe();

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        public productsService: ProductsService,
        public cartService: CartService,
        private breakpointObserver: BreakpointObserver,
        @Inject(PLATFORM_ID) private platformId: object,
    ) {
        if (isPlatformBrowser(this.platformId)) {
            this.lang = localStorage.getItem("lang");
        }
        this.breakpointObserver.observe([Breakpoints.Handset])
            .subscribe(result => {
                this.isMobile = result.matches;
            });
    }

    ngOnInit(): void {
        this.getAllData();
    }

    getAllData() {
        this.getData();
        this.subscription = this.route.data.subscribe(res => {
            this.titlePage = "MostPopularProducts";
            this.Brands = res['Brands'];
            this.Category = res['Category'];
        });
    }

    selectSearch(checked: boolean, value: number) {
        const checkValueInArray = this.arrOfFilterBrand.find((res: number) => res === value);
        if (checked && !checkValueInArray) this.arrOfFilterBrand.push(value);
        else this.arrOfFilterBrand = this.arrOfFilterBrand.filter((res: number) => res !== value);
    }

    selectSearchCategory(checked: boolean, value: number) {
        const checkValueInArray = this.arrOfFilterCategory.find((res: number) => res === value);
        if (checked && !checkValueInArray) this.arrOfFilterCategory.push(value);
        else this.arrOfFilterCategory = this.arrOfFilterCategory.filter((res: number) => res !== value);
    }

    navigateToProduct(id: number) {
        this.router.navigate([`product/${id}`]);
    }

    paginationData() {
        this.getData();
    }

    brandPanalAction() {
        this.panelBrand = !this.panelBrand;
    }

    categoryPanalAction() {
        this.panelCategory = !this.panelCategory;
    }

    pricePanalAction() {
        this.panelPrice = !this.panelPrice;
    }

    getData() {
        const data: {
            mostPopular: boolean
        } = {
            mostPopular: true
        };
        this.productsService.filterSpecificProducts(data).subscribe(res => {
            this.Products$ = of(res.products);
            this.totalCount = res.totalCount;
        })
    }

    addCart(cart: ICart) {
		if(cart.vat) cart.price = this.addVatPipe.transform(cart.price);
        this.cartService.addCart(cart);
    }

    filter() {
        const data: {
            brandIds: number[] | null,
            categoryIds: number[] | null,
            minPrice: number | null,
            maxPrice: number | null,
            mostPopular: boolean
        } = {
            brandIds: null,
            categoryIds: null,
            minPrice: null,
            maxPrice: null,
            mostPopular: true
        };
        data["brandIds"] = this.arrOfFilterBrand;
        data["categoryIds"] = this.arrOfFilterCategory;
        data["minPrice"] = this.rangePrice[0] ? this.rangePrice[0] : null;
        data["maxPrice"] = this.rangePrice[1] ? this.rangePrice[1] : null;
        this.sidebarVisible = false;
        if (data["brandIds"].length || data["categoryIds"].length || data["maxPrice"]) {
            this.productsService.filterSpecificProducts(data).subscribe(res => {
                this.Products$ = of(res.products);
                this.totalCount = res.totalCount;
            })
        } else {
            this.getData()
        }
    }


    onPageChange(event: any) {
        this.productsService.pageNo = event.page + 1;
        this.first = event.first;
        this.rows = event.rows;
        scroll(0, 0);
        this.filter();
    }

    openFilterSideBar() {
        this.sidebarVisible = true;
    }
}
