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

@Component({
	selector: 'app-best-products',
	standalone: true,
	imports: [CardModule, ButtonModule, CommonModule, TrimDecimalPipe, PanelModule, CheckboxModule, PaginatorModule, RatingModule],
	templateUrl: './best-products.component.html',
	styleUrl: './best-products.component.scss'
})
export class BestProductsComponent {
	subscription!: Subscription;
	totalCount: number = 0;
	FilterByGender: Array<{ Text: string, Value: number }> = [
		{ Text: "Men", Value: 0 },
		{ Text: "woman", Value: 1 },
	]
	titlePage!: string;
	Brands!: IBrand[];
	Products$!: Observable<IProducts[]>;
	arrOfFilter: Array<number> = [];
	first: number = 0;
	rows: number = 10;
	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private productsService: ProductsService,
		public sanitizer: DomSanitizer
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
		});
	}

	sanitizationImage(image: string): SafeResourceUrl {
		return this.sanitizer.bypassSecurityTrustResourceUrl("data:image/png;base64," + image);
	}

	selectSearch(checked: boolean, value: number) {
		const checkValueInArray = this.arrOfFilter.find((res: number) => res === value);
		if (checked && !checkValueInArray) this.arrOfFilter.push(value);
		else this.arrOfFilter = this.arrOfFilter.filter((res: number) => res !== value);
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
}
