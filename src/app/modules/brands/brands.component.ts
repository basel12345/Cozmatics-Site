import { LoadingService } from './../../shared/services/loading/loading.service';
import { CommonModule } from '@angular/common';
import { IBrand } from './../../shared/models/brand';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { InputTextModule } from 'primeng/inputtext';
import { SearchPipe } from '../../shared/pipes/search.pipe';
import { FormsModule } from '@angular/forms';

@Component({
	selector: 'app-brands',
	standalone: true,
	imports: [CommonModule, InputTextModule, SearchPipe, FormsModule],
	templateUrl: './brands.component.html',
	styleUrl: './brands.component.scss'
})
export class BrandsComponent implements OnInit {
	Brands!: IBrand[];
	search!: string;
	constructor(
		private route: ActivatedRoute,
		private router: Router,
		public sanitizer: DomSanitizer,
		private loadingService: LoadingService
	) { }

	ngOnInit(): void {
		this.getAllBrands();
	}

	getAllBrands(): void {
		this.route.data.subscribe(res => {
			this.Brands = res['Brands'];
		});
	}

	sanitizationImage(image: string): SafeResourceUrl {
		return this.sanitizer.bypassSecurityTrustResourceUrl("data:image/png;base64," + image);
	}

	naviateToBraand(id: number) {
		this.router.navigate([`./productsByBrand`], {
			queryParams: {
				brandId: id
			}
		})
	}
}
