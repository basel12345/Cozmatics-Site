import { FormsModule } from '@angular/forms';
import { IProducts } from './../../shared/models/products';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { RatingModule } from 'primeng/rating';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TabViewModule } from 'primeng/tabview';
import { IReview } from '../../shared/models/review';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ReviewService } from '../../shared/services/review/review.service';
import { ToastrService } from 'ngx-toastr';
import { ICart } from '../../shared/models/cart';
import { CartService } from '../../shared/services/cart.service';
import { TrimDecimalPipe } from '../../shared/pipes/fixed-number.pipe';

@Component({
	selector: 'app-product',
	standalone: true,
	imports: [CommonModule, ScrollPanelModule, ButtonModule, RatingModule, FormsModule, NgFor, TabViewModule, DialogModule, InputTextareaModule, NgIf, TrimDecimalPipe],
	templateUrl: './product.component.html',
	styleUrl: './product.component.scss'
})
export class ProductComponent implements OnInit {
	product!: IProducts;
	coverImage!: string;
	Review!: IReview[];
	visible: boolean = false;
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
	constructor(
		private route: ActivatedRoute,
		public sanitizer: DomSanitizer,
		private reviewService: ReviewService,
		private toastr: ToastrService,
		public cartService: CartService
	) { }

	ngOnInit(): void {
		this.getProductById();
		const user = localStorage.getItem("user");
		if (user) {
			this.addReview.customerId = JSON.parse(user).userId;
			this.addReview.productId = this.product.id;
		}

	}

	getProductById() {
		this.route.data.subscribe(res => {
			this.product = res["Product"];
			this.Review = res["Review"];
			this.coverImage = this.product.productImgs.find(res => res.isCover)?.image ?? "";
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
			this.reviewService.getReviewByProductId(""+this.product.id).subscribe(res => {
				this.Review = res;
				this.visible = false;
			})
		})
	}
}
