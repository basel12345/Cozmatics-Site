import { NavHeaderComponent } from './components/nav-header/nav-header.component';
import { Component, HostListener, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LoadingService } from './shared/services/loading/loading.service';
import { CommonModule, NgIf } from '@angular/common';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [NgIf, RouterOutlet, NavbarComponent, FooterComponent, ProgressSpinnerModule, NavHeaderComponent, CommonModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
    title = 'E-Commerce-Angular';
    direction!: string | null;
    isFixed = false;
    @HostListener('window:scroll', ['$event'])
    onWindowScroll($event: any) {
        const scrollY = window.scrollY || document.documentElement.scrollTop;
        this.isFixed = scrollY > 125;
    } 

    constructor(public loadingService: LoadingService) { }
    ngOnInit(): void {
        this.direction = localStorage.getItem("lang") === "ar" ? "rtl" : "ltr";
    }
}
