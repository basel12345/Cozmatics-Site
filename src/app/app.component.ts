import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LoadingService } from './shared/services/loading/loading.service';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [NgIf, RouterOutlet, NavbarComponent, FooterComponent, ProgressSpinnerModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
    title = 'E-Commerce-Angular';
    constructor(public loadingService: LoadingService) { }
}
