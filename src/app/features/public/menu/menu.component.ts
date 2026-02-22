import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule, ViewportScroller } from '@angular/common';
import { Observable, of, Subscription } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SharedModule } from '../../../shared/shared.module';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { Category, MenuItem } from '../../../models/menu-item.model';
import { Router, ActivatedRoute } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { TranslationService } from '../../../core/services/translation.service';
import { CategoryService } from '../../../core/services/category.service';
import { CategoryWithProducts } from '../../../models/category.model';
import { addLanguageProperty, getDisplayName, getDisplayDescription } from '../../../core/utils/item-translation.util';
import { MatDialog } from '@angular/material/dialog';
import { CartDialogComponent } from './cart-dialog.component';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, SharedModule, TranslateModule, LoadingSpinnerComponent],
  template: `
    <div class="container-fluid px-0">
      <!-- Breadcrumb Navigation -->
      <div class="breadcrumb-container">
        <nav class="breadcrumb-nav">
          <a routerLink="/">{{ 'NAV.HOME' | translate }}</a>
          <span> > </span>
          <span>{{ 'NAV.MENU' | translate }}</span>
        </nav>
      </div>

      <!-- Main Content -->
      <div class="menu-content-wrapper">
        <div class="container-fluid px-0">
          <div class="row g-0">
            <!-- Items Grid -->
            <div class="col-12 col-md-9 items-wrapper">
              <!-- Banner Section -->
              <section class="menu-banner-section position-relative">
                <img src="assets/Rectangle34624514.jpg" alt="Falafel Banner" class="banner-image" />
                <div class="banner-overlay">
                  <div class="banner-content">
                    <div class="banner-discount">خصم 15%</div>
                    <div class="banner-text">على ساندوتش فلافل رويال ميكس</div>
                  </div>
                </div>
              </section>

              <!-- Mobile Category Chips (hidden on desktop, shown on mobile) -->
              <div class="mobile-chips-bar">
                <div class="mobile-chips-loading" *ngIf="isLoadingCategories">
                  <app-loading-spinner></app-loading-spinner>
                </div>
                <ul class="mobile-chip-list" *ngIf="!isLoadingCategories">
                  <li
                    *ngFor="let category of categories$ | async"
                    [class.active]="selectedCategoryId !== null && selectedCategoryId === +category.id"
                    (click)="selectCategory(category.id)">
                    <span class="mobile-chip-badge">{{ getCategoryItemCount(category.id) }}</span>
                    <span class="mobile-chip-name-wrapper">
                      <span class="category-arrow" *ngIf="selectedCategoryId !== null && selectedCategoryId === +category.id">
                        <svg width="11" height="12" viewBox="0 0 11 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9.49981 10.5V1.49999C9.49952 1.40887 9.47439 1.31955 9.42712 1.24165C9.37985 1.16375 9.31223 1.10022 9.23153 1.05789C9.15084 1.01556 9.06013 0.996045 8.96917 1.00144C8.87821 1.00683 8.79044 1.03692 8.71531 1.08849L2.21531 5.58849C1.94581 5.77499 1.94581 6.22399 2.21531 6.41099L8.71531 10.911C8.79028 10.9631 8.87809 10.9936 8.96921 10.9993C9.06032 11.005 9.15125 10.9856 9.23211 10.9432C9.31298 10.9009 9.38069 10.8371 9.42788 10.759C9.47508 10.6809 9.49995 10.5913 9.49981 10.5Z" fill="#72767E"/>
                        </svg>
                      </span>
                      <span class="mobile-chip-name">
                        <span *ngIf="currentLang === 'ar'">{{ category.name }}</span>
                        <span *ngIf="currentLang === 'en'">{{ category.nameEn || category.name }}</span>
                      </span>
                    </span>
                  </li>
                </ul>
              </div>

              <div class="items-content" #itemsContent>
                <h2 class="items-title" *ngIf="selectedCategoryName">
                  {{ selectedCategoryName }}
                </h2>
                <h2 class="items-title" *ngIf="!selectedCategoryName">
                  {{ 'NAV.MENU' | translate }}
                </h2>
                
                <!-- Loading Spinner -->
                <div class="loading-wrapper" *ngIf="isLoading">
                  <app-loading-spinner></app-loading-spinner>
                </div>
                
                <!-- Items Grid -->
                <div class="items-grid" *ngIf="!isLoading && (menuItems$ | async) as items">
                  <div class="item-card" *ngFor="let item of items" (click)="navigateToItem(item.id)">
                    <div class="item-image-wrapper">
                      <img [src]="item.imageUrl" [alt]="item.name" class="item-image" />
                    </div>
                    <div class="item-content">
                      <h4 class="item-name">{{ currentLang === 'ar' ? item.name : (item.nameEn || item.name) }}</h4>
                      <div class="item-rating">
                        <span class="stars">★★★★★</span>
                      </div>
                      <div class="item-footer">
                        <span class="item-price">{{ item.price }} {{ "COMMON.RIYAL" | translate }}</span>
                        <button class="order-button" (click)="addToCart(item, $event)">
                          {{ "COMMON.ORDER" | translate }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Pagination -->
                <div class="pagination-wrapper" *ngIf="totalPages > 1">
                  <div class="pagination">
                    <button 
                      class="page-btn prev-btn" 
                      [class.disabled]="!hasPreviousPage()"
                      (click)="goToPreviousPage()"
                      [disabled]="!hasPreviousPage()">
                      &lt;&lt;
                    </button>
                    <button 
                      *ngFor="let page of getPageNumbers()"
                      class="page-btn" 
                      [class.active]="currentPage === page" 
                      (click)="goToPage(page)">
                      {{ page }}
                    </button>
                    <button 
                      class="page-btn next-btn" 
                      [class.disabled]="!hasNextPage()"
                      (click)="goToNextPage()"
                      [disabled]="!hasNextPage()">
                      &gt;&gt;
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Sidebar Navigation -->
            <div class="col-12 col-md-3 sidebar-wrapper">
              <div class="sidebar-content">
                <h3 class="sidebar-title">{{ 'NAV.MENU' | translate }}</h3>
                
                <!-- Loading Spinner for Categories -->
                <div class="loading-wrapper" *ngIf="isLoadingCategories">
                  <app-loading-spinner></app-loading-spinner>
                </div>
                
                <!-- Category List -->
                <ul class="category-list" *ngIf="!isLoadingCategories">
                  <li 
                    *ngFor="let category of categories$ | async"
                    [class.active]="selectedCategoryId !== null && selectedCategoryId === +category.id"
                    (click)="selectCategory(category.id)">
                    <span class="category-name-wrapper">
                      <span class="category-arrow" *ngIf="selectedCategoryId !== null && selectedCategoryId === +category.id"><svg width="11" height="12" viewBox="0 0 11 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9.49981 10.5V1.49999C9.49952 1.40887 9.47439 1.31955 9.42712 1.24165C9.37985 1.16375 9.31223 1.10022 9.23153 1.05789C9.15084 1.01556 9.06013 0.996045 8.96917 1.00144C8.87821 1.00683 8.79044 1.03692 8.71531 1.08849L2.21531 5.58849C1.94581 5.77499 1.94581 6.22399 2.21531 6.41099L8.71531 10.911C8.79028 10.9631 8.87809 10.9936 8.96921 10.9993C9.06032 11.005 9.15125 10.9856 9.23211 10.9432C9.31298 10.9009 9.38069 10.8371 9.42788 10.759C9.47508 10.6809 9.49995 10.5913 9.49981 10.5Z" fill="#72767E"/>
</svg>
</span>
                      <span class="category-name">
                        <span *ngIf="currentLang === 'ar'">{{ category.name }}</span>
                        <span *ngIf="currentLang === 'en'">{{ category.nameEn || category.name }}</span>
                      </span>
                    </span>
                    <span class="category-count-badge">{{ getCategoryItemCount(category.id) }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .menu-banner-section {
      width: 100%;
      height: 300px;
      overflow: hidden;
      position: relative;
      border-radius: 15px;
      margin-bottom: 2rem;
    }
    .banner-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .banner-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(to left, rgba(0,0,0,0.2), rgba(0,0,0,0.4));
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-right: 2rem;
    }
    .banner-content {
      text-align: right;
      color: white;
      direction: rtl;
    }
    .banner-discount {
      font-family: 'Almarai', sans-serif;
      font-weight: 700;
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
      color: white;
    }
    .banner-text {
      font-family: 'Almarai', sans-serif;
      font-weight: 400;
      font-size: 1.2rem;
      color: white;
    }
    .breadcrumb-container {
      padding: 1rem 7rem;
      background-color: #ffffff;
      direction: rtl;
      display: flex;
      align-items: flex-start;
    }
    .breadcrumb-nav {
      font-family: 'Almarai', sans-serif;
      font-size: 0.9rem;
      color: #666;
    }
    .breadcrumb-nav a {
      color: #d32f2f;
      text-decoration: none;
    }
    .breadcrumb-nav span {
      margin: 0 0.5rem;
    }
    .menu-content-wrapper {
      background-color: #ffffff;
      // padding: 2rem 0;
    }
    .sidebar-wrapper {
      width: 268px;
      max-height: 837.4270629882812px;
      opacity: 1;
      gap: 10px;
      border-radius: 15px;
      border: 0.5px solid #F00E0C;
      padding-top: 28px;
      padding-right: 16px;
      padding-bottom: 28px;
      padding-left: 16px;
      background: #FFFFFF;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .sidebar-content {
      direction: rtl;
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
    }
    .sidebar-title {
      font-family: 'Almarai', sans-serif;
      font-weight: 700;
      font-size: 1.5rem;
      color: #d32f2f;
      text-align: center;
      margin-bottom: 1.5rem;
      padding-bottom: 0.5rem;
      position: relative;
    }
    .sidebar-title::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 100px;
      height: 4px;
      background-color: #FDC55E;
    }
    .category-list {
      list-style: none;
      padding: 0;
      margin: 0;
      overflow-y: auto;
      flex: 1;
      padding-right: 4px;
    }
    
    .category-list::-webkit-scrollbar {
      width: 6px;
    }
    
    .category-list::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 10px;
    }
    
    .category-list::-webkit-scrollbar-thumb {
      background: #d32f2f;
      border-radius: 10px;
    }
    
    .category-list::-webkit-scrollbar-thumb:hover {
      background: #b71c1c;
    }
    .category-list li {
      width: 100%;
      height: 48px;
      opacity: 1;
      border-radius: 7474px;
      padding: 0.75rem 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
      margin-bottom: 0.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #ffffff;
      border: none;
    }
    .category-list li:hover {
      background-color: #ffffff;
    }
    .category-count-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      transform: rotate(0deg);
      opacity: 1;
      gap: 10px;
      border-radius: 20px;
      border: 1px solid #ECECEC;
      padding: 6px 10px;
      background: #FFFFFF;
      flex-shrink: 0;
      margin-left: 10px;
      font-family: 'Alexandria', sans-serif;
      font-weight: 600;
      font-size: 14px;
      line-height: 24px;
      letter-spacing: 0%;
      text-align: center;
      vertical-align: middle;
      color: #72767E;
    }
    .category-name-wrapper {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex: 1;
      justify-content: flex-start;
      direction: rtl;
    }
    .category-arrow {
      color: #666;
      font-size: 0.6rem;
      display: inline-block;
      margin-left: 0.25rem;
    }
    .category-name {
      font-family: 'Almarai', sans-serif;
      font-weight: 400;
      font-size: 1rem;
      color: #333;
      text-align: right;
      position: relative;
      display: inline-block;
    }
    .category-list li.active {
      width: 100%;
      height: 48px;
      opacity: 1;
      border-radius: 7474px;
      border-bottom: 2px solid #FDC040;
    }
    .category-list li.active .category-name {
      color: #d32f2f;
      position: relative;
    }
    .category-list li.active .category-arrow {
      color: #666;
    }
    .items-wrapper {
      padding: 2rem;
      padding-top: 0;
    }
    .items-content {
      direction: rtl;
    }
    .items-title {
      font-family: 'Almarai', sans-serif;
      font-weight: 700;
      font-size: 2rem;
      color: #d32f2f;
      padding-bottom: 0.5rem;
      display: flex;
    }
    .items-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 2rem;
      margin-bottom: 2rem;
    }
    .item-card {
      background-color: #ffffff;
      border-radius: 15px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      cursor: pointer;
    }
    .item-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 16px rgba(0,0,0,0.2);
    }
    .item-image-wrapper {
      width: 100%;
      height: 200px;
      overflow: hidden;
    }
    .item-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .item-content {
      padding: 1rem;
    }
    .item-name {
      font-family: 'Almarai', sans-serif;
      font-weight: 700;
      font-size: 1.1rem;
      color: #333;
      margin-bottom: 0.5rem;
    }
    .item-rating {
      margin-bottom: 1rem;
    }
    .stars {
      color: #FFD700;
      font-size: 0.9rem;
    }
    .item-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .item-price {
      font-family: 'Aref_Menna', serif;
      font-weight: 700;
      font-size: 1.5rem;
      color: #d32f2f;
    }
    .order-button {
      background-color: #d32f2f;
      color: white;
      border: none;
      border-radius: 25px;
      padding: 0.5rem 1.5rem;
      font-family: 'Almarai', sans-serif;
      font-weight: 700;
      font-size: 0.9rem;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }
    .order-button:hover {
      background-color: #b71c1c;
    }
    .pagination-wrapper {
      display: flex;
      justify-content: center;
      margin-top: 2rem;
    }
    .pagination {
      display: flex;
      gap: 0.5rem;
    }
    .page-btn {
      width: 40px;
      height: 40px;
      border: 1px solid #ddd;
      background-color: #ffffff;
      border-radius: 8px;
      font-family: 'Almarai', sans-serif;
      font-weight: 400;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .page-btn:hover {
      background-color: #f0f0f0;
    }
    .page-btn.active {
      background-color: #d32f2f;
      color: white;
      border-color: #d32f2f;
    }
    .page-btn.disabled,
    .page-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      pointer-events: none;
    }
    .page-btn.prev-btn,
    .page-btn.next-btn {
      min-width: 50px;
    }
    .loading-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 200px;
      padding: 2rem;
    }
    /* ── Mobile chips bar: hidden on desktop ── */
    .mobile-chips-bar {
      display: none;
    }

    @media (max-width: 992px) {
      .sidebar-wrapper {
        width: 220px;
      }
      .items-wrapper {
        padding: 1rem;
      }
    }
    @media (max-width: 768px) {
      .breadcrumb-container {
        padding: 0.75rem 1rem;
      }

      /* Hide the sidebar on mobile */
      .sidebar-wrapper {
        display: none;
      }

      /* Items wrapper takes full width */
      .items-wrapper {
        padding: 0.5rem 1rem 1rem;
      }

      .items-grid {
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        gap: 1rem;
      }

      .menu-banner-section {
        height: 200px;
        margin-bottom: 0;
        border-radius: 10px;
      }
      .banner-discount { font-size: 1.5rem; }
      .banner-text { font-size: 0.9rem; }
      .items-title { font-size: 1.5rem; }

      /* ── Mobile chips bar ── */
      .mobile-chips-bar {
        display: block;
        background: #ffffff;
        padding: 10px 16px 4px;
        margin-bottom: 1rem;
      }

      .mobile-chips-loading {
        display: flex;
        justify-content: center;
        padding: 0.5rem;
        min-height: 48px;
      }

      .mobile-chip-list {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        gap: 8px;
        overflow-x: auto;
        -ms-overflow-style: none;
        scrollbar-width: none;
        padding-bottom: 6px;
      }

      .mobile-chip-list::-webkit-scrollbar {
        display: none;
      }

      .mobile-chip-list li {
        display: inline-flex;
        align-items: center;
        justify-content: space-between;
        flex-shrink: 0;
        height: 48px;
        border-radius: 7474px;
        padding: 0.75rem 1rem;
        background-color: #ffffff;
        border: none;
        box-shadow: 0 1px 6px rgba(0,0,0,0.10);
        cursor: pointer;
        transition: all 0.2s ease;
        gap: 6px;
      }

      .mobile-chip-list li.active {
        border-bottom: 2px solid #FDC040;
        background-color: #ffffff;
      }

      .mobile-chip-list li.active .mobile-chip-name {
        color: #d32f2f;
        font-weight: 600;
      }

      .mobile-chip-name-wrapper {
        display: flex;
        align-items: center;
        gap: 4px;
        direction: rtl;
      }

      .mobile-chip-name {
        font-family: 'Almarai', sans-serif;
        font-weight: 400;
        font-size: 0.95rem;
        color: #333;
        white-space: nowrap;
      }

      .mobile-chip-badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 24px;
        height: 24px;
        border-radius: 20px;
        border: 1px solid #ECECEC;
        padding: 0 6px;
        background: #FFFFFF;
        font-family: 'Alexandria', sans-serif;
        font-weight: 600;
        font-size: 12px;
        color: #72767E;
        flex-shrink: 0;
      }
    }
    @media (max-width: 480px) {
      .items-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 0.75rem;
      }
      .item-image-wrapper {
        height: 150px;
      }
      .item-name {
        font-size: 0.9rem;
      }
      .item-price {
        font-size: 1.1rem;
      }
      .order-button {
        padding: 0.4rem 0.8rem;
        font-size: 0.8rem;
      }
      .menu-banner-section {
        height: 150px;
      }
      .banner-discount {
        font-size: 1.2rem;
      }
    }
  `]
})
export class MenuComponent implements OnInit, OnDestroy {
  @ViewChild('itemsContent', { static: false }) itemsContent!: ElementRef;
  categories$!: Observable<Category[]>;
  menuItems$!: Observable<MenuItem[]>;
  selectedCategoryId: number | null = null;
  selectedCategoryName: string | null = null;
  allMenuItems: MenuItem[] = [];
  allCategoriesWithProducts: CategoryWithProducts[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 12;
  currentLang: string = 'en';
  totalPages: number = 1;
  isLoading: boolean = false;
  isLoadingCategories: boolean = false;
  isShow: boolean = false;
  private langChangeSubscription?: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cartService: CartService,
    private translationService: TranslationService,
    private categoryService: CategoryService,
    private translate: TranslateService,
    private viewportScroller: ViewportScroller,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {
    this.currentLang = this.translationService.getCurrentLanguage();
    this.langChangeSubscription = this.translate.onLangChange.subscribe(event => {
      this.currentLang = event.lang;
      // Update selectedCategoryName if a category is selected
      if (this.selectedCategoryId !== null) {
        const category = this.allCategoriesWithProducts.find(cat => cat.id === this.selectedCategoryId);
        if (category) {
          this.selectedCategoryName = this.currentLang === 'ar' ? category.nameAr : category.nameEn;
        }
      }
      this.cdr.detectChanges();
    });
  }

  ngOnInit(): void {
    // Load categories with products from API
    this.loadCategoriesWithProducts();

    // Check for category query parameter (now expects ID)
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        const categoryId = parseInt(params['category'], 10);
        if (!isNaN(categoryId)) {
          this.selectCategory(categoryId.toString());
        }
      } else {
        this.loadMenuItems();
      }
    });
  }

  loadCategoriesWithProducts(): void {
    this.isLoading = true;
    this.isLoadingCategories = true;

    this.categoryService.getCategoriesWithProducts().pipe(
      catchError(error => {
        console.error('Error loading categories with products:', error);
        this.isLoading = false;
        this.isLoadingCategories = false;
        return of([]);
      })
    ).subscribe((categoriesWithProducts: CategoryWithProducts[]) => {
      // Filter only active categories
      const activeCategories = categoriesWithProducts.filter(cat => cat.isActive);
      this.allCategoriesWithProducts = activeCategories;

      // Transform to Category format for the sidebar
      const categories: Category[] = activeCategories.map(cat => ({
        id: cat.id.toString(),
        name: cat.nameAr || '',
        nameEn: cat.nameEn || '',
        description: cat.descriptionAr || '',
        descriptionEn: cat.descriptionEn || '',
        imageUrl: cat.imageUrl || '',
        displayOrder: 0,
        isActive: cat.isActive
      }));

      this.categories$ = of(addLanguageProperty(categories, this.translationService));

      this.isLoadingCategories = false;

      // Transform all products to MenuItem format
      this.allMenuItems = [];
      activeCategories.forEach(category => {
        if (category.products && category.products.length > 0) {
          category.products.forEach((product: any) => {
            if (product.isActive) {
              this.allMenuItems.push({
                id: product.id.toString(),
                name: product.nameAr || '',
                nameEn: product.nameEn || '',
                description: product.descriptionAr || '',
                descriptionEn: product.descriptionEn || '',
                price: product.basePrice || 0,
                imageUrl: product.imageUrl || 'https://via.placeholder.com/300',
                categoryId: category.id.toString(),
                isAvailable: product.isActive
              });
            }
          });
        }
      });

      // Load menu items after data is loaded
      this.loadMenuItems();
      this.isLoading = false;
      this.isLoadingCategories = false;
    });
  }

  selectCategory(categoryId: string): void {
    this.selectedCategoryId = parseInt(categoryId, 10);
    const category = this.allCategoriesWithProducts.find(cat => cat.id === this.selectedCategoryId);
    if (category) {
      this.selectedCategoryName = this.currentLang === 'ar' ? category.nameAr : category.nameEn;
    }
    this.currentPage = 1;
    this.loadMenuItems();
    // Update URL with category ID
    this.router.navigate(['/menu'], { queryParams: { category: categoryId } });
  }

  selectCategoryByName(categoryName: string): void {
    // Find category by name (for backward compatibility)
    const category = this.allCategoriesWithProducts.find(
      cat => cat.nameAr === categoryName || cat.nameEn === categoryName
    );
    if (category) {
      this.selectCategory(category.id.toString());
    }
  }

  loadMenuItems(): void {
    let allFilteredItems: MenuItem[];
    if (this.selectedCategoryId !== null) {
      allFilteredItems = this.allMenuItems.filter(item => item.categoryId === this.selectedCategoryId!.toString());
    } else {
      allFilteredItems = this.allMenuItems;
    }

    // Calculate total pages
    this.totalPages = Math.ceil(allFilteredItems.length / this.itemsPerPage);

    // Ensure currentPage doesn't exceed totalPages
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    }

    // Pagination
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const paginatedItems = allFilteredItems.slice(startIndex, endIndex);

    // Add isArabicLang property to items
    this.menuItems$ = of(addLanguageProperty(paginatedItems, this.translationService));
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5; // Show max 5 page buttons
    let startPage = 1;
    let endPage = this.totalPages;

    if (this.totalPages > maxVisiblePages) {
      // Show pages around current page
      const halfVisible = Math.floor(maxVisiblePages / 2);
      startPage = Math.max(1, this.currentPage - halfVisible);
      endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

      // Adjust if we're near the end
      if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  hasNextPage(): boolean {
    return this.currentPage < this.totalPages;
  }

  hasPreviousPage(): boolean {
    return this.currentPage > 1;
  }

  getCategoryItemCount(categoryId: string): number {
    return this.allMenuItems.filter(item => item.categoryId === categoryId).length;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadMenuItems();
      // Scroll to the items section so user can see the first item
      setTimeout(() => {
        if (this.itemsContent) {
          this.itemsContent.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          // Fallback to scroll to top if element not found
          this.viewportScroller.scrollToPosition([0, 0]);
        }
      }, 100);
    }
  }

  goToNextPage(): void {
    if (this.hasNextPage()) {
      this.goToPage(this.currentPage + 1);
    }
  }

  goToPreviousPage(): void {
    if (this.hasPreviousPage()) {
      this.goToPage(this.currentPage - 1);
    }
  }

  addToCart(item: MenuItem, event: Event): void {
    event.stopPropagation();

    // Open cart dialog with item data (without adding to cart first)
    const dialogRef = this.dialog.open(CartDialogComponent, {
      width: '90vw',
      maxWidth: '500px',
      maxHeight: '90vh',
      panelClass: 'cart-dialog-panel',
      disableClose: false,
      data: { item: item }
    });
  }

  navigateToItem(itemId: string): void {
    this.router.navigate(['/item', itemId]);
  }

  ngOnDestroy(): void {
    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }
  }
}

