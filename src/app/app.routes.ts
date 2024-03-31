import { Routes } from '@angular/router';
import { ProductsResolver } from './shared/resolvers/products.resolver';
import { BrandsResolver } from './shared/resolvers/brands.resolver';
import { ProductResolver } from './shared/resolvers/product-resolver';
import { ProductByCategoryIdResolver } from './shared/resolvers/productByCategoryId.resolver';
import { ProductsByBrandIdResolver } from './shared/resolvers/productsByBrandId.resolver';
import { SelectedCategoriesResolver } from './shared/resolvers/selectedCategories.resolver';
import { AdvertisementResolver } from './shared/resolvers/advertisement.resolver';
import { RecentProductsResolver } from './shared/resolvers/recentProducts.resolver';
import { BestProductsResolver } from './shared/resolvers/bestProducts.resolver';

export const routes: Routes = [
    {
        path: "",
        loadComponent: () => import("./modules/home/home.component").then(c => c.HomeComponent),
        resolve: {
            Products: ProductsResolver,
            Brands: BrandsResolver,
            selectedCategories: SelectedCategoriesResolver,
            Advertisement: AdvertisementResolver,
            RecentProducts: RecentProductsResolver,
            BestProducts: BestProductsResolver,
        }
    },
    {
        path: "products",
        loadComponent: () => import("./modules/products/products.component").then(c => c.ProductsComponent),
        resolve: {
            Products: ProductsResolver,
            Brands: BrandsResolver,
        }
    },
    {
        path: "productsByCategory",
        loadComponent: () => import("./modules/products/products.component").then(c => c.ProductsComponent),
        resolve: {
            Brands: BrandsResolver,
            ProductByCategoryId: ProductByCategoryIdResolver
        }
    },
    {
        path: "productsByBrand",
        loadComponent: () => import("./modules/products/products.component").then(c => c.ProductsComponent),
        resolve: {
            Brands: BrandsResolver,
            ProductsByBrandId: ProductsByBrandIdResolver
        }
    },
    {
        path: "product/:id",
        loadComponent: () => import("./modules/product/product.component").then(c => c.ProductComponent),
        resolve: {
            Product: ProductResolver
        }
    },
    {
        path: "home",
        loadComponent: () => import("./modules/home/home.component").then(c => c.HomeComponent),
        resolve: {
            Products: ProductsResolver,
            Brands: BrandsResolver,
            selectedCategories: SelectedCategoriesResolver,
            Advertisement: AdvertisementResolver,
            RecentProducts: RecentProductsResolver,
            BestProducts: BestProductsResolver,
        }
    },
    {
        path: "brands",
        loadComponent: () => import("./modules/brands/brands.component").then(c => c.BrandsComponent),
        resolve: {
            Brands: BrandsResolver
        }
    },
    {
        path: "RecentProducts",
        loadComponent: () => import("./modules/recent-products/recent-products.component").then(c => c.RecentProductsComponent),
        resolve: {
            RecentProducts: RecentProductsResolver,
            Brands: BrandsResolver
        }
    },
    {
        path: "BestProducts",
        loadComponent: () => import("./modules/best-products/best-products.component").then(c => c.BestProductsComponent),
        resolve: {
            BestProducts: BestProductsResolver,
            Brands: BrandsResolver
        }
    },
    {
        path: "**",
        pathMatch: "full",
        redirectTo: "home"
    }
];
