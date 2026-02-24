import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SharedModule } from '../../../shared/shared.module';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { CategoryService } from '../../../core/services/category.service';
import { CategoryWithProducts } from '../../../models/category.model';
import { MessageService } from 'primeng/api';
import { AddProductDialogComponent } from './add-product-dialog.component';

interface Product {
  id: number;
  nameAr: string;
  nameEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  basePrice: number;
  categoryId: number;
  categoryName: string;
  imageUrl: string;
  isActive: boolean;
  preparationTime: number;
  createdDate: string;
  modifiedDate?: string;
  variants: ProductVariant[];
}

interface ProductVariant {
  id: number;
  nameAr: string;
  nameEn: string;
  price: number;
}

@Component({
  selector: 'app-products-management',
  standalone: true,
  imports: [CommonModule, SharedModule, TranslateModule, MatSlideToggleModule, MatPaginatorModule],
  template: `
    <div class="products-container">
      <!-- Header Section -->
      <div class="header-section">
        <h1 class="page-title">المنتجات</h1>
        <div class="date-range">1 يناير 2026 - 30 يناير 2026</div>
      </div>

      <!-- Summary Cards -->
      <div class="summary-cards">
        <div class="summary-card">
          <div class="card-content">
            <div class="card-value">{{ getTotalProductsCount() | number }}</div>
            <div class="card-label">إجمالي المنتجات</div>
            <div class="card-change positive">+13.2%</div>
          </div>
          <div class="card-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.676 3.92198C2.99 2.72398 4.082 1.99998 5.23 1.99998C5.938 1.99998 6.582 2.26598 7.072 2.69998C7.61224 2.2468 8.29485 1.99841 9 1.99841C9.70515 1.99841 10.3878 2.2468 10.928 2.69998C11.435 2.24794 12.0908 1.99871 12.77 1.99998C13.918 1.99998 15.01 2.72398 15.324 3.92198C15.624 5.06598 16 6.90998 16 8.99998C16 10.1671 15.7081 11.3157 15.1509 12.3412C14.5938 13.3668 13.7891 14.2367 12.81 14.872C12.268 15.226 12 15.682 12 16.072V16.864C12 16.9093 12.0027 16.9533 12.008 16.996C12.076 17.492 12.322 19.334 12.552 21.244C12.778 23.118 13 25.162 13 26C13 27.0608 12.5786 28.0783 11.8284 28.8284C11.0783 29.5785 10.0609 30 9 30C7.93913 30 6.92172 29.5785 6.17157 28.8284C5.42143 28.0783 5 27.0608 5 26C5 25.16 5.222 23.12 5.448 21.244C5.678 19.334 5.924 17.492 5.992 16.996L6 16.864V16.072C6 15.682 5.732 15.226 5.19 14.872C4.21091 14.2367 3.40619 13.3668 2.84906 12.3412C2.29192 11.3157 2.00005 10.1671 2 8.99998C2 6.90998 2.376 5.06598 2.676 3.92198ZM12 9.99998C12 10.2652 11.8946 10.5195 11.7071 10.7071C11.5196 10.8946 11.2652 11 11 11C10.7348 11 10.4804 10.8946 10.2929 10.7071C10.1054 10.5195 10 10.2652 10 9.99998V4.99998C10 4.73476 9.89464 4.4804 9.70711 4.29287C9.51957 4.10533 9.26522 3.99998 9 3.99998C8.73478 3.99998 8.48043 4.10533 8.29289 4.29287C8.10536 4.4804 8 4.73476 8 4.99998V9.99998C8 10.2652 7.89464 10.5195 7.70711 10.7071C7.51957 10.8946 7.26522 11 7 11C6.73478 11 6.48043 10.8946 6.29289 10.7071C6.10536 10.5195 6 10.2652 6 9.99998V4.76998C6 4.56576 5.91888 4.36991 5.77447 4.2255C5.63007 4.0811 5.43422 3.99998 5.23 3.99998C4.898 3.99998 4.67 4.19798 4.61 4.42998C4.21586 5.92171 4.01092 7.45709 4 8.99998C3.9999 9.83405 4.20846 10.6549 4.60669 11.3878C5.00491 12.1206 5.58014 12.7422 6.28 13.196C7.158 13.766 8 14.768 8 16.072V16.864C8 16.9973 7.99133 17.1306 7.974 17.264C7.906 17.756 7.662 19.586 7.434 21.484C7.202 23.414 7 25.312 7 26C7 26.5304 7.21071 27.0391 7.58579 27.4142C7.96086 27.7893 8.46957 28 9 28C9.53043 28 10.0391 27.7893 10.4142 27.4142C10.7893 27.0391 11 26.5304 11 26C11 25.312 10.8 23.414 10.566 21.482C10.338 19.586 10.094 17.756 10.026 17.262C10.0108 17.1305 10.0021 16.9983 10 16.866V16.074C10 14.77 10.842 13.768 11.72 13.198C12.4201 12.7441 12.9956 12.1221 13.3938 11.3889C13.792 10.6556 14.0004 9.83439 14 8.99998C14 7.13598 13.664 5.47198 13.39 4.42998C13.33 4.19998 13.1 3.99998 12.77 3.99998C12.5658 3.99998 12.3699 4.0811 12.2255 4.2255C12.0811 4.36991 12 4.56576 12 4.76998V9.99998ZM18 11C18 8.61303 18.9482 6.32384 20.636 4.63601C22.3239 2.94819 24.6131 1.99998 27 1.99998C27.2652 1.99998 27.5196 2.10533 27.7071 2.29287C27.8946 2.4804 28 2.73476 28 2.99998V14.946L28.038 15.3C28.1971 16.7926 28.3498 18.286 28.496 19.78C28.742 22.292 29 25.108 29 26C29 27.0608 28.5786 28.0783 27.8284 28.8284C27.0783 29.5785 26.0609 30 25 30C23.9391 30 22.9217 29.5785 22.1716 28.8284C21.4214 28.0783 21 27.0608 21 26C21 25.108 21.258 22.292 21.504 19.78C21.63 18.506 21.756 17.286 21.85 16.382L21.89 16H20C19.4696 16 18.9609 15.7893 18.5858 15.4142C18.2107 15.0391 18 14.5304 18 14V11ZM23.994 15.106L23.952 15.51C23.7957 16.9982 23.6437 18.4869 23.496 19.976C23.242 22.55 23 25.236 23 26C23 26.5304 23.2107 27.0391 23.5858 27.4142C23.9609 27.7893 24.4696 28 25 28C25.5304 28 26.0391 27.7893 26.4142 27.4142C26.7893 27.0391 27 26.5304 27 26C27 25.234 26.758 22.55 26.504 19.976C26.3573 18.4868 26.2053 16.9981 26.048 15.51L26.006 15.108L26 15V4.06998C24.3337 4.31049 22.8099 5.14348 21.7079 6.41628C20.6059 7.68908 19.9996 9.31641 20 11V14H23C23.1402 14 23.2789 14.0296 23.407 14.0867C23.535 14.1438 23.6497 14.2272 23.7434 14.3315C23.8371 14.4358 23.9079 14.5587 23.9511 14.6921C23.9942 14.8255 24.0089 14.9665 23.994 15.106Z" fill="#343538"/>
            </svg>
          </div>
        </div>
        
        <div class="summary-card">
          <div class="card-content">
            <div class="card-value">650,000 رق</div>
            <div class="card-label">إجمالي المبيعات</div>
            <div class="card-change negative">-1.2%</div>
          </div>
          <div class="card-icon green">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.29315 22.21H2.86403C2.44984 22.21 2.11403 22.5458 2.11403 22.96V30.75C2.11403 31.1642 2.44984 31.5 2.86403 31.5H7.29315C7.70734 31.5 8.04315 31.1642 8.04315 30.75V22.96C8.04315 22.5458 7.70734 22.21 7.29315 22.21ZM6.54315 30H3.61403V23.71H6.54315V30ZM14.5747 18.6436H10.1455C9.73134 18.6436 9.39553 18.9794 9.39553 19.3936V30.75C9.39553 31.1642 9.73134 31.5 10.1455 31.5H14.5747C14.9889 31.5 15.3247 31.1642 15.3247 30.75V19.3936C15.3247 18.9794 14.9889 18.6436 14.5747 18.6436ZM13.8247 30H10.8955V20.1436H13.8247V30ZM21.8563 14.7477H17.4253C17.0111 14.7477 16.6753 15.0836 16.6753 15.4977V30.75C16.6753 31.1642 17.0111 31.5 17.4253 31.5H21.8563C22.2705 31.5 22.6063 31.1642 22.6063 30.75V15.4977C22.6063 15.0836 22.2705 14.7477 21.8563 14.7477ZM21.1063 30H18.1753V16.2477H21.1063V30ZM29.1361 10.2424H24.7069C24.2927 10.2424 23.9569 10.5782 23.9569 10.9924V30.75C23.9569 31.1642 24.2927 31.5 24.7069 31.5H29.1361C29.5503 31.5 29.8861 31.1642 29.8861 30.75V10.9924C29.8861 10.5782 29.5503 10.2424 29.1361 10.2424ZM28.3861 30H25.4569V11.7424H28.3861V30ZM29.8861 1.25V3.99612C29.8861 4.41031 29.5503 4.74612 29.1361 4.74612C28.7219 4.74612 28.3861 4.41031 28.3861 3.99612V3.06068L22.9961 8.45068C22.715 8.73187 22.2632 8.74481 21.9665 8.48L19.6693 6.43062L12.8905 13.2111C12.6095 13.4923 12.1575 13.5052 11.8608 13.2404L9.56365 11.191L3.39434 17.3604C3.2479 17.5068 3.05597 17.5801 2.86403 17.5801C2.67209 17.5801 2.48015 17.5068 2.33372 17.3604C2.04078 17.0675 2.04078 16.5926 2.33372 16.2997L9.00403 9.62943C9.28522 9.34831 9.73709 9.33537 10.0337 9.60012L12.3308 11.6495L19.1096 4.86906C19.3908 4.58781 19.8427 4.57493 20.1393 4.83968L22.4365 6.88912L27.3255 2.00012H26.3919C25.9777 2.00012 25.6419 1.66437 25.6419 1.25012C25.6419 0.835872 25.9777 0.500122 26.3919 0.500122H29.1362C29.5504 0.500122 29.8862 0.835935 29.8862 1.25012L29.8861 1.25Z" fill="#3BB77E"/>
            </svg>
          </div>
        </div>

        <button class="add-product-btn" (click)="openAddProductDialog()">
          <div class="btn-text-container">
            <span class="btn-text">اضافة منتج</span>
            <svg class="plus-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <img src="assets/BgProduct.png" alt="Product" class="btn-image" />
        </button>
      </div>

      <!-- Category Chips -->
      <div class="category-chips-container" *ngIf="categoriesWithProducts.length > 0">
        <div class="category-chips">
          <button 
            *ngFor="let category of categoriesWithProducts"
            class="category-chip"
            [class.active]="selectedCategoryId === category.id"
            (click)="selectCategory(category)">
            {{ category.nameAr }}
          </button>
        </div>
      </div>

      <!-- Products List -->
      <div class="products-section" *ngIf="selectedCategory">
        <div class="products-header-row">
          <div class="category-header-section">
            <div class="category-image-container">
              <img [src]="selectedCategory.imageUrl || ''" [alt]="selectedCategory.nameAr" class="category-image" />
            </div>
            <h2 class="category-title">{{ selectedCategory.nameAr }}</h2>
          </div>
        </div>

        <div class="products-actions-row">
          <div class="search-container col-3">
            <input 
              type="text" 
              class="search-input" 
              placeholder="بحث..." 
              [(ngModel)]="searchTerm"
              (input)="filterProducts()" />
            <svg class="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.16667 15.8333C12.8486 15.8333 15.8333 12.8486 15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333Z" stroke="#ADB5BD" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M17.5 17.5L13.875 13.875" stroke="#ADB5BD" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="products-actions-right">
            <div class="products-count">{{ getProductsCount() }}</div>
            <button class="action-btn add-product" (click)="addProduct()">
              <mat-icon>add</mat-icon>
              إضافة منتج
            </button>
          </div>
        </div>

        <div class="products-grid" *ngIf="filteredProducts.length > 0">
          <div class="product-item" *ngFor="let product of paginatedProducts; let i = index">
            <div class="product-toggle" (click)="toggleProduct(product)">
              <svg *ngIf="product.isActive" width="44" height="24" viewBox="0 0 44 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_70_1747)">
                  <rect width="44" height="24" rx="12" fill="#F9F9F9"/>
                  <g filter="url(#filter0_dd_70_1747)">
                    <rect x="22" y="2" width="20" height="20" rx="10" fill="#3BB77E"/>
                    <path d="M36.6666 8.5L30.2499 14.9167L27.3333 12" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </g>
                </g>
                <rect x="0.5" y="0.5" width="43" height="23" rx="11.5" stroke="#0AAD0A"/>
              </svg>
              <svg *ngIf="!product.isActive" width="45" height="25" viewBox="0 0 45 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g opacity="0.6">
                  <rect x="0.5" y="0.5" width="44" height="24" rx="12" fill="#E7EAEB"/>
                  <rect x="2.5" y="2.5" width="20" height="20" rx="10" fill="#BDC6C7"/>
                </g>
              </svg>
            </div>
            <div class="product-number">{{ getProductNumber(i) }}.</div>
            <div class="product-name">{{ product.nameAr }}</div>
            <div class="product-details">
              <div class="product-price">السعر للواحدة: <span class="profit-value">{{ formatCurrency(product.basePrice) }}</span></div>
              <div class="product-sales">المبيعات: <span class="profit-value">{{ formatCurrency(getProductSales(product)) }}</span></div>
              <div class="product-profit">النسبة من اجمالي الربح: <span class="profit-value">{{ getProductProfitPercentage(product) }}%</span></div>
            </div>
            <div class="product-menu">
              <button mat-icon-button [matMenuTriggerFor]="menu" class="menu-button">
                <mat-icon>more_vert</mat-icon>
              </button>
              <mat-menu #menu="matMenu">
                <button mat-menu-item (click)="editProduct(product)">
                  <mat-icon>edit</mat-icon>
                  <span>تعديل</span>
                </button>
                <button mat-menu-item (click)="deleteProduct(product)">
                  <mat-icon>delete</mat-icon>
                  <span>حذف</span>
                </button>
              </mat-menu>
            </div>
          </div>
        </div>

        <div class="no-products" *ngIf="filteredProducts.length === 0">
          <p>لا توجد منتجات في هذا الصنف</p>
        </div>

        <!-- Pagination -->
        <div class="pagination-container" *ngIf="filteredProducts.length > 0">
          <div class="pagination">
            <button class="page-btn prev-btn" (click)="goToPreviousPage()" [disabled]="isFirstPage()">
              &lt;
            </button>
            <button 
              class="page-btn" 
              *ngFor="let page of getPageNumbers()"
              [class.active]="pageIndex === (page - 1)"
              (click)="goToPage(page)">
              {{ page }}
            </button>
            <button class="page-btn next-btn" (click)="goToNextPage()" [disabled]="isLastPage()">
              &gt;
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div class="loading-container" *ngIf="isLoading">
        <mat-spinner></mat-spinner>
      </div>
    </div>
  `,
  styles: [`
    .products-container {
      padding: 24px;
      direction: rtl;
    }

    .header-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .page-title {
      font-size: 24px;
      font-weight: 600;
      color: #333;
      margin: 0;
    }

    .date-range {
      font-size: 14px;
      color: #666;
    }

    .summary-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
      align-items: stretch;
    }

    .summary-card {
      background: #ffffff;
      border-radius: 8px;
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .card-icon {
      width: 48px;
      height: 48px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f5f5f5;
      color: #666;
    }

    .card-icon.green {
      background: #e8f5e9;
      color: #4caf50;
    }

    .card-content {
      flex: 1;
    }

    .card-value {
      font-size: 20px;
      font-weight: 600;
      color: #333;
      margin-bottom: 4px;
    }

    .card-label {
      font-size: 14px;
      color: #666;
      margin-bottom: 4px;
    }

    .card-change {
      font-size: 12px;
      font-weight: 500;
    }

    .card-change.positive {
      color: #4caf50;
    }

    .card-change.negative {
      color: #f44336;
    }

    .add-product-btn {
      background: #45425A;
      border: 1px solid transparent;
      border-radius: 10px;
      padding: 15px;
      height: 117px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      cursor: pointer;
      transition: all 0.3s;
      color: #ffffff;
      font-size: 16px;
      font-weight: 500;
      direction: rtl;
    }

    .add-product-btn:hover {
      opacity: 0.9;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(69, 66, 90, 0.3);
    }

    .add-product-btn:active {
      transform: translateY(0);
    }

    .btn-image {
      width: auto;
      height: auto;
      max-height: 100%;
      object-fit: contain;
      flex-shrink: 0;
    }

    .btn-text-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;
    }

    .btn-text {
      font-family: 'Alexandria', sans-serif;
      font-weight: 500;
      font-style: normal;
      font-size: 24px;
      line-height: 100%;
      letter-spacing: 0px;
      text-align: right;
      white-space: nowrap;
      color: #FFFFFF;
    }

    .plus-icon {
      width: 24px;
      height: 24px;
      color: #FFFFFF;
      flex-shrink: 0;
    }

    .category-chips-container {
      margin-bottom: 32px;
      overflow-x: auto;
      overflow-y: hidden;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: thin;
      scrollbar-color: #E7EAEB #F9F9F9;
    }

    .category-chips-container::-webkit-scrollbar {
      height: 8px;
    }

    .category-chips-container::-webkit-scrollbar-track {
      background: #F9F9F9;
      border-radius: 4px;
    }

    .category-chips-container::-webkit-scrollbar-thumb {
      background: #E7EAEB;
      border-radius: 4px;
    }

    .category-chips-container::-webkit-scrollbar-thumb:hover {
      background: #D0D0D0;
    }

    .category-chips {
      display: flex;
      flex-wrap: nowrap;
      gap: 10px;
      min-width: max-content;
    }

    .category-chip {
      min-width: 97px;
      height: 42px;
      padding: 10px 24px;
      border-radius: 24px;
      border: 1px solid #E7EAEB;
      background: #F9F9F9;
      color: #333;
      font-size: 14px;
      font-weight: 400;
      cursor: pointer;
      transition: all 0.3s;
      white-space: nowrap;
      flex-shrink: 0;
      opacity: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .category-chip:hover {
      background: #F0F0F0;
    }

    .category-chip.active {
      height: 42px;
      padding: 10px 24px;
      border-radius: 24px;
      border: 1px solid #FDC040;
      background: #FFFFFF;
      color: #333;
      font-weight: 500;
    }

    .products-section {
      background: #ffffff;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .products-header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .category-header-section {
      display: flex;
      align-items: center;
      gap: 16px;
      flex: 1;
    }

    .category-image-container {
      width: 60px;
      height: 60px;
    }

    .category-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
    }

    .category-title {
      font-size: 20px;
      font-weight: 600;
      color: #333;
      margin: 0;
    }

    .search-container {
      position: relative;
      width: 25%;
      max-width: 300px;
    }

    .search-container.col-3 {
      width: 25%;
    }

    .search-input {
      width: 100%;
      padding: 12px 40px 12px 16px;
      border: 1px solid #E7EAEB;
      border-radius: 8px;
      font-size: 14px;
      direction: rtl;
    }

    .search-input:focus {
      outline: none;
      border-color: #FDC040;
    }

    .search-icon {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      pointer-events: none;
    }

    .products-actions-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .products-actions-right {
      display: flex;
      align-items: center;
    }

    .products-count {
      width: 50px;
      height: 56px;
      background: #F9F9F9;
      border: 1px solid #E7EAEB;
      border-top-right-radius: 10px;
      border-bottom-right-radius: 10px;
      box-shadow: 0px 4.44px 4.44px 0px rgba(0, 0, 0, 0.07);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: 600;
      color: #333;
    }

    .products-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 16px;
      margin-bottom: 24px;
    }

    .product-item {
      display: grid;
      grid-template-columns: auto auto 1fr auto auto;
      align-items: center;
      gap: 16px;
      border-bottom: 1px solid #D2D2D2;
    }

    .product-toggle {
      cursor: pointer;
      display: flex;
      align-items: center;
    }

    .product-number {
      font-size: 16px;
      font-weight: 600;
      color: #333;
      min-width: 30px;
    }

    .product-name {
      font-size: 16px;
      font-weight: 500;
      color: #333;
    }

    .product-details {
      display: flex;
      flex-direction: row;
      gap: 16px;
      align-items: center;
      text-align: right;
    }

    .product-price {
      font-size: 14px;
      color: #666;
      position: relative;
      padding-right: 12px;
    }

    .product-price::before {
      content: '';
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: #ADB5BD;
    }

    .product-sales {
      font-size: 14px;
      color: #666;
      position: relative;
      padding-right: 12px;
    }

    .product-sales::before {
      content: '';
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: #ADB5BD;
    }

    .product-profit {
      font-size: 14px;
      color: #666;
      position: relative;
      padding-right: 12px;
    }

    .product-profit::before {
      content: '';
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: #ADB5BD;
    }

    .profit-value {
      color: #000000;
    }

    .product-menu {
      display: flex;
      align-items: center;
    }

    .menu-button {
      color: #666;
    }

    .no-products {
      text-align: center;
      padding: 40px;
      color: #999;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 40px;
    }

    .pagination-container {
      display: flex;
      justify-content: center;
      margin-top: 32px;
    }

    .pagination {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .page-btn {
      min-width: 40px;
      height: 40px;
      border: 1px solid #E7EAEB;
      background: #FFFFFF;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 400;
      color: #333;
      cursor: pointer;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .page-btn:hover:not(:disabled) {
      background: #F9F9F9;
      border-color:  #F00E0C;
;
    }

    .page-btn.active {
      width: 35px;
      height: 35px;
      border-radius: 777px;
      padding: 9px 11px;
      background: #FFFEFE;
      box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.07);
      color: #F00E0C;
      border: none;
      font-weight: 600;
    }

    .page-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .action-btn.add-product {
      background: #FDC040;
      color: #FFFFFF;
      width: 132px;
      height: 54px;
      padding: 16px 12px;
      gap: 11px;
      border-top-right-radius: 0;
      border-top-left-radius: 0;
      border-bottom-left-radius: 10px;
      border-bottom-right-radius: 0;
      box-shadow: 0px 4.44px 4.44px 0px rgba(0, 0, 0, 0.07);
      font-family: Alexandria;
      font-weight: 400;
      font-size: 14px;
      line-height: 100%;
      letter-spacing: 0%;
      text-align: right;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border: none;
      cursor: pointer;
      transition: all 0.3s;
    }

    .action-btn.add-product:hover {
      background: #FDC040;
      opacity: 0.9;
    }
  `]
})
export class ProductsManagementComponent implements OnInit {
  categoriesWithProducts: CategoryWithProducts[] = [];
  selectedCategoryId: number | null = null;
  selectedCategory: CategoryWithProducts | null = null;
  filteredProducts: Product[] = [];
  paginatedProducts: Product[] = [];
  searchTerm: string = '';
  isLoading: boolean = false;

  // Pagination properties
  pageSize: number = 10;
  pageIndex: number = 0;

  constructor(
    private categoryService: CategoryService,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private messageService: MessageService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadCategoriesWithProducts();
  }

  loadCategoriesWithProducts(): void {
    this.isLoading = true;
    this.categoryService.getCategoriesWithProducts().subscribe({
      next: (categories: CategoryWithProducts[]) => {
        this.categoriesWithProducts = categories.filter(cat => cat.isActive);
        if (this.categoriesWithProducts.length > 0) {
          // Select first category by default
          this.selectCategory(this.categoriesWithProducts[0]);
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading categories with products:', error);
        this.snackBar.open('فشل تحميل الأصناف والمنتجات', 'إغلاق', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  selectCategory(category: CategoryWithProducts): void {
    this.selectedCategoryId = category.id;
    this.selectedCategory = category;
    this.searchTerm = '';
    this.pageIndex = 0;
    this.filterProducts();
  }

  filterProducts(): void {
    if (!this.selectedCategory) {
      this.filteredProducts = [];
      this.paginatedProducts = [];
      return;
    }

    let products = this.selectedCategory.products || [];

    // Filter by search term
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      products = products.filter(product =>
        product.nameAr?.toLowerCase().includes(searchLower) ||
        product.nameEn?.toLowerCase().includes(searchLower)
      );
    }

    this.filteredProducts = products;
    this.updatePaginatedProducts();
  }

  updatePaginatedProducts(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.updatePaginatedProducts();
  }

  getPageNumbers(): number[] {
    const totalPages = Math.ceil(this.filteredProducts.length / this.pageSize);
    const pages: number[] = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  goToPage(page: number): void {
    this.pageIndex = page - 1;
    this.updatePaginatedProducts();
  }

  goToNextPage(): void {
    if (!this.isLastPage()) {
      this.pageIndex++;
      this.updatePaginatedProducts();
    }
  }

  goToPreviousPage(): void {
    if (!this.isFirstPage()) {
      this.pageIndex--;
      this.updatePaginatedProducts();
    }
  }

  isFirstPage(): boolean {
    return this.pageIndex === 0;
  }

  isLastPage(): boolean {
    return (this.pageIndex + 1) * this.pageSize >= this.filteredProducts.length;
  }

  getProductsCount(): number {
    if (!this.selectedCategory) {
      return 0;
    }
    return this.filteredProducts.length;
  }

  getTotalProductsCount(): number {
    if (!this.categoriesWithProducts || this.categoriesWithProducts.length === 0) {
      return 0;
    }
    return this.categoriesWithProducts.reduce((total, category) => {
      return total + (category.products?.length || 0);
    }, 0);
  }

  getProductNumber(index: number): number {
    return (this.pageIndex * this.pageSize) + index + 1;
  }

  getProductSales(product: Product): number {
    // Mock sales calculation - replace with actual calculation
    return product.basePrice * 1000;
  }

  getProductProfitPercentage(product: Product): string {
    // Mock profit percentage - replace with actual calculation
    // Use product ID as seed for consistent value per product
    const seed = product.id || 0;
    const random = ((seed * 9301 + 49297) % 233280) / 233280;
    return (random * 15).toFixed(1);
  }

  formatCurrency(amount: number): string {
    if (amount == null || isNaN(amount)) {
      return '0';
    }
    const currentLang = this.translate.currentLang || 'ar';
    const formattedNumber = amount.toLocaleString('en-US');
    const currencySymbol = currentLang === 'ar' ? 'ر.ق' : 'QAR';
    return `${formattedNumber} ${currencySymbol}`;
  }

  toggleProduct(product: Product): void {
    // TODO: Implement product toggle functionality
    product.isActive = !product.isActive;
    this.messageService.add({
      severity: 'success',
      summary: 'نجح',
      detail: 'تم تحديث حالة المنتج',
      life: 3000
    });
  }

  openAddProductDialog(): void {
    if (!this.selectedCategory) {
      this.messageService.add({
        severity: 'warn',
        summary: 'تحذير',
        detail: 'يرجى اختيار صنف أولاً',
        life: 3000
      });
      return;
    }

    const dialogRef = this.dialog.open(AddProductDialogComponent, {
      width: '500px',
      maxWidth: '90vw',
      disableClose: false,
      panelClass: 'add-product-dialog',
      data: {
        categoryId: this.selectedCategory.id,
        isEdit: false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.success) {
        // Reload products to show the new product
        this.loadCategoriesWithProducts();
      }
    });
  }

  addProduct(): void {
    this.openAddProductDialog();
  }

  editProduct(product: Product): void {
    const dialogRef = this.dialog.open(AddProductDialogComponent, {
      width: '500px',
      maxWidth: '90vw',
      disableClose: false,
      panelClass: 'add-product-dialog',
      data: {
        product: product,
        categoryId: product.categoryId,
        isEdit: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.success) {
        // Reload products to show the updated product
        this.loadCategoriesWithProducts();
      }
    });
  }

  deleteProduct(product: Product): void {
    // TODO: Implement delete product functionality
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      this.messageService.add({
        severity: 'success',
        summary: 'نجح',
        detail: 'تم حذف المنتج',
        life: 3000
      });
    }
  }
}

