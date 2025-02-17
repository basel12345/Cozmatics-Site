import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Component, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTiktok, faSnapchat, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { CategoriesService } from '../../shared/services/categories/categories.service';
import { ICategory } from '../../shared/models/category';
import { Router, RouterModule } from '@angular/router';
import { faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [FontAwesomeModule, TranslateModule, CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent implements OnInit {
  faTiktok = faTiktok;
  faPhone = faPhone;
  faWhatsapp = faWhatsapp;
  faEnvelope = faEnvelope;
  faSnapchat = faSnapchat;
  categories!: ICategory[];
  year!: number;
  lang!: string | null;
  constructor(
    private categoriesService: CategoriesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getSelectedCategories();
    this.year = new Date().getFullYear();
		this.lang = localStorage.getItem("lang");
  }

  getSelectedCategories() {
    this.categoriesService.getSelectedCategories().subscribe(res => {
      this.categories = res;
    })
  }

  navgiateToCategried(id: number) {
    this.router.navigate([`productsByCategory`], {
      queryParams: {
        categoryId: id
      }
    })
  }

}
