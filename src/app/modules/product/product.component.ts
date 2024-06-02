import { LoadingService } from './../../shared/services/loading/loading.service';
import { FormsModule } from '@angular/forms';
import { IProducts } from './../../shared/models/products';
import { Component, OnInit, EventEmitter, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { RatingModule } from 'primeng/rating';
import { CommonModule, NgFor, NgIf, isPlatformBrowser } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TabViewModule } from 'primeng/tabview';
import { IReview } from '../../shared/models/review';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ReviewService } from '../../shared/services/review/review.service';
import { ToastrService } from 'ngx-toastr';
import { ICart } from '../../shared/models/cart';
import { CartService } from '../../shared/services/cart/cart.service';
import { TrimDecimalPipe } from '../../shared/pipes/fixed-number.pipe';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ProductsService } from '../../shared/services/products/products.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
	selector: 'app-product',
	standalone: true,
	imports: [CommonModule, ScrollPanelModule, ButtonModule, RatingModule, FormsModule, NgFor, TabViewModule, DialogModule, InputTextareaModule, NgIf, TrimDecimalPipe, RadioButtonModule, TranslateModule],
	templateUrl: './product.component.html',
	styleUrl: './product.component.scss'
})
export class ProductComponent implements OnInit {
	product!: IProducts;
	coverImage!: string;
	Review!: IReview[];
	visible: boolean = false;
	sizes!: string;
	colors!: string;
	addReview: {
		comment: string | null;
		rate: number | null;
		productId: number | null;
		customerId: number | null;
	} = {
			comment: null,
			rate: null,
			productId: null,
			customerId: null,
		}
	attributeValuesColors!: { attributeId: number; productId: number; attributeName: string; qty: number; value: string; }[];
	attributeValuesSizes!: { attributeId: number; productId: number; attributeName: string; qty: number; value: string; }[];
	qntySize: number | undefined;
	textNotFoundMessageSize!: string;
	qntyColors: number | undefined;
	textNotFoundMessageColor!: string;
	attributeId: number | undefined;
	constructor(
		private route: ActivatedRoute,
		public sanitizer: DomSanitizer,
		private reviewService: ReviewService,
		private toastr: ToastrService,
		public cartService: CartService,
		private productService: ProductsService,
		@Inject(PLATFORM_ID) private platformId: object,
		private loadingService: LoadingService
	) { }

	ngOnInit(): void {
		this.getProductById();
		if (isPlatformBrowser(this.platformId)) {
			const user = localStorage.getItem("user");
			if (user) {
				this.addReview.customerId = JSON.parse(user).userId;
				this.addReview.productId = this.product.id;
			}
		}
	}

	getQuantityToCart(qty: number): number {
		if(this.qntySize) return this.qntySize;
		else if(this.qntyColors) return this.qntyColors;
		else return qty;
	}

	change(event: string, type: string) {
		if (type === "Sizes" && this.attributeValuesSizes) {
			this.qntySize = this.attributeValuesSizes.find(res => res.value === event)?.qty;
			!this.qntySize ? this.textNotFoundMessageSize = "This Size is not available now" : this.textNotFoundMessageSize = "";
			this.attributeId = this.attributeValuesSizes?.find(res => res.value === event)?.attributeId;
		} else if (type === "Colors" && this.attributeValuesColors) {
			this.qntyColors = this.attributeValuesColors.find(res => res.value === event)?.qty;
			!this.qntyColors ? this.textNotFoundMessageColor = "This Color is not available now" : this.textNotFoundMessageColor = "";
			this.attributeId = this.attributeValuesColors?.find(res => res.value === event)?.attributeId;
		}
	}

	getProductById() {
		this.route.data.subscribe(res => {
			this.product = res["Product"];
			this.Review = res["Review"];
			this.coverImage = this.product.productImgs.find(res => res.isCover)?.image ?? "";
			this.attributeValuesColors = this.product.attributeValues.filter(res => (res.filter((data: any) => data.attributeId === 1)[0]))[0];
			this.attributeValuesSizes = this.product.attributeValues.filter(res => (res.filter((data: any) => data.attributeId === 2)[0]))[0];
			this.attributeValuesColors?.length ? this.colors = this.attributeValuesColors?.[0].value : this.sizes = this.attributeValuesSizes?.[0].value;
			this.change(this.attributeValuesColors?.length ? this.attributeValuesColors?.[0].value : this.attributeValuesSizes?.[0].value, this.attributeValuesColors?.length ? "Colors" : "Sizes");
			this.loadingService.hideLoading();
		});
	}

	sanitizationImage(image: string): SafeResourceUrl {
		return this.sanitizer.bypassSecurityTrustResourceUrl("data:image/png;base64," + image);
	}


	showDialog() {
		if (this.addReview.customerId) {
			this.visible = true;
		} else {
			this.toastr.error('You must login first', 'Error');
		}

	}

	addCart(cart: ICart) {
		this.cartService.addCart(cart);
	}

	addReviewToProduct() {
		this.reviewService.addReview(this.addReview).subscribe(res => {
			this.toastr.success('Review', 'Success');
			this.reviewService.getReviewByProductId("" + this.product.id).subscribe(res => {
				this.productService.getProductById("" + this.product.id).subscribe((product: IProducts) => {
					this.loadingService.hideLoading();
					this.Review = res;
					this.visible = false;
					this.product = product;
				})
			})
		})
	}
}
