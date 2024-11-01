import { LoadingService } from './../../shared/services/loading/loading.service';
import { FormsModule } from '@angular/forms';
import { IAdvertisement } from './../../shared/models/advertisement';
import { IProducts } from './../../shared/models/products';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
import { IBrand } from '../../shared/models/brand';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router } from '@angular/router';
import { TrimDecimalPipe } from '../../shared/pipes/fixed-number.pipe';
import { ICategory } from '../../shared/models/category';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RatingModule } from 'primeng/rating';
import { CartService } from '../../shared/services/cart/cart.service';
import { ICart } from '../../shared/models/cart';
import { Tags } from '../../shared/models/tags';
import { TranslateModule } from '@ngx-translate/core';
import { PrimeIcons } from 'primeng/api';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
	selector: 'app-home',
	standalone: true,
	imports: [CarouselModule, ButtonModule, TrimDecimalPipe, RatingModule, FormsModule, TranslateModule, SkeletonModule],
	templateUrl: './home.component.html',
	styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
	responsiveOptions: any[] | undefined;
	brands!: IBrand[];
	@ViewChildren('sectionRef') sectionRef!: QueryList<any>;
	products!: IProducts[];
	selectedCategories!: ICategory[];
	Advertisement!: IAdvertisement[];
	discountAdvertisement!: IAdvertisement[];
	mostPopularAdvertisement!: IAdvertisement[];
	RecentProducts!: IProducts[];
	brandIdAdvertisement!: IAdvertisement[];
	BestProducts!: IProducts[];
	Tags = Tags;
	MostPopularProducts!: IProducts[];
	lang!: string | null;
	Cart = PrimeIcons.SHOPPING_CART
	constructor(
		private route: ActivatedRoute,
		public sanitizer: DomSanitizer,
		private router: Router,
		public cartService: CartService,
		private loadingService: LoadingService
	) {
	}
	ngOnInit(): void {
		this.getDataHome();
		this.responsiveOptions = [
			{
				breakpoint: '1199px',
				numVisible: 1,
				numScroll: 1
			},
			{
				breakpoint: '991px',
				numVisible: 1,
				numScroll: 1
			},
			{
				breakpoint: '767px',
				numVisible: 1,
				numScroll: 1
			}
		];
	}

	getDataHome() {
		this.route.data.subscribe(res => {
			this.brands = res['Brands'];
			this.products = res['Products']?.products;
			this.selectedCategories = res['selectedCategories'];
			this.Advertisement = res['Advertisement'];
			this.RecentProducts = res['RecentProducts']['products'];
			this.BestProducts = res['BestProducts']['products'];
			this.MostPopularProducts = this.products.filter(res => res.tag === 0);
			this.discountAdvertisement = this.Advertisement.filter((res: IAdvertisement) => res.discount);
			this.brandIdAdvertisement = this.Advertisement.filter((res: IAdvertisement) => res.brandId);
			this.lang = localStorage.getItem("lang");
		});
	}

	sanitizationImage(image: string): SafeResourceUrl {
		return this.sanitizer.bypassSecurityTrustResourceUrl("data:image/png;base64," + image);
	}

	categories(id: number) {
		this.router.navigate(['productsByCategory'], {
			queryParams: {
				categoryId: id
			}
		})
	}

	advertisement(BrandId: number, CatId: number, Discount: number, Tag: number) {
		const queryParams: { BrandId?: number, CatId?: number, Discount?: number, Tag?: number } = {};
		queryParams['BrandId'] = BrandId;
		queryParams['CatId'] = CatId;
		queryParams['Discount'] = Discount;
		queryParams['Tag'] = Tag;
		this.router.navigate(['/products'], {
			queryParams
		});
	}

	recentProductsPage() {
		this.router.navigate(["RecentProducts"])
	}

	navigateToProduct(id: number) {
		this.router.navigate([`product/${id}`]);
	}

	navigateToBrands(brandId: number) {
		const queryParams: { brandId?: number } = {};
		queryParams['brandId'] = brandId;
		this.router.navigate(['/productsByBrand'], {
			queryParams
		});
	}

	bestProductsPage() {
		this.router.navigate(["/BestProducts"])
	}

	mostPopularProducts() {
		this.router.navigate(["/mostPopularProducts"])
	}

	addCart(cart: ICart) {
		this.cartService.addCart(cart);
	}

}
