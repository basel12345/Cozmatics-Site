import { IProducts } from './../../shared/models/products';
import { Component, ElementRef, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild, viewChild } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription, of } from 'rxjs';
import { TrimDecimalPipe } from '../../shared/pipes/fixed-number.pipe';
import { Panel, PanelModule } from 'primeng/panel';
import { CheckboxModule } from 'primeng/checkbox';
import { PaginatorModule } from 'primeng/paginator';
import { RatingModule } from 'primeng/rating';
import { IBrand } from '../../shared/models/brand';
import { ProductsService } from '../../shared/services/products/products.service';
import { CartService } from '../../shared/services/cart/cart.service';
import { ICart } from '../../shared/models/cart';
import { SliderModule } from 'primeng/slider';
import { ICategory } from '../../shared/models/category';
import { Tags } from '../../shared/models/tags';
import { TranslateModule } from '@ngx-translate/core';
import { PrimeIcons } from 'primeng/api';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { SidebarModule } from 'primeng/sidebar';
import { AddVatPipe } from '../../shared/pipes/add-vat.pipe';

@Component({
	selector: 'app-products',
	standalone: true,
	imports: [AddVatPipe, CardModule, ButtonModule, CommonModule, TrimDecimalPipe, PanelModule, CheckboxModule, PaginatorModule, RatingModule, SliderModule, TranslateModule, SidebarModule],
	templateUrl: './products.component.html',
	styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit, OnDestroy {
	Products$!: Observable<IProducts[]>;
	subscription!: Subscription;
	arrOfFilterBrand: Array<number> = [];
	arrOfFilterCategory: Array<number> = [];
	first: number = 0;
	rows: number = 12;
	branId!: string;
	categoryId!: string;
	Brands!: IBrand[];
	totalCount: number = 0;
	titlePage!: string;
	isFilterByProducts: boolean = false;
	queryParams!: { BrandId: any; CatId: any; Discount: any; Tag: any; };
	rangePrice: number[] = [0, 0];
	Category!: ICategory[];
	Tags = Tags;
	TagValues = [0, 1, 2];
	best!: boolean;
	recent!: boolean;
	mostPopular!: boolean;
	Cart = PrimeIcons.SHOPPING_CART
	isMobile: boolean = false;
	sidebarVisible: boolean = false;
	lang!: string | null;
	panelBrand: boolean = true;
	panelCategory: boolean = true;
	panelPrice: boolean = true;
	tageCategory: boolean = true;
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
		this.route.queryParams.subscribe(res => {
			this.branId = res['brandId'];
			this.categoryId = res['categoryId'];
			if (res['BrandId'] || res['CatId'] || res['Discount'] || res['Tag']) {
				this.isFilterByProducts = res['BrandId'] || res['CatId'] || res['Discount'] || res['Tag'];
				this.queryParams = {
					BrandId: res['BrandId'],
					CatId: res['CatId'],
					Discount: res['Discount'],
					Tag: res['Tag'],
				}
				this.filterProducts(res['BrandId'], res['CatId'], res['Discount'], res['Tag']);
			} else {
				this.getAllData();
			}
		})
	}

	openFilterSideBar() {
		this.sidebarVisible = true;
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

	tagePanalAction() {
		this.tageCategory = !this.tageCategory;
	}

	filterProducts(BrandId: number, CatId: number, Discount: number, Tag: string) {
		const data: { brandIds?: number[], categoryIds?: number[], discount?: number, tags?: number[] } = {}
		if (BrandId) data["brandIds"] = [+BrandId];
		if (CatId) data["categoryIds"] = [+CatId];
		if (Discount) data["discount"] = +Discount;
		if (Tag) data["tags"] = [+Tag];
		this.subscription = this.productsService.filterProducts(data).subscribe((res: { products: IProducts[], totalCount: number }) => {
			this.Products$ = of(res['products']);
			this.totalCount = res['totalCount'];
			this.titlePage = "TotalProducts";
		})
	}

	getAllData() {
		this.subscription = this.route.data.subscribe(res => {
			if (!(res['BrandId'] || res['CatId'] || res['Discount'] || res['Tag'])) {
				if (res['Products']) {
					this.Products$ = of(res['Products']['products']);
					this.totalCount = res['Products']['totalCount'];
					this.titlePage = "TotalProducts";
				}
			}
			this.Brands = res['Brands'];
			this.Category = res['Category'];
		});
		if (this.branId) {
			this.productsService.getProductsByBrandId(this.branId).subscribe((res: { products: IProducts[], totalCount: number }) => {
				this.Products$ = of(res['products']);
				this.totalCount = res?.['totalCount'];
				this.titlePage = res['products'][0]?.brandName;
			});
		}
		else if (this.categoryId) {
			this.productsService.getProductsByCategoryId(this.categoryId).subscribe((res: { products: IProducts[], totalCount: number }) => {
				this.Products$ = of(res['products']);
				this.titlePage = res['products'][0]?.categoryName;
				this.totalCount = res?.['totalCount'];
			});
		}
	}

	navigateToProduct(id: number) {
		this.router.navigate([`product/${id}`]);
	}

	handeleDate(date: string): boolean {
		const creationDate = new Date(date);
		const today = new Date();
		const diffTime = today.getTime() - creationDate.getTime();
		let Difference_In_Days = Math.round(diffTime / (1000 * 3600 * 24));
		return Difference_In_Days < 8 ? true : false;
	}

	selectSearch(checked: boolean, value: number) {
		this.panelBrand = false;
		const checkValueInArray = this.arrOfFilterBrand.find((res: number) => res === value);
		if (checked && !checkValueInArray) this.arrOfFilterBrand.push(value);
		else this.arrOfFilterBrand = this.arrOfFilterBrand.filter((res: number) => res !== value);
	}

	selectSearchCategory(checked: boolean, value: number) {
		this.panelCategory = false;
		const checkValueInArray = this.arrOfFilterCategory.find((res: number) => res === value);
		if (checked && !checkValueInArray) this.arrOfFilterCategory.push(value);
		else this.arrOfFilterCategory = this.arrOfFilterCategory.filter((res: number) => res !== value);
	}

	selectSearchTags(checked: boolean, value: number) {
		this.tageCategory = false;
		if (value === 0) this.mostPopular = checked
		else if (value === 1) this.recent = checked;
		else if (value === 2) this.best = checked;
	}

	onPageChange(event: any) {
		this.productsService.pageNo = event.page + 1;
		this.first = event.first;
		this.rows = event.rows;
		scroll(0, 0);
		if (this.isFilterByProducts) {
			this.filterProducts(this.queryParams.BrandId, this.queryParams.CatId, this.queryParams.Discount, this.queryParams.Tag)
		} else {
			this.filter();
		}
	}

	paginationData() {
		if (this.branId) {
			this.productsService.getProductsByBrandId(this.branId).subscribe((res: { products: IProducts[], totalCount: number }) => {
				this.Products$ = of(res['products']);
				this.totalCount = res.totalCount;
			});
		}
		else if (this.categoryId) {
			this.productsService.getProductsByCategoryId(this.categoryId).subscribe((res: { products: IProducts[], totalCount: number }) => {
				this.Products$ = of(res['products']);
				this.totalCount = res.totalCount;
			});
		}
		else {
			this.subscription = this.productsService.getAllProducts().subscribe((res: { products: IProducts[], totalCount: number }) => {
				this.Products$ = of(res['products']);
				this.totalCount = res.totalCount;
			});
		}
	}

	addCart(cart: ICart) {
		if(cart.vat) cart.price = this.addVatPipe.transform(cart.price);
		console.log(cart);
		this.cartService.addCart(cart);
	}

	filter() {
		const data: {
			brandIds?: number[] | null,
			categoryIds?: number[] | null,
			minPrice?: number | null
			maxPrice?: number | null,
			tags?: number[] | null,
			best: boolean,
			recent: boolean,
			mostPopular: boolean,
		} = {
			brandIds: null,
			categoryIds: null,
			minPrice: 0,
			maxPrice: null,
			tags: null,
			best: false,
			recent: false,
			mostPopular: false,
		};
		data["brandIds"] = this.arrOfFilterBrand;
		data["categoryIds"] = this.arrOfFilterCategory;
		data["best"] = this.best;
		data["recent"] = this.recent;
		data["mostPopular"] = this.mostPopular;
		this.rangePrice[0] ? data["minPrice"] = this.rangePrice[0] : delete data["minPrice"];
		this.rangePrice[1] ? data["maxPrice"] = this.rangePrice[1] : delete data["maxPrice"];
		this.sidebarVisible = false;
		if (data["brandIds"].length || data["categoryIds"].length || data["maxPrice"] || data["best"] || data["recent"] || data["mostPopular"]) {
			this.productsService.filterSpecificProducts(data).subscribe(res => {
				this.Products$ = of(res.products);
				this.totalCount = res.totalCount;
			})
		} else {
			this.paginationData();
		}
	}

	ngOnDestroy(): void {
		this.subscription?.unsubscribe();
		this.productsService.pageNo = 1;
	}
}
