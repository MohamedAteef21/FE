import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SharedModule } from '../../../shared/shared.module';
import { MenuItem } from '../../../models/menu-item.model';
import { CartService } from '../../../core/services/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductService, Product, ProductVariant } from '../../../core/services/product.service';
import { CategoryService } from '../../../core/services/category.service';
import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-item-details',
  standalone: true,
  imports: [CommonModule, SharedModule, TranslateModule, RouterModule],
  template: `
    <div class="item-details-container" *ngIf="menuItem$ | async as item">
      <!-- Breadcrumb Navigation -->
      <div class="breadcrumb-nav">
        <div class="container">
          <nav class="breadcrumb">
            <a routerLink="/" class="breadcrumb-item">{{ "ITEM_DETAILS.HOME" | translate }}</a>
            <span class="breadcrumb-separator">></span>
            <a [routerLink]="['/menu']" [queryParams]="{category: item.categoryId}" class="breadcrumb-item">{{ currentLang === 'ar' ? categoryNameAr : categoryNameEn }}</a>
            <span class="breadcrumb-separator">></span>
            <span class="breadcrumb-item active">{{ currentLang === 'ar' ? item.nameAr : (item.nameEn || item.nameAr) }}</span>
          </nav>
        </div>
      </div>

      <!-- Main Content -->
      <div class="container main-content">
        <div class="item-details-layout">
          <!-- Left Side: Images Container -->
          <div class="images-section">
            <!-- Thumbnail Images -->
            <div class="thumbnails-container">
              <div 
                class="thumbnail" 
                *ngFor="let thumb of thumbnailImages; let i = index"
                [class.active]="selectedImage === thumb"
                (click)="selectImage(thumb)">
                <img [src]="thumb" [alt]="'Thumbnail ' + (i + 1)" loading="eager" />
              </div>
            </div>

            <!-- Main Image -->
            <div class="main-image-container">
              <img 
                [src]="selectedImage || item.imageUrl" 
                [alt]="currentLang === 'ar' ? item.nameAr : (item.nameEn || item.nameAr)" 
                class="main-image"
                [class.loading]="isImageLoading"
                loading="eager" />
            </div>
          </div>

          <!-- Right Side: Product Information -->
          <div class="product-info">
            <!-- Availability Badge -->
            <div class="availability-badge" *ngIf="item.isActive">
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 23C9.08367 22.9966 6.28778 21.8365 4.22563 19.7744C2.16347 17.7122 1.00344 14.9163 1 12C1 11.7348 1.10536 11.4804 1.29289 11.2929C1.48043 11.1054 1.73478 11 2 11C2.26522 11 2.51957 11.1054 2.70711 11.2929C2.89464 11.4804 3 11.7348 3 12C3 13.78 3.52784 15.5201 4.51677 17.0001C5.50571 18.4802 6.91131 19.6337 8.55585 20.3149C10.2004 20.9961 12.01 21.1743 13.7558 20.8271C15.5016 20.4798 17.1053 19.6226 18.364 18.364C19.6226 17.1053 20.4798 15.5016 20.8271 13.7558C21.1743 12.01 20.9961 10.2004 20.3149 8.55585C19.6337 6.91131 18.4802 5.50571 17.0001 4.51677C15.5201 3.52784 13.78 3 12 3C11.7348 3 11.4804 2.89464 11.2929 2.70711C11.1054 2.51957 11 2.26522 11 2C11 1.73478 11.1054 1.48043 11.2929 1.29289C11.4804 1.10536 11.7348 1 12 1C14.9174 1 17.7153 2.15893 19.7782 4.22183C21.8411 6.28472 23 9.08262 23 12C23 14.9174 21.8411 17.7153 19.7782 19.7782C17.7153 21.8411 14.9174 23 12 23Z" fill="#3BB77E"/>
<path d="M12 23C10.8984 23.0009 9.80282 22.8364 8.75 22.512C8.49646 22.4339 8.28432 22.2583 8.16027 22.0237C8.03621 21.7892 8.0104 21.515 8.0885 21.2615C8.16661 21.0079 8.34224 20.7958 8.57675 20.6718C8.81127 20.5477 9.08546 20.5219 9.339 20.6C10.2009 20.8662 11.098 21.001 12 21C12.2652 21 12.5196 21.1054 12.7071 21.2929C12.8946 21.4804 13 21.7348 13 22C13 22.2652 12.8946 22.5196 12.7071 22.7071C12.5196 22.8946 12.2652 23 12 23ZM5.56 20.65C5.32448 20.6503 5.09641 20.5674 4.916 20.416C3.79112 19.4706 2.86753 18.309 2.2 17C2.13703 16.8828 2.09809 16.7541 2.08548 16.6216C2.07286 16.4891 2.08681 16.3555 2.12652 16.2284C2.16623 16.1014 2.2309 15.9836 2.31673 15.8819C2.40256 15.7802 2.50783 15.6966 2.62637 15.6361C2.74491 15.5756 2.87433 15.5394 3.00706 15.5296C3.13978 15.5197 3.27313 15.5365 3.39929 15.5788C3.52546 15.6212 3.64189 15.6883 3.74178 15.7763C3.84167 15.8642 3.923 15.9712 3.981 16.091C4.52743 17.1644 5.28449 18.1166 6.207 18.891C6.3618 19.0238 6.47229 19.2007 6.52367 19.3981C6.57505 19.5954 6.56485 19.8038 6.49445 19.9952C6.42404 20.1866 6.2968 20.3519 6.12978 20.469C5.96276 20.586 5.76394 20.6492 5.56 20.65ZM2.144 14.706C1.90819 14.7059 1.68002 14.6224 1.49979 14.4703C1.31955 14.3183 1.19885 14.1074 1.159 13.875C1.05338 13.2556 1.00019 12.6284 1 12C0.9996 11.1616 1.09454 10.3259 1.283 9.509C1.34297 9.25069 1.50308 9.02679 1.72811 8.88651C1.95315 8.74624 2.22468 8.70109 2.483 8.761C2.74131 8.82097 2.96521 8.98107 3.10549 9.20611C3.24576 9.43114 3.29091 9.70268 3.231 9.961C2.96141 11.135 2.92742 12.3508 3.131 13.538C3.15325 13.6675 3.14976 13.8001 3.12073 13.9282C3.0917 14.0564 3.03771 14.1775 2.96184 14.2848C2.88596 14.3921 2.7897 14.4833 2.67854 14.5534C2.56738 14.6234 2.44351 14.6708 2.314 14.693C2.25782 14.7022 2.20094 14.7066 2.144 14.706ZM3.909 7.122C3.72455 7.12202 3.54368 7.07103 3.3864 6.97466C3.22912 6.87829 3.10156 6.74029 3.01783 6.57593C2.9341 6.41158 2.89746 6.22726 2.91196 6.04338C2.92646 5.85949 2.99154 5.6832 3.1 5.534C3.74777 4.64345 4.52503 3.85474 5.406 3.194C5.57886 3.06372 5.78955 2.99349 6.006 2.994C6.14948 2.99345 6.29139 3.02378 6.42211 3.08292C6.55282 3.14207 6.66928 3.22866 6.76357 3.3368C6.85787 3.44494 6.92778 3.57211 6.96858 3.70966C7.00937 3.84721 7.02009 3.99194 7 4.134C6.98173 4.26427 6.93775 4.3896 6.87063 4.50273C6.80351 4.61586 6.71458 4.71453 6.609 4.793C5.88692 5.33449 5.24958 5.98059 4.718 6.71C4.62522 6.83763 4.50356 6.94149 4.36295 7.0131C4.22235 7.0847 4.06679 7.12202 3.909 7.122ZM9.6 3.291C9.35521 3.29222 9.11847 3.2036 8.93465 3.04194C8.75083 2.88028 8.63268 2.65681 8.60261 2.41387C8.57253 2.17093 8.63261 1.92539 8.77147 1.72379C8.91032 1.52218 9.1183 1.37851 9.356 1.32C10.2213 1.10746 11.109 1.00002 12 1C12.2652 1 12.5196 1.10536 12.7071 1.29289C12.8946 1.48043 13 1.73478 13 2C13 2.26522 12.8946 2.51957 12.7071 2.70711C12.5196 2.89464 12.2652 3 12 3C11.2704 2.9996 10.5434 3.08757 9.835 3.262C9.75809 3.28094 9.67921 3.29067 9.6 3.291ZM10.667 15.667C10.5355 15.6674 10.4052 15.6418 10.2836 15.5915C10.1621 15.5412 10.0518 15.4672 9.959 15.374L7.293 12.707C7.19749 12.6147 7.12131 12.5044 7.0689 12.3824C7.01649 12.2604 6.98891 12.1292 6.98775 11.9964C6.9866 11.8636 7.0119 11.7319 7.06218 11.609C7.11246 11.4861 7.18672 11.3745 7.28061 11.2806C7.3745 11.1867 7.48615 11.1125 7.60905 11.0622C7.73195 11.0119 7.86363 10.9866 7.9964 10.9877C8.12918 10.9889 8.2604 11.0165 8.38241 11.0689C8.50441 11.1213 8.61476 11.1975 8.707 11.293L10.667 13.252L15.293 8.626C15.4806 8.43849 15.7351 8.3332 16.0004 8.3333C16.2656 8.33339 16.52 8.43886 16.7075 8.6265C16.895 8.81414 17.0003 9.06858 17.0002 9.33385C17.0001 9.59912 16.8946 9.85349 16.707 10.041L11.374 15.374C11.2814 15.4672 11.1712 15.541 11.0499 15.5913C10.9285 15.6416 10.7984 15.6674 10.667 15.667Z" fill="#3BB77E"/>
</svg>
              <span>{{ "ITEM_DETAILS.AVAILABLE" | translate }}</span>
            </div>

            <!-- Title -->
             <h6 class="category-title">{{ currentLang === 'ar' ? categoryNameAr : categoryNameEn }}</h6>
            <h1 class="product-title">{{ currentLang === 'ar' ? item.nameAr : (item.nameEn || item.nameAr) }}</h1>

            <!-- Rating -->
            <div class="rating">
              <div class="stars">
                <span class="star filled" *ngFor="let i of [1,2,3,4]">★</span>
                <span class="star half-filled">★</span>
                <span class="star empty" *ngFor="let i of [1]">★</span>
              </div>
            </div>

            <!-- Description -->
            <div class="product-description">
              <p>{{ currentLang === 'ar' ? (item.descriptionAr || item.description) : (item.descriptionEn || item.descriptionAr || item.description) }}</p>
            </div>
<hr>
            <!-- Variant Selection (if variants exist) -->
            <div class="size-selection" *ngIf="item.variants && item.variants.length >= 1">
              <label class="size-label">{{ "ITEM_DETAILS.SIZE" | translate }}</label>
              <div class="size-buttons">
                <button 
                  *ngFor="let variant of item.variants" 
                  class="size-btn" 
                  [class.active]="selectedVariant?.id === variant.id"
                  (click)="selectVariant(variant)">
                  <span>{{ currentLang === 'ar' ? variant.nameAr : (variant.nameEn || variant.nameAr) }}</span>
                </button>
              </div>
            </div>

            <!-- Quantity Selector -->
            <div class="quantity-selector">
              <label class="quantity-label">{{ "ITEM_DETAILS.QUANTITY" | translate }}</label>
              <div class="quantity-controls">
                <button class="quantity-btn quantity-btn-plus" (click)="increaseQuantity()">
                  <mat-icon>add</mat-icon>
                </button>
                <span class="quantity-value">{{ quantity }}</span>
                <button 
                  class="quantity-btn quantity-btn-minus" 
                  [class.disabled]="quantity === 1"
                  (click)="decreaseQuantity()"
                  [disabled]="quantity === 1">
                  <mat-icon>remove</mat-icon>
                </button>
              </div>
            </div>

            <!-- Price -->
            <div class="product-price">{{ getCurrentPrice() }} {{ "COMMON.RIYAL" | translate }}</div>

            <!-- Action Buttons -->
            <div class="action-buttons">
              <button class="btn-add-to-cart" (click)="addToCart(item)">
                {{ "ITEM_DETAILS.ADD_TO_CART" | translate }}
              </button>
              <button class="btn-order-now" (click)="orderNow(item)">
                {{ "ITEM_DETAILS.ORDER_NOW" | translate }}
              </button>
            </div>

            <!-- Delivery Information -->
            <div class="delivery-info">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.9375 6.1875H6.875C6.51033 6.1875 6.16059 6.33237 5.90273 6.59023C5.64487 6.84809 5.5 7.19783 5.5 7.5625V13.8944C7.09156 14.3509 8.25 15.8345 8.25 17.5594C8.25 18.0022 7.9585 18.3886 7.54875 18.5171L7.54325 18.5625H13.5245C13.0269 18.1604 12.6662 17.6139 12.4921 16.9983C12.318 16.3827 12.339 15.7283 12.5522 15.1251C12.7654 14.522 13.1604 13.9997 13.6827 13.6303C14.205 13.2609 14.829 13.0626 15.4688 13.0625H18.2779C18.6182 13.0625 18.9447 13.1182 19.25 13.2213V13.0625C19.25 12.5155 19.0327 11.9909 18.6459 11.6041C18.2591 11.2173 17.7345 11 17.1875 11H9.96875C9.87758 11 9.79015 11.0362 9.72568 11.1007C9.66122 11.1651 9.625 11.2526 9.625 11.3438V12.375C9.625 12.7397 9.76987 13.0894 10.0277 13.3473C10.2856 13.6051 10.6353 13.75 11 13.75H11.3438C11.6173 13.75 11.8796 13.8586 12.073 14.052C12.2664 14.2454 12.375 14.5077 12.375 14.7812C12.375 15.0548 12.2664 15.3171 12.073 15.5105C11.8796 15.7038 11.6173 15.8125 11.3438 15.8125H8.70856C8.58694 15.8125 8.47031 15.7642 8.38431 15.6782C8.29831 15.5922 8.25 15.4756 8.25 15.3539V7.5625H8.9375C9.11984 7.5625 9.2947 7.49007 9.42364 7.36114C9.55257 7.2322 9.625 7.05734 9.625 6.875C9.625 6.69266 9.55257 6.5178 9.42364 6.38886C9.2947 6.25993 9.11984 6.1875 8.9375 6.1875Z" fill="currentColor"/>
<path d="M10.7711 8.9375C10.1386 8.9375 9.625 9.45037 9.625 10.0836C9.625 10.2101 9.72813 10.3125 9.85394 10.3125H15.5836C15.7101 10.3125 15.8125 10.2094 15.8125 10.0836C15.8125 9.45106 15.2996 8.9375 14.6664 8.9375H10.7711ZM6.875 18.2188C6.87441 18.5489 6.80588 18.8754 6.67369 19.1779C6.54149 19.4804 6.34846 19.7525 6.1066 19.9772C5.86473 20.2019 5.57921 20.3745 5.2678 20.4841C4.95639 20.5938 4.62576 20.6381 4.29646 20.6145C3.96716 20.5909 3.64625 20.4997 3.3537 20.3467C3.06114 20.1937 2.80319 19.9822 2.59591 19.7252C2.38862 19.4682 2.23643 19.1714 2.14881 18.8531C2.06118 18.5348 2.03999 18.2018 2.08656 17.875H1.68781C1.60465 17.8741 1.5252 17.8405 1.46665 17.7814C1.4081 17.7223 1.37518 17.6426 1.375 17.5594C1.375 15.851 2.76031 14.4375 4.46875 14.4375C6.17719 14.4375 7.5625 15.851 7.5625 17.5594C7.56233 17.6425 7.52949 17.7221 7.47109 17.7812C7.41269 17.8402 7.33341 17.8739 7.25037 17.875H6.85094C6.86698 17.9873 6.875 18.1019 6.875 18.2188ZM3.49594 17.875C3.44124 18.0305 3.42461 18.1969 3.44745 18.3601C3.47029 18.5234 3.53193 18.6788 3.62721 18.8133C3.72249 18.9478 3.84862 19.0575 3.99504 19.1332C4.14147 19.209 4.30391 19.2485 4.46875 19.2485C4.63359 19.2485 4.79603 19.209 4.94246 19.1332C5.08888 19.0575 5.21501 18.9478 5.31029 18.8133C5.40557 18.6788 5.46721 18.5234 5.49005 18.3601C5.51289 18.1969 5.49626 18.0305 5.44156 17.875H3.49594ZM19.9134 18.5625C19.8302 19.1369 19.5422 19.6619 19.1025 20.0408C18.6628 20.4197 18.101 20.6269 17.5206 20.6243C16.9402 20.6217 16.3803 20.4095 15.944 20.0267C15.5077 19.6439 15.2244 19.1163 15.1463 18.5412C14.541 18.4601 13.9892 18.1519 13.6027 17.679C13.2162 17.2061 13.024 16.604 13.065 15.9947C13.106 15.3853 13.3772 14.8144 13.8235 14.3976C14.2699 13.9808 14.858 13.7493 15.4688 13.75H18.2779C18.9004 13.75 19.4974 13.9973 19.9375 14.4375C20.3777 14.8776 20.625 15.4746 20.625 16.0971V17.875C20.625 18.0573 20.5526 18.2322 20.4236 18.3611C20.2947 18.4901 20.1198 18.5625 19.9375 18.5625H19.9134ZM16.5584 18.5625C16.6293 18.7639 16.7609 18.9384 16.9352 19.0618C17.1094 19.1852 17.3177 19.2515 17.5312 19.2515C17.7448 19.2515 17.9531 19.1852 18.1273 19.0618C18.3016 18.9384 18.4332 18.7639 18.5041 18.5625H16.5584Z" fill="currentColor"/>
</svg>

              {{ "ITEM_DETAILS.DELIVERY_TIME" | translate }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container-fluid px-0" *ngIf="similarProducts.length > 0">
      <section class="similar-products-section py-5">
        <div class="container">
          <div class="section-header">
            <div class="carousel-nav">
              <button class="carousel-btn prev-btn" (click)="scrollCarousel('similar-products', -1)">
                <span>←</span>
              </button>
              <button class="carousel-btn next-btn" (click)="scrollCarousel('similar-products', 1)">
                <span>→</span>
              </button>
            </div>
            <h2 class="section-title">{{ "ITEM_DETAILS.SIMILAR_PRODUCTS" | translate }}</h2>
          </div>
          <div class="similar-products-cards" #similarProductsCarousel>
            <div class="similar-product-card" *ngFor="let item of similarProducts" (click)="setProductFromItem(item)">
              <div class="similar-product-card-bg">
                <img src="assets/Bashwat-logo.png" alt="Logo" class="similar-product-logo" />
              </div>
              <div class="similar-product-image-wrapper">
                <img [src]="item.imageUrl" [alt]="getProductName(item)" class="similar-product-image" />
              </div>
              <div class="similar-product-content">
                <h3 class="similar-product-title">{{ getProductName(item) }}</h3>
                <p class="similar-product-description">{{ getProductDescription(item) }}</p>
                <div class="similar-product-action-row">
                  <div class="similar-product-price">{{ item.price }} {{ "COMMON.RIYAL" | translate }}</div>
                  <button class="similar-product-order-button" (click)="addSimilarProductToCart(item); $event.stopPropagation()">
                    <span>{{ "COMMON.ORDER" | translate }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .item-details-container {
      min-height: 100vh;
      background-color: #ffffff;
      direction: rtl;
    }

    .breadcrumb-nav {
      // background-color: #f8f9fa;
      padding: 1rem 0;
      // border-bottom: 1px solid #e0e0e0;
    }

    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 0;
      padding: 0;
      list-style: none;
      font-family: 'Almarai', sans-serif;
      font-size: 14px;
    }

    .breadcrumb-item {
      color: #666;
      text-decoration: none;
      transition: color 0.3s ease;
    }

    .breadcrumb-item:hover {
      color: #d32f2f;
    }

    .breadcrumb-item.active {
      color: #333;
      font-weight: 600;
    }

    .breadcrumb-separator {
      color: #999;
    }

    .main-content {
      padding: 3rem 0;
    }

    .item-details-layout {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 3rem;
      align-items: start;
    }

    .images-section {
      display: flex;
      gap: 1rem;
      align-items: flex-start;
    }

    .product-info {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 1.5rem;
      width: 100%;
    }

    .availability-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      // padding: 0.5rem 1rem;
      // background-color: #e8f5e9;
      border-radius: 20px;
      width: fit-content;
      align-self: flex-start;
      font-family: 'Almarai', sans-serif;
      font-size: 14px;
      font-weight: 600;
      // color: #2e7d32;
    }

    .category-title {
      font-family: 'Almarai', sans-serif;
      font-weight: 400;
      font-size: 1rem;
      color: #666;
      margin: 0;
      align-self: flex-start;
    }

    .product-title {
      font-family: 'Almarai', sans-serif;
      font-weight: 700;
      font-size: 2.5rem;
      color: #d32f2f;
      margin: 0;
      line-height: 1.2;
      align-self: flex-start;
    }

    .rating {
      display: flex;
      align-items: center;
      align-self: flex-start;
    }

    .stars {
      display: flex;
      gap: 0.25rem;
    }

    .star {
      font-size: 1.5rem;
      color: #ddd;
    }

    .star.filled {
      color: #ffc107;
    }

    .star.half-filled {
      background: linear-gradient(90deg, #ffc107 50%, #ddd 50%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .product-description {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      font-family: 'Almarai', sans-serif;
      font-size: 16px;
      color: #333;
      line-height: 1.6;
      align-self: flex-start;
    }

    .product-description p {
      margin: 0.5rem 0;
      align-self: flex-start;
    }

    .additional-description {
      color: #666;
      font-size: 14px;
    }

    hr {
      width: 100%;
      border: none;
      border-top: 1px solid #393939;
      margin: -0.5rem 0;
      align-self: stretch;
    }

    .size-selection {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      align-self: flex-start;
    }

    .size-label {
      font-family: 'Almarai', sans-serif;
      font-weight: 600;
      font-size: 16px;
      color: #333;
      align-self: flex-start;
      display: flex;
    }

    .size-buttons {
      display: flex;
      gap: 10px;
    }

    .size-btn {
      width: 76px;
      height: 33px;
      padding: 4px 9px;
      border: none;
      background-color: #F5F5F5;
      border-radius: 73px;
      font-family: 'Almarai', sans-serif;
      font-size: 16px;
      font-weight: 600;
      color: #666;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .size-btn:hover {
      background-color: #e0e0e0;
      color: #333;
    }

    .size-btn.active {
      background-color: #F5F5F5;
      border: 0.5px solid #F00E0C;
      color: #333;
    }

    .variant-price {
      font-size: 14px;
      font-weight: 600;
      color: #d32f2f;
      margin-left: 4px;
    }

    .quantity-selector {
      display: flex;
      // flex-direction: column;
      gap: 0.75rem;
      align-self: flex-start;
      align-items: anchor-center;
    }

    .quantity-label {
      font-family: 'Almarai', sans-serif;
      font-weight: 600;
      font-size: 16px;
      color: #333;
      display:flex;
      align-items:flex-start;
    }

    .quantity-controls {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 126px;
      height: 40px;
      gap: 0;
      border: 0.5px solid #BEBEBE;
      border-radius: 40px;
      padding: 0 17px;
      box-sizing: border-box;
      background-color: #ffffff;
    }

    .quantity-btn {
      width: auto;
      min-width: 24px;
      height: 24px;
      border: none;
      background-color: transparent;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      flex-shrink: 0;
      padding: 0;
    }

    .quantity-btn mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      line-height: 20px;
    }

    .quantity-btn-minus {
      color: #999;
    }

    .quantity-btn-minus.disabled {
      color: #BEBEBE;
      cursor: not-allowed;
      opacity: 0.5;
    }

    .quantity-btn-minus.disabled mat-icon {
      color: inherit;
    }

    .quantity-btn-plus {
      color: #333;
    }

    .quantity-btn:hover:not(.disabled) {
      color: #d32f2f;
    }

    .quantity-btn:hover:not(.disabled) mat-icon {
      color: inherit;
    }

    .quantity-value {
      font-family: 'Almarai', sans-serif;
      font-size: 16px;
      font-weight: 700;
      color: #333;
      min-width: 20px;
      text-align: center;
      flex-shrink: 0;
      flex: 1;
    }

    .product-price {
      font-family: 'Almarai', sans-serif;
      font-weight: 700;
      font-size: 2.5rem;
      color: #d32f2f;
      margin: 0;
      align-self: flex-start;
    }

    .action-buttons {
      display: flex;
      flex-direction: column;
      gap: 10px;
      align-self: flex-start;
      width: 100%;
    }

    .btn-add-to-cart {
      width: 100%;
      height: 50px;
      padding: 16px 10px;
      background-color: #F00E0C;
      color: #fff;
      border: 1px solid #F00E0C;
      border-radius: 100px;
      font-family: 'Almarai', sans-serif;
      font-size: 18px;
      font-weight: 700;
      cursor: pointer;
      transition: background-color 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }

    .btn-add-to-cart:hover {
      background-color: #d00c0a;
    }

    .btn-order-now {
      width: 100%;
      height: 50px;
      padding: 16px 10px;
      background-color: #fff;
      color: #F00E0C;
      border: 1px solid #F00E0C;
      border-radius: 100px;
      font-family: 'Almarai', sans-serif;
      font-size: 18px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }

    .btn-order-now:hover {
      background-color: #F00E0C;
      color: #fff;
    }

    .delivery-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-family: 'Almarai', sans-serif;
      font-size: 14px;
      color: #999;
      margin: 0;
      align-self: flex-start;
    }

    .delivery-info svg {
      flex-shrink: 0;
    }

    .main-image-container {
      position: relative;
      flex: 1;
      height: 600px;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      -webkit-backface-visibility: hidden;
      backface-visibility: hidden;
      -webkit-perspective: 1000;
      perspective: 1000;
    }

    .main-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      -webkit-backface-visibility: hidden;
      backface-visibility: hidden;
      -webkit-transform: translateZ(0);
      transform: translateZ(0);
    }

    .main-image.loading {
      opacity: 0.5;
    }

    .thumbnails-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      flex-shrink: 0;
    }

    .thumbnail {
      width: 100px;
      height: 100px;
      border-radius: 8px;
      overflow: hidden;
      cursor: pointer;
      border: 3px solid transparent;
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .thumbnail:hover {
      border-color: #d32f2f;
      transform: scale(1.05);
    }

    .thumbnail.active {
      border-color: #d32f2f;
    }

    .thumbnail img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      -webkit-backface-visibility: hidden;
      backface-visibility: hidden;
    }

    /* Responsive Design */
    @media (max-width: 1200px) {
      .item-details-layout {
        grid-template-columns: 1fr;
        gap: 2rem;
      }

      .thumbnails-container {
        flex-direction: row;
        justify-content: center;
      }
    }

    @media (max-width: 768px) {
      .item-details-layout {
        grid-template-columns: 1fr;
      }

      .images-section {
        flex-direction: column;
      }

      .main-image-container {
        height: 400px;
        width: 100%;
      }

      .product-title {
        font-size: 2rem;
      }

      .product-price {
        font-size: 2rem;
      }

      .thumbnails-container {
        flex-direction: row;
        justify-content: center;
        flex-wrap: wrap;
        width: 100%;
      }

      .thumbnail {
        width: 80px;
        height: 80px;
      }
    }

    /* Similar Products Section */
    .similar-products-section {
      background-color: #ffffff;
      padding: 3rem 0;
    }

    .similar-products-section .section-header {
      display: grid;
      grid-template-columns: auto 1fr;
      align-items: center;
      gap: 1rem;
    }

    .similar-products-section .section-title {
      grid-column: 2;
      justify-self: center;
      font-family: 'Almarai', sans-serif;
      font-weight: 700;
      font-size: 2.5rem;
      color: #d32f2f;
      text-align: center;
      position: relative;
      padding-bottom: 0.5rem;
    }

    .similar-products-section .section-title::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 100px;
      height: 4px;
      background-color: #FDC55E;
    }

    .similar-products-section .carousel-nav {
      display: flex;
      gap: 0.5rem;
      grid-column: 1;
    }

    .similar-products-section .carousel-btn {
      width: 40px;
      height: 40px;
      border: 1px solid #ddd;
      background-color: #f5f5f5;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 1.2rem;
      color: #666;
    }

    .similar-products-section .carousel-btn:hover {
      background-color: #d32f2f;
      color: white;
      border-color: #d32f2f;
    }

    .similar-products-cards {
      display: flex;
      gap: 1.5rem;
      overflow-x: auto;
      scroll-behavior: smooth;
      padding: 1rem 0;
      scrollbar-width: thin;
      -webkit-overflow-scrolling: touch;
    }

    .similar-products-cards::-webkit-scrollbar {
      height: 8px;
    }

    .similar-products-cards::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 10px;
    }

    .similar-products-cards::-webkit-scrollbar-thumb {
      background: #d32f2f;
      border-radius: 10px;
    }

    .similar-product-card {
      flex: 0 0 calc(25% - 1.125rem);
      min-width: 300px;
      max-width: 350px;
      position: relative;
      border-radius: 15px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      border: 2px solid #d32f2f;
      cursor: pointer;
    }

    .similar-product-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
    }

    .similar-product-card-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      opacity: 0.1;
    }

    .similar-product-logo {
      position: absolute;
      top: 15px;
      left: 15px;
      width: 50px;
      height: 50px;
      z-index: 2;
      opacity: 0.8;
    }

    .similar-product-image-wrapper {
      position: relative;
      width: 100%;
      padding: 1rem;
      z-index: 2;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .similar-product-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .similar-product-content {
      padding: 1rem;
      z-index: 2;
      position: relative;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
    }

    .similar-product-title {
      font-family: 'Almarai', sans-serif;
      font-weight: 700;
      font-size: 1.25rem;
      margin-bottom: 0.75rem;
      text-align: right;
    }

    .similar-product-description {
      font-family: 'Almarai', sans-serif;
      font-weight: 400;
      font-size: 0.85rem;
      margin-bottom: 1rem;
      text-align: right;
      line-height: 1.5;
      flex-grow: 1;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .similar-product-action-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      margin-top: auto;
      direction: rtl;
    }

    .similar-product-order-button {
      background-color: #d32f2f;
      color: white;
      border: none;
      border-radius: 8px;
      padding: 0.75rem 1.5rem;
      font-family: 'Almarai', sans-serif;
      font-weight: 700;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.3s ease, transform 0.2s ease;
      white-space: nowrap;
    }

    .similar-product-order-button:hover {
      background-color: #b71c1c;
      transform: scale(1.05);
    }

    .similar-product-price {
      font-family: 'Aref_Menna', serif;
      font-weight: 700;
      font-size: 1.5rem;
      color: #b71c1c;
      white-space: nowrap;
    }

    @media (max-width: 768px) {
      .similar-products-section .section-header {
        grid-template-columns: 1fr;
        justify-items: center;
      }

      .similar-products-section .section-title {
        grid-column: 1;
        justify-self: center;
      }

      .similar-products-section .carousel-nav {
        grid-column: 1;
        justify-self: center;
      }

      .similar-product-card {
        min-width: 280px;
      }
    }
  `]
})
export class ItemDetailsComponent implements OnInit {
  @ViewChild('similarProductsCarousel') similarProductsCarousel!: ElementRef;

  menuItem$!: Observable<any>;
  product$!: Observable<Product>;
  currentProduct: Product | null = null;
  quantity = 1;
  selectedVariant: ProductVariant | null = null;
  selectedImage: string | null = null;
  thumbnailImages: string[] = [];
  loadedImages: Set<string> = new Set();
  isImageLoading: boolean = false;
  similarProducts: any[] = [];
  categoryNameAr: string = '';
  categoryNameEn: string = '';
  currentLang: string = 'ar';
  allCategoriesWithProducts: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private productService: ProductService,
    private categoryService: CategoryService,
    private translationService: TranslationService
  ) {
    this.currentLang = this.translationService.getCurrentLanguage();
    this.translate.onLangChange.subscribe(event => {
      this.currentLang = event.lang;
    });
  }

  ngOnInit(): void {
    // Subscribe to route param changes to reload when navigating to different items
    this.route.paramMap.subscribe(params => {
      const itemId = params.get('id');
      if (itemId) {
        this.loadProductData(itemId);
        // Defer scroll until after Angular has finished mounting the component
        setTimeout(() => {
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
        }, 0);
      }
    });
  }

  loadProductData(itemId: string): void {
    const productId = parseInt(itemId, 10);
    if (isNaN(productId)) {
      return;
    }

    // Reset component state
    this.selectedVariant = null;
    this.quantity = 1;
    this.thumbnailImages = [];
    this.selectedImage = null;
    this.similarProducts = [];

    // Fetch product data
    this.product$ = this.productService.getProductById(productId).pipe(
      catchError(error => {
        console.error('Error fetching product:', error);
        return of(null as any);
      })
    );

    this.menuItem$ = this.product$.pipe(
      map(product => {
        if (!product) return null;

        this.currentProduct = product;

        // Fetch category data
        this.categoryService.getCategoryById(product.categoryId).subscribe(
          category => {
            this.categoryNameAr = category.nameAr;
            this.categoryNameEn = category.nameEn;
          },
          error => {
            console.error('Error fetching category:', error);
            this.categoryNameAr = product.categoryName || '';
            this.categoryNameEn = product.categoryName || '';
          }
        );

        // Fetch similar products from the same category
        this.loadSimilarProducts(product.categoryId, product.id);

        // Set thumbnail images
        this.thumbnailImages = [product.imageUrl];
        this.selectedImage = product.imageUrl;

        // Set default variant if variants exist
        if (product.variants && product.variants.length > 0) {
          this.selectedVariant = product.variants[0];
        }

        // Transform Product to MenuItem-like structure for compatibility
        return {
          ...product,
          id: product.id.toString(),
          name: product.nameAr,
          nameAr: product.nameAr,
          nameEn: product.nameEn,
          description: product.descriptionAr || '',
          descriptionAr: product.descriptionAr || '',
          descriptionEn: product.descriptionEn || '',
          price: product.basePrice,
          basePrice: product.basePrice,
          imageUrl: product.imageUrl,
          categoryId: product.categoryId.toString(),
          isAvailable: product.isActive,
          isActive: product.isActive,
          isArabicLang: this.currentLang === 'ar'
        };
      })
    );

    // Preload images when product data is available
    this.menuItem$.subscribe(item => {
      if (item) {
        this.preloadImages();
      }
    });
  }

  selectVariant(variant: ProductVariant): void {
    this.selectedVariant = variant;
  }

  getCurrentPrice(): number {
    if (this.selectedVariant) {
      return this.selectedVariant.price;
    }
    // Return base price from product
    if (this.currentProduct) {
      return this.currentProduct.basePrice || 0;
    }
    return 0;
  }

  preloadImages(): void {
    const allImages = [
      ...this.thumbnailImages,
      'assets/offerPhoto/Rectangle_4606.png'
    ];

    allImages.forEach(imageSrc => {
      if (!this.loadedImages.has(imageSrc)) {
        const img = new Image();
        img.onload = () => {
          this.loadedImages.add(imageSrc);
        };
        img.onerror = () => {
          console.warn(`Failed to load image: ${imageSrc}`);
        };
        img.src = imageSrc;
      }
    });
  }

  selectImage(imageSrc: string): void {
    if (this.isImageLoading) return;

    // Check if image is already loaded
    if (this.loadedImages.has(imageSrc)) {
      this.selectedImage = imageSrc;
      return;
    }

    // Load image before switching
    this.isImageLoading = true;
    const img = new Image();
    img.onload = () => {
      this.loadedImages.add(imageSrc);
      this.selectedImage = imageSrc;
      this.isImageLoading = false;
    };
    img.onerror = () => {
      console.warn(`Failed to load image: ${imageSrc}`);
      this.isImageLoading = false;
    };
    img.src = imageSrc;
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(item: any): void {
    // Create cart item with variant if selected
    const cartItem: MenuItem = {
      id: item.id,
      name: this.currentLang === 'ar' ? item.nameAr : (item.nameEn || item.nameAr),
      nameEn: item.nameEn,
      description: this.currentLang === 'ar' ? (item.descriptionAr || item.description) : (item.descriptionEn || item.descriptionAr || item.description),
      descriptionEn: item.descriptionEn,
      price: this.getCurrentPrice(),
      imageUrl: item.imageUrl,
      categoryId: item.categoryId,
      isAvailable: item.isActive,
      isArabicLang: this.currentLang === 'ar'
    };

    this.cartService.addItem(cartItem, this.quantity);
    this.translate.get(['ITEM_DETAILS.ITEM_ADDED', 'COMMON.CLOSE']).subscribe(translations => {
      this.snackBar.open(translations['ITEM_DETAILS.ITEM_ADDED'] || 'تم إضافة المنتج إلى السلة', translations['COMMON.CLOSE'] || 'إغلاق', {
        duration: 2000,
        direction: 'rtl'
      });
    });
  }

  orderNow(item: any): void {
    // Create cart item with variant if selected
    const cartItem: MenuItem = {
      id: item.id,
      name: this.currentLang === 'ar' ? item.nameAr : (item.nameEn || item.nameAr),
      nameEn: item.nameEn,
      description: this.currentLang === 'ar' ? (item.descriptionAr || item.description) : (item.descriptionEn || item.descriptionAr || item.description),
      descriptionEn: item.descriptionEn,
      price: this.getCurrentPrice(),
      imageUrl: item.imageUrl,
      categoryId: item.categoryId,
      isAvailable: item.isActive,
      isArabicLang: this.currentLang === 'ar'
    };

    this.cartService.addItem(cartItem, this.quantity);
    this.router.navigate(['/cart']);
  }

  scrollCarousel(carouselName: string, direction: number): void {
    let carousel: ElementRef | null = null;

    if (carouselName === 'similar-products') {
      carousel = this.similarProductsCarousel;
    }

    if (carousel) {
      const element = carousel.nativeElement;
      const cards = element.querySelectorAll('.similar-product-card');

      if (cards.length > 0) {
        const firstCard = cards[0] as HTMLElement;
        const cardWidth = firstCard.offsetWidth;
        const containerStyle = window.getComputedStyle(element);
        const gap = parseFloat(containerStyle.gap) || 24;
        const scrollAmount = cardWidth + gap;

        element.scrollBy({
          left: direction * scrollAmount,
          behavior: 'smooth'
        });
      }
    }
  }

  loadSimilarProducts(categoryId: number, currentProductId: number): void {
    this.categoryService.getCategoriesWithProducts().pipe(
      catchError(error => {
        console.error('Error loading categories with products:', error);
        return of([]);
      })
    ).subscribe((categories: any[]) => {
      // Store categories for later use
      this.allCategoriesWithProducts = categories;

      // Find the category that matches
      const category = categories.find(cat => cat.id === categoryId);

      if (category && category.products && category.products.length > 0) {
        // Filter out current product and only get active products
        // Store full product data including variants for direct use
        const similarProducts = category.products
          .filter((product: any) => product.id !== currentProductId && product.isActive)
          .slice(0, 8) // Limit to 8 similar products
          .map((product: any) => ({
            id: product.id.toString(),
            name: product.nameAr || '',
            nameAr: product.nameAr || '',
            nameEn: product.nameEn || '',
            description: product.descriptionAr || '',
            descriptionAr: product.descriptionAr || '',
            descriptionEn: product.descriptionEn || '',
            price: product.basePrice || 0,
            basePrice: product.basePrice || 0,
            imageUrl: product.imageUrl || '',
            categoryId: categoryId.toString(),
            isAvailable: product.isActive,
            isActive: product.isActive,
            isArabicLang: this.currentLang === 'ar',
            variants: product.variants || [], // Include variants if available
            fullProduct: product // Store full product data for direct use
          }));

        this.similarProducts = similarProducts;
      } else {
        this.similarProducts = [];
      }
    });
  }

  setProductFromItem(item: any): void {
    this.router.navigate(['/item', item.id]).then(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  getProductName(item: any): string {
    if (item.nameAr) {
      return this.currentLang === 'ar' ? item.nameAr : (item.nameEn || item.nameAr);
    }
    return item.name || '';
  }

  getProductDescription(item: any): string {
    if (item.descriptionAr) {
      return this.currentLang === 'ar' ? (item.descriptionAr || item.description || '') : (item.descriptionEn || item.descriptionAr || item.description || '');
    }
    return item.description || '';
  }

  addSimilarProductToCart(item: any): void {
    // Convert to MenuItem format for cart
    const cartItem: MenuItem = {
      id: item.id,
      name: this.getProductName(item),
      nameEn: item.nameEn || item.name,
      description: this.getProductDescription(item),
      descriptionEn: item.descriptionEn || item.description,
      price: item.price,
      imageUrl: item.imageUrl,
      categoryId: item.categoryId,
      isAvailable: item.isActive !== undefined ? item.isActive : item.isAvailable
    };

    this.cartService.addItem(cartItem, 1);
    this.translate.get(['ITEM_DETAILS.ITEM_ADDED', 'COMMON.CLOSE']).subscribe(translations => {
      this.snackBar.open(translations['ITEM_DETAILS.ITEM_ADDED'] || 'تم إضافة المنتج إلى السلة', translations['COMMON.CLOSE'] || 'إغلاق', {
        duration: 2000,
        direction: 'rtl'
      });
    });
  }
}
