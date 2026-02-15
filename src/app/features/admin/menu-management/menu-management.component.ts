import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SharedModule } from '../../../shared/shared.module';
import { Category, MenuItem } from '../../../models/menu-item.model';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-menu-management',
  standalone: true,
  imports: [CommonModule, SharedModule, TranslateModule],
  template: `
    <div class="container-fluid">
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <h1 class="mb-0">{{ 'ADMIN.MENU_MANAGEMENT.TITLE' | translate }}</h1>
        <div class="d-flex gap-2 flex-wrap">
          <button mat-raised-button color="primary" (click)="openCategoryDialog()" class="btn-sm">
            <mat-icon>add</mat-icon> {{ 'ADMIN.MENU_MANAGEMENT.ADD_CATEGORY' | translate }}
          </button>
          <button mat-raised-button color="primary" (click)="openMenuItemDialog()" class="btn-sm">
            <mat-icon>add</mat-icon> {{ 'ADMIN.MENU_MANAGEMENT.ADD_MENU_ITEM' | translate }}
          </button>
        </div>
      </div>

      <mat-tab-group>
        <mat-tab [label]="'ADMIN.MENU_MANAGEMENT.CATEGORIES' | translate">
          <div class="tab-content">
            <div class="table-responsive">
              <table mat-table [dataSource]="(categories$ | async) || []" class="categories-table w-100">
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef>{{ 'ADMIN.MENU_MANAGEMENT.NAME' | translate }}</th>
                <td mat-cell *matCellDef="let category">{{ category.name }}</td>
              </ng-container>
              
              <ng-container matColumnDef="description">
                <th mat-header-cell *matHeaderCellDef>{{ 'ADMIN.MENU_MANAGEMENT.DESCRIPTION' | translate }}</th>
                <td mat-cell *matCellDef="let category">{{ category.description || '-' }}</td>
              </ng-container>
              
              <ng-container matColumnDef="displayOrder">
                <th mat-header-cell *matHeaderCellDef>{{ 'ADMIN.MENU_MANAGEMENT.ORDER' | translate }}</th>
                <td mat-cell *matCellDef="let category">{{ category.displayOrder }}</td>
              </ng-container>
              
              <ng-container matColumnDef="isActive">
                <th mat-header-cell *matHeaderCellDef>{{ 'ADMIN.MENU_MANAGEMENT.ACTIVE' | translate }}</th>
                <td mat-cell *matCellDef="let category">
                  <mat-checkbox [checked]="category.isActive" (change)="toggleCategory(category)"></mat-checkbox>
                </td>
              </ng-container>
              
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>{{ 'ADMIN.MENU_MANAGEMENT.ACTIONS' | translate }}</th>
                <td mat-cell *matCellDef="let category">
                  <button mat-icon-button (click)="editCategory(category)">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="deleteCategory(category.id)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="categoryColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: categoryColumns"></tr>
            </table>
            </div>
          </div>
        </mat-tab>

        <mat-tab [label]="'ADMIN.MENU_MANAGEMENT.MENU_ITEMS' | translate">
          <div class="tab-content">
            <div class="table-responsive">
              <table mat-table [dataSource]="(menuItems$ | async) || []" class="menu-items-table w-100">
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef>{{ 'ADMIN.MENU_MANAGEMENT.NAME' | translate }}</th>
                <td mat-cell *matCellDef="let item">
                  <img [src]="item.imageUrl" [alt]="item.name" class="item-thumbnail" />
                  {{ item.name }}
                </td>
              </ng-container>
              
              <ng-container matColumnDef="category">
                <th mat-header-cell *matHeaderCellDef>{{ 'ADMIN.MENU_MANAGEMENT.CATEGORY' | translate }}</th>
                <td mat-cell *matCellDef="let item">{{ getCategoryName(item.categoryId) }}</td>
              </ng-container>
              
              <ng-container matColumnDef="price">
                <th mat-header-cell *matHeaderCellDef>{{ 'ADMIN.MENU_MANAGEMENT.PRICE' | translate }}</th>
                <td mat-cell *matCellDef="let item">{{ item.price | currency }}</td>
              </ng-container>
              
              <ng-container matColumnDef="isAvailable">
                <th mat-header-cell *matHeaderCellDef>{{ 'ADMIN.MENU_MANAGEMENT.AVAILABLE' | translate }}</th>
                <td mat-cell *matCellDef="let item">
                  <mat-checkbox [checked]="item.isAvailable" (change)="toggleMenuItem(item)"></mat-checkbox>
                </td>
              </ng-container>
              
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>{{ 'ADMIN.MENU_MANAGEMENT.ACTIONS' | translate }}</th>
                <td mat-cell *matCellDef="let item">
                  <button mat-icon-button (click)="editMenuItem(item)">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button (click)="uploadImage(item)">
                    <mat-icon>image</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="deleteMenuItem(item.id)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="menuItemColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: menuItemColumns"></tr>
            </table>
            </div>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .item-thumbnail {
      width: 50px;
      height: 50px;
      object-fit: cover;
      border-radius: 4px;
      margin-right: 1rem;
    }
  `]
})
export class MenuManagementComponent implements OnInit {
  categories$!: Observable<Category[]>;
  menuItems$!: Observable<MenuItem[]>;
  categoryColumns = ['name', 'description', 'displayOrder', 'isActive', 'actions'];
  menuItemColumns = ['name', 'category', 'price', 'isAvailable', 'actions'];

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadMenuItems();
  }

  loadCategories(): void {
    // Static mock data until backend is ready
    this.categories$ = of([
      {
        id: '1',
        name: 'Appetizers',
        description: 'Start your meal with our delicious appetizers',
        displayOrder: 1,
        isActive: true
      },
      {
        id: '2',
        name: 'Main Courses',
        description: 'Our signature main dishes',
        displayOrder: 2,
        isActive: true
      },
      {
        id: '3',
        name: 'Desserts',
        description: 'Sweet endings to your meal',
        displayOrder: 3,
        isActive: true
      },
      {
        id: '4',
        name: 'Beverages',
        description: 'Refreshing drinks',
        displayOrder: 4,
        isActive: true
      }
    ]);
  }

  loadMenuItems(): void {
    // Static mock data until backend is ready
    this.menuItems$ = of([
      {
        id: '1',
        name: 'Caesar Salad',
        description: 'Fresh romaine lettuce with Caesar dressing',
        price: 12.99,
        imageUrl: 'https://via.placeholder.com/300',
        categoryId: '1',
        isAvailable: true
      },
      {
        id: '2',
        name: 'Grilled Chicken',
        description: 'Tender grilled chicken breast with vegetables',
        price: 18.99,
        imageUrl: 'https://via.placeholder.com/300',
        categoryId: '2',
        isAvailable: true
      },
      {
        id: '3',
        name: 'Chocolate Cake',
        description: 'Rich chocolate cake with vanilla ice cream',
        price: 8.99,
        imageUrl: 'https://via.placeholder.com/300',
        categoryId: '3',
        isAvailable: true
      }
    ]);
  }

  getCategoryName(categoryId: string): string {
    // This would be implemented to get category name from the categories list
    return categoryId;
  }

  openCategoryDialog(): void {
    // Implement dialog for adding/editing category
    this.translate.get(['ADMIN.MENU_MANAGEMENT.CATEGORY_DIALOG', 'COMMON.CLOSE']).subscribe(translations => {
      this.snackBar.open(translations['ADMIN.MENU_MANAGEMENT.CATEGORY_DIALOG'], translations['COMMON.CLOSE'], { duration: 2000 });
    });
  }

  openMenuItemDialog(): void {
    // Implement dialog for adding/editing menu item
    this.translate.get(['ADMIN.MENU_MANAGEMENT.MENU_ITEM_DIALOG', 'COMMON.CLOSE']).subscribe(translations => {
      this.snackBar.open(translations['ADMIN.MENU_MANAGEMENT.MENU_ITEM_DIALOG'], translations['COMMON.CLOSE'], { duration: 2000 });
    });
  }

  editCategory(category: Category): void {
    // Implement edit category
    this.translate.get(['ADMIN.MENU_MANAGEMENT.EDIT_CATEGORY', 'COMMON.CLOSE']).subscribe(translations => {
      this.snackBar.open(translations['ADMIN.MENU_MANAGEMENT.EDIT_CATEGORY'], translations['COMMON.CLOSE'], { duration: 2000 });
    });
  }

  editMenuItem(item: MenuItem): void {
    // Implement edit menu item
    this.translate.get(['ADMIN.MENU_MANAGEMENT.EDIT_MENU_ITEM', 'COMMON.CLOSE']).subscribe(translations => {
      this.snackBar.open(translations['ADMIN.MENU_MANAGEMENT.EDIT_MENU_ITEM'], translations['COMMON.CLOSE'], { duration: 2000 });
    });
  }

  toggleCategory(category: Category): void {
    // Static mock - update local data
    this.categories$ = this.categories$.pipe(
      map(categories => categories.map(cat => 
        cat.id === category.id ? { ...cat, isActive: !cat.isActive } : cat
      ))
    );
    this.translate.get(['ADMIN.MENU_MANAGEMENT.CATEGORY_STATUS_UPDATED', 'COMMON.CLOSE']).subscribe(translations => {
      this.snackBar.open(translations['ADMIN.MENU_MANAGEMENT.CATEGORY_STATUS_UPDATED'], translations['COMMON.CLOSE'], { duration: 2000 });
    });
  }

  toggleMenuItem(item: MenuItem): void {
    // Static mock - update local data
    this.menuItems$ = this.menuItems$.pipe(
      map(items => items.map(menuItem => 
        menuItem.id === item.id ? { ...menuItem, isAvailable: !menuItem.isAvailable } : menuItem
      ))
    );
    this.translate.get(['ADMIN.MENU_MANAGEMENT.MENU_ITEM_STATUS_UPDATED', 'COMMON.CLOSE']).subscribe(translations => {
      this.snackBar.open(translations['ADMIN.MENU_MANAGEMENT.MENU_ITEM_STATUS_UPDATED'], translations['COMMON.CLOSE'], { duration: 2000 });
    });
  }

  uploadImage(item: MenuItem): void {
    // Implement image upload
    this.translate.get(['ADMIN.MENU_MANAGEMENT.IMAGE_UPLOAD', 'COMMON.CLOSE']).subscribe(translations => {
      this.snackBar.open(translations['ADMIN.MENU_MANAGEMENT.IMAGE_UPLOAD'], translations['COMMON.CLOSE'], { duration: 2000 });
    });
  }

  deleteCategory(id: string): void {
    this.translate.get(['ADMIN.MENU_MANAGEMENT.CATEGORY_DELETE_CONFIRM', 'COMMON.CLOSE']).subscribe(translations => {
      if (confirm(translations['ADMIN.MENU_MANAGEMENT.CATEGORY_DELETE_CONFIRM'])) {
        // Static mock - filter out deleted category
        this.categories$ = this.categories$.pipe(
          map(categories => categories.filter(cat => cat.id !== id))
        );
        this.translate.get(['ADMIN.MENU_MANAGEMENT.CATEGORY_DELETED', 'COMMON.CLOSE']).subscribe(deleteTranslations => {
          this.snackBar.open(deleteTranslations['ADMIN.MENU_MANAGEMENT.CATEGORY_DELETED'], deleteTranslations['COMMON.CLOSE'], { duration: 2000 });
        });
      }
    });
  }

  deleteMenuItem(id: string): void {
    this.translate.get(['ADMIN.MENU_MANAGEMENT.MENU_ITEM_DELETE_CONFIRM', 'COMMON.CLOSE']).subscribe(translations => {
      if (confirm(translations['ADMIN.MENU_MANAGEMENT.MENU_ITEM_DELETE_CONFIRM'])) {
        // Static mock - filter out deleted item
        this.menuItems$ = this.menuItems$.pipe(
          map(items => items.filter(item => item.id !== id))
        );
        this.translate.get(['ADMIN.MENU_MANAGEMENT.MENU_ITEM_DELETED', 'COMMON.CLOSE']).subscribe(deleteTranslations => {
          this.snackBar.open(deleteTranslations['ADMIN.MENU_MANAGEMENT.MENU_ITEM_DELETED'], deleteTranslations['COMMON.CLOSE'], { duration: 2000 });
        });
      }
    });
  }
}

