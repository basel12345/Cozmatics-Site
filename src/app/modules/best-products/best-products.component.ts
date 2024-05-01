import { IProducts } from './../../shared/models/products';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TrimDecimalPipe } from '../../shared/pipes/fixed-number.pipe';
import { PanelModule } from 'primeng/panel';
import { CheckboxModule } from 'primeng/checkbox';
import { PaginatorModule } from 'primeng/paginator';
import { RatingModule } from 'primeng/rating';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../shared/services/products/products.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Observable, Subscription, of } from 'rxjs';
import { IBrand } from '../../shared/models/brand';
import { ICategory } from '../../shared/models/category';
import { SliderModule } from 'primeng/slider';
import { Tags } from '../../shared/models/tags';
import { ICart } from '../../shared/models/cart';
import { CartService } from '../../shared/services/cart.service';

@Component({
	selector: 'app-best-products',
	standalone: true,
	imports: [CardModule, ButtonModule, CommonModule, TrimDecimalPipe, PanelModule, CheckboxModule, PaginatorModule, RatingModule, SliderModule],
	templateUrl: './best-products.component.html',
	styleUrl: './best-products.component.scss'
})
export class BestProductsComponent {
	subscription!: Subscription;
	totalCount: number = 0;
	titlePage!: string;
	Brands!: IBrand[];
	Products$!: Observable<IProducts[]>;
	first: number = 0;
	rows: number = 10;
	arrOfFilterBrand: Array<number> = [];
	arrOfFilterCategory: Array<number> = [];
	rangePrice: number[] = [0, 0];
	Category!: ICategory[];
	Tags = Tags;
	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private productsService: ProductsService,
		public sanitizer: DomSanitizer,
		public cartService: CartService
	) { }

	ngOnInit(): void {
		this.getAllData();
	}

	getAllData() {
		this.subscription = this.route.data.subscribe((res) => {
			this.Products$ = of(res['BestProducts']['products']);
			this.totalCount = res['BestProducts']['totalCount'];
			this.titlePage = "Best Products";
			this.Brands = res['Brands'];
			this.Category = res['Category'];
		});
	}

	sanitizationImage(image: string): SafeResourceUrl {
		return this.sanitizer.bypassSecurityTrustResourceUrl("data:image/png;base64," + image);
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
		this.productsService.getBestProducts().subscribe((res: { products: IProducts[], totalCount: number }) => {
			this.Products$ = of(res['products']);
		})
	}

	onPageChange(event: any) {
		this.productsService.pageNo = event.page + 1;
		this.first = event.first;
		this.rows = event.rows;
		this.paginationData();
	}

	addCart(cart: ICart) {
		this.cartService.addCart(cart);
	}

	filter() {
		this.productsService.pageNo = 1;
		const data: {
			brandIds: number[] | null,
			categoryIds: number[] | null,
			minPrice: number | null,
			maxPrice: number | null,
			best: boolean
		} = {
			brandIds: null,
			categoryIds: null,
			minPrice: null,
			maxPrice: null,
			best: true
		};
		data["brandIds"] = this.arrOfFilterBrand;
		data["categoryIds"] = this.arrOfFilterCategory;
		data["minPrice"] = this.rangePrice[0] ? this.rangePrice[0] : null;
		data["maxPrice"] = this.rangePrice[1] ? this.rangePrice[1] : null;
		if (data["brandIds"].length || data["categoryIds"].length || data["maxPrice"]) {
			this.productsService.filterSpecificProducts(data).subscribe(res => {
				this.Products$ = of(res.products);
				this.totalCount = res.totalCount;
			})
		} else {
			this.paginationData();
		}
	}
}
