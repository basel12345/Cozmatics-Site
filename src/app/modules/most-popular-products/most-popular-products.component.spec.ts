import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostPopularProductsComponent } from './most-popular-products.component';

describe('MostPopularProductsComponent', () => {
  let component: MostPopularProductsComponent;
  let fixture: ComponentFixture<MostPopularProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MostPopularProductsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MostPopularProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
