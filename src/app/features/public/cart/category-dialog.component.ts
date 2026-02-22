import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from '../../../shared/shared.module';
import { Category, MenuItem } from '../../../models/menu-item.model';
import { CartService } from '../../../core/services/cart.service';
import { CategoryService } from '../../../core/services/category.service';
import { CategoryWithProducts } from '../../../models/category.model';
import { TranslationService } from '../../../core/services/translation.service';
import { TranslateService } from '@ngx-translate/core';
import { addLanguageProperty } from '../../../core/utils/item-translation.util';
import { Observable, of, Subscription } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-category-dialog',
  standalone: true,
  imports: [CommonModule, SharedModule, MatDialogModule],
  template: `
    <div class="category-dialog-container">
      <div class="dialog-header">
        <h2 class="dialog-title">اختر الصنف</h2>
        <button mat-icon-button class="close-btn" (click)="close()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <div class="dialog-content">
        <!-- Categories Grid -->
        <div class="categories-section" *ngIf="!selectedCategory">
          <div class="categories-grid">
            <div 
              class="category-card" 
              *ngFor="let category of categories$ | async"
              (click)="selectCategory(category)">
              <div class="category-image-wrapper">
                <img 
                  [src]="category.imageUrl || 'assets/itmes/' + category.name + '.png'" 
                  [alt]="category.name" 
                  class="category-image"
                  onerror="this.src='assets/placeholder.png'" />
              </div>
              <div class="category-name">{{ category.isArabicLang ? category.name : (category.nameEn || category.name) }}</div>
            </div>
          </div>
        </div>

        <!-- Menu Items Grid -->
        <div class="menu-items-section" *ngIf="selectedCategory">
          <div class="section-header">
            <button class="back-btn" (click)="goBack()">
              <mat-icon>arrow_back</mat-icon>
              <span>رجوع</span>
            </button>
            <h3 class="section-title">{{ selectedCategory.isArabicLang ? selectedCategory.name : (selectedCategory.nameEn || selectedCategory.name) }}</h3>
          </div>
          
          <div class="menu-items-grid">
            <div class="menu-item-card" *ngFor="let item of filteredMenuItems$ | async">
              <div class="item-image-wrapper">
                <img [src]="item.imageUrl" [alt]="item.name" class="item-image" />
              </div>
              <div class="item-content">
                <h4 class="item-name">{{ item.isArabicLang ? item.name : (item.nameEn || item.name) }}</h4>
                <div class="item-footer">
                  <span class="item-price">{{ item.price }} {{ "COMMON.RIYAL" | translate }}</span>
                  <button class="add-btn" (click)="addToCart(item)">
                    <span>{{ "COMMON.ORDER" | translate }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .category-dialog-container {
      width: 90vw;
      max-width: 1200px;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      background: white;
      border-radius: 15px;
      overflow: hidden;
      direction: rtl;
    }

    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid #e0e0e0;
      background: #F00E0C;
    }

    .dialog-title {
      font-family: 'Alexandria', sans-serif;
      font-weight: 700;
      font-size: 1.5rem;
      color: white;
      margin: 0;
    }

    .close-btn {
      color: white;
    }

    .dialog-content {
      flex: 1;
      overflow-y: auto;
      padding: 2rem;
    }

    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 2rem;
    }

    .category-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      cursor: pointer;
      transition: transform 0.3s ease;
      padding: 1rem;
      border-radius: 15px;
    }

    .category-card:hover {
      transform: translateY(-5px);
      background: #f5f5f5;
    }

    .category-image-wrapper {
      width: 120px;
      height: 120px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .category-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
    }

    .category-name {
      font-family: 'Alexandria', sans-serif;
      font-weight: 600;
      font-size: 1rem;
      color: #333;
      text-align: center;
    }

    .menu-items-section {
      width: 100%;
    }

    .section-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .back-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: #F00E0C;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      cursor: pointer;
      font-family: 'Alexandria', sans-serif;
      font-weight: 600;
    }

    .section-title {
      font-family: 'Alexandria', sans-serif;
      font-weight: 700;
      font-size: 1.5rem;
      color: #F00E0C;
      margin: 0;
    }

    .menu-items-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .menu-item-card {
      background: white;
      border-radius: 15px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      cursor: pointer;
    }

    .menu-item-card:hover {
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
      font-family: 'Alexandria', sans-serif;
      font-weight: 700;
      font-size: 1.1rem;
      color: #333;
      margin-bottom: 1rem;
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
      color: #F00E0C;
    }

    .add-btn {
      background: #F00E0C;
      color: white;
      border: none;
      border-radius: 25px;
      padding: 0.5rem 1.5rem;
      font-family: 'Alexandria', sans-serif;
      font-weight: 700;
      font-size: 0.9rem;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }

    .add-btn:hover {
      background: #b71c1c;
    }

    @media (max-width: 768px) {
      .category-dialog-container {
        width: 95vw;
        max-height: 95vh;
      }

      .categories-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
      }

      .menu-items-grid {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 1rem;
      }
    }
  `]
})
export class CategoryDialogComponent implements OnInit, OnDestroy {
  categories$!: Observable<Category[]>;
  filteredMenuItems$!: Observable<MenuItem[]>;
  selectedCategory: Category | null = null;
  allCategoriesWithProducts: CategoryWithProducts[] = [];
  allMenuItems: MenuItem[] = [];
  private langChangeSubscription?: Subscription;

  constructor(
    private dialogRef: MatDialogRef<CategoryDialogComponent>,
    private cartService: CartService,
    private categoryService: CategoryService,
    private translationService: TranslationService,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef
  ) {
    this.langChangeSubscription = this.translate.onLangChange.subscribe(() => {
      this.cdr.detectChanges();
    });
  }

  ngOnInit(): void {
    this.loadCategoriesWithProducts();
  }

  loadCategoriesWithProducts(): void {
    this.categoryService.getCategoriesWithProducts().pipe(
      catchError(error => {
        console.error('Error loading categories with products:', error);
        return of([]);
      })
    ).subscribe((categoriesWithProducts: CategoryWithProducts[]) => {
      // Filter only active categories
      const activeCategories = categoriesWithProducts.filter(cat => cat.isActive);
      this.allCategoriesWithProducts = activeCategories;

      // Transform to Category format for display
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
    });
  }

  selectCategory(category: Category): void {
    this.selectedCategory = category;
    // Filter menu items by selected category and add language property
    const filteredItems = this.allMenuItems.filter(item => item.categoryId === category.id);
    this.filteredMenuItems$ = of(addLanguageProperty(filteredItems, this.translationService));
  }

  goBack(): void {
    this.selectedCategory = null;
  }

  addToCart(item: MenuItem): void {
    this.cartService.addItem(item, 1);
    // Optionally close dialog after adding
    // this.close();
  }

  close(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }
  }
}

