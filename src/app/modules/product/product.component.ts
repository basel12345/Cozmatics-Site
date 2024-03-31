import { FormsModule } from '@angular/forms';
import { IProducts } from './../../shared/models/products';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { RatingModule } from 'primeng/rating';
import { NgFor } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
	selector: 'app-product',
	standalone: true,
	imports: [ScrollPanelModule, ButtonModule, RatingModule, FormsModule, NgFor],
	templateUrl: './product.component.html',
	styleUrl: './product.component.scss'
})
export class ProductComponent implements OnInit {
	product!: IProducts;
	coverImage!: string;
	constructor(
		private route: ActivatedRoute,
		public sanitizer: DomSanitizer
	) { }

	ngOnInit(): void {
		this.getProductById();
	}

	getProductById() {
		this.route.data.subscribe(res => {
			this.product = res["Product"];
			this.coverImage = this.product.productImgs.find(res => res.isCover)?.image ?? "";
		});
	}

	sanitizationImage(image: string): SafeResourceUrl {
		return this.sanitizer.bypassSecurityTrustResourceUrl("data:image/png;base64," + image);
	}

}
