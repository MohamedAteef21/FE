import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from '../../../shared/shared.module';
import { Category, MenuItem } from '../../../models/menu-item.model';
import { CartService } from '../../../core/services/cart.service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

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
              <div class="category-name">{{ category.name }}</div>
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
            <h3 class="section-title">{{ selectedCategory.name }}</h3>
          </div>
          
          <div class="menu-items-grid">
            <div class="menu-item-card" *ngFor="let item of filteredMenuItems$ | async">
              <div class="item-image-wrapper">
                <img [src]="item.imageUrl" [alt]="item.name" class="item-image" />
              </div>
              <div class="item-content">
                <h4 class="item-name">{{ item.name }}</h4>
                <div class="item-footer">
                  <span class="item-price">{{ item.price }} ريال</span>
                  <button class="add-btn" (click)="addToCart(item)">
                    <span>أطلب +</span>
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
export class CategoryDialogComponent implements OnInit {
  categories$!: Observable<Category[]>;
  menuItems$!: Observable<MenuItem[]>;
  filteredMenuItems$!: Observable<MenuItem[]>;
  selectedCategory: Category | null = null;

  constructor(
    private dialogRef: MatDialogRef<CategoryDialogComponent>,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadMenuItems();
  }

  loadCategories(): void {
    // Static mock data - same as menu component
    this.categories$ = of([
      {
        id: '1',
        name: 'الخضار',
        nameEn: 'Vegetables',
        description: 'أطباق الخضار الطازجة',
        imageUrl: 'assets/itmes/الخضار.png',
        displayOrder: 1,
        isActive: true
      },
      {
        id: '2',
        name: 'الساندوشات',
        nameEn: 'Sandwiches',
        description: 'ساندوتشات لذيذة',
        imageUrl: 'assets/itmes/الساندوشات.png',
        displayOrder: 2,
        isActive: true
      },
      {
        id: '3',
        name: 'الباستا',
        nameEn: 'Pasta',
        description: 'أطباق الباستا المميزة',
        imageUrl: 'assets/itmes/الباستا.png',
        displayOrder: 3,
        isActive: true
      },
      {
        id: '4',
        name: 'المقبلات',
        nameEn: 'Appetizers',
        description: 'ابدأ وجبتك مع مقبلاتنا اللذيذة',
        imageUrl: 'assets/itmes/المقبلات.png',
        displayOrder: 4,
        isActive: true
      },
      {
        id: '5',
        name: 'الفطار',
        nameEn: 'Breakfast',
        description: 'وجبات الفطور اللذيذة',
        imageUrl: 'assets/itmes/الفطار.png',
        displayOrder: 5,
        isActive: true
      },
      {
        id: '6',
        name: 'الحلويات',
        nameEn: 'Desserts',
        description: 'حلويات لذيذة',
        imageUrl: 'assets/itmes/الحلويات.png',
        displayOrder: 6,
        isActive: true
      },
      {
        id: '7',
        name: 'الصواني',
        nameEn: 'Trays',
        description: 'صواني لذيذة',
        imageUrl: 'assets/itmes/الصوانى.png',
        displayOrder: 7,
        isActive: true
      },
      {
        id: '8',
        name: 'الأطباق الرئيسة',
        nameEn: 'Main Dishes',
        description: 'أطباق رئيسية',
        imageUrl: 'assets/itmes/الأطباق الرئيسة.png',
        displayOrder: 8,
        isActive: true
      },
      {
        id: '9',
        name: 'المشاوي',
        nameEn: 'Grills',
        description: 'مشاوي مشكلة',
        imageUrl: 'assets/itmes/المشاوى.png',
        displayOrder: 9,
        isActive: true
      },
      {
        id: '10',
        name: 'الشوربة',
        nameEn: 'Soup',
        description: 'شوربات ساخنة',
        imageUrl: 'assets/itmes/الشوربةز.png',
        displayOrder: 10,
        isActive: true
      }
    ]);
  }

  loadMenuItems(): void {
    // Static mock data - same structure as menu component
    this.menuItems$ = of([
      {
        id: '1',
        name: 'ورق عنب',
        description: 'ورق عنب محشي',
        price: 25,
        imageUrl: 'assets/1.png',
        categoryId: '1',
        isAvailable: true
      },
      {
        id: '2',
        name: 'سلطة خضار',
        description: 'سلطة خضار طازجة',
        price: 15,
        imageUrl: 'assets/1.png',
        categoryId: '1',
        isAvailable: true
      },
      {
        id: '3',
        name: 'ساندوتش فلافل',
        description: 'ساندوتش فلافل لذيذ',
        price: 10,
        imageUrl: 'assets/1.png',
        categoryId: '2',
        isAvailable: true
      },
      {
        id: '4',
        name: 'باستا كاربونارا',
        description: 'باستا كاربونارا إيطالية',
        price: 35,
        imageUrl: 'assets/1.png',
        categoryId: '3',
        isAvailable: true
      },
      {
        id: '5',
        name: 'حمص',
        description: 'حمص لبناني',
        price: 12,
        imageUrl: 'assets/1.png',
        categoryId: '4',
        isAvailable: true
      },
      {
        id: '6',
        name: 'فول',
        description: 'فول مصري',
        price: 8,
        imageUrl: 'assets/1.png',
        categoryId: '5',
        isAvailable: true
      }
    ]);
  }

  selectCategory(category: Category): void {
    this.selectedCategory = category;
    this.filteredMenuItems$ = this.menuItems$.pipe(
      map(items => items.filter(item => item.categoryId === category.id))
    );
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
}

