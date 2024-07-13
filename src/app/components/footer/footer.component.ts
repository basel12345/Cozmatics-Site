import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Component, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTiktok, faSnapchat } from '@fortawesome/free-brands-svg-icons';
import { CategoriesService } from '../../shared/services/categories/categories.service';
import { ICategory } from '../../shared/models/category';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [FontAwesomeModule, TranslateModule, CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent implements OnInit {
  faTiktok = faTiktok;
  faSnapchat = faSnapchat;
  categories!: ICategory[];
  constructor(
    private categoriesService: CategoriesService,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.getSelectedCategories();
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
