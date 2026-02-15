import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, ViewportScroller } from '@angular/common';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../../shared/shared.module';
import { Category, MenuItem } from '../../../models/menu-item.model';
import { Router, ActivatedRoute } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { TranslationService } from '../../../core/services/translation.service';
import { addLanguageProperty, getDisplayName, getDisplayDescription } from '../../../core/utils/item-translation.util';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, SharedModule, TranslateModule],
  template: `
    <div class="container-fluid px-0">
      <!-- Breadcrumb Navigation -->
      <div class="breadcrumb-container">
        <nav class="breadcrumb-nav">
          <a routerLink="/">الرئسية</a>
          <span> > </span>
          <span>الاصناف</span>
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

              <div class="items-content" #itemsContent>
                <h2 class="items-title" *ngIf="selectedCategoryName">{{ selectedCategoryName }}</h2>
                <h2 class="items-title" *ngIf="!selectedCategoryName">الاصناف</h2>
                
                <div class="items-grid" *ngIf="menuItems$ | async as items">
                  <div class="item-card" *ngFor="let item of items">
                    <div class="item-image-wrapper">
                      <img [src]="item.imageUrl" [alt]="item.name" class="item-image" />
                    </div>
                    <div class="item-content">
                      <h4 class="item-name">{{ item.isArabicLang ? item.name : (item.nameEn || item.name) }}</h4>
                      <div class="item-rating">
                        <span class="stars">★★★★★</span>
                      </div>
                      <div class="item-footer">
                        <span class="item-price">{{ item.price }} ريال</span>
                        <button class="order-button" (click)="addToCart(item, $event)">
                          أطلب +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Pagination -->
                <div class="pagination-wrapper" *ngIf="(menuItems$ | async)?.length">
                  <div class="pagination">
                    <button class="page-btn" [class.active]="currentPage === 1" (click)="goToPage(1)">1</button>
                    <button class="page-btn" [class.active]="currentPage === 2" (click)="goToPage(2)">2</button>
                    <button class="page-btn" [class.active]="currentPage === 3" (click)="goToPage(3)">3</button>
                    <button class="page-btn next-btn" (click)="goToPage(currentPage + 1)">>></button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Sidebar Navigation -->
            <div class="col-12 col-md-3 sidebar-wrapper">
              <div class="sidebar-content">
                <h3 class="sidebar-title">الاصناف</h3>
                <ul class="category-list">
                  <li 
                    *ngFor="let category of categories$ | async"
                    [class.active]="selectedCategoryName === category.name"
                    (click)="selectCategoryByName(category.name)">
                    <span class="category-name-wrapper">
                      <span class="category-arrow" *ngIf="selectedCategoryName === category.name">◀</span>
                      <span class="category-name">{{ category.isArabicLang ? category.name : (category.nameEn || category.name) }}</span>
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
      height: 837.4270629882812px;
      opacity: 1;
      gap: 10px;
      border-radius: 15px;
      border: 0.5px solid #F00E0C;
      padding-top: 28px;
      padding-right: 16px;
      padding-bottom: 28px;
      padding-left: 16px;
      background: #FFFFFF;
    }
    .sidebar-content {
      direction: rtl;
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
    }
    .category-list li {
      width: 100%;
      height: 48px;
      // transform: rotate(-180deg);
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
    // .category-list li.active .category-name::after {
    //   content: '';
    //   position: absolute;
    //   bottom: -2px;
    //   right: -4px;
    //   left: -4px;
    //   height: 2px;
    //   background-color: #FDC040;
    // }
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
      // margin-bottom: 2rem;
      padding-bottom: 0.5rem;
      // border-bottom: 3px solid #FDC55E;
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
    @media (max-width: 768px) {
      .items-grid {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1rem;
      }
      .sidebar-wrapper {
        padding-top: 2rem;
      }
      .items-wrapper {
        padding-top: 2rem;
      }
      .menu-banner-section {
        height: 250px;
        margin-bottom: 1.5rem;
      }
      .banner-overlay {
        padding-right: 1rem;
      }
      .banner-discount {
        font-size: 1.8rem;
      }
      .banner-text {
        font-size: 1rem;
      }
    }
  `]
})
export class MenuComponent implements OnInit {
  @ViewChild('itemsContent', { static: false }) itemsContent!: ElementRef;
  categories$!: Observable<Category[]>;
  menuItems$!: Observable<MenuItem[]>;
  selectedCategoryId: string | null = null;
  selectedCategoryName: string | null = null;
  allMenuItems: MenuItem[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 12;

  // Mapping Arabic category names to IDs
  private categoryNameToIdMap: { [key: string]: string } = {
    'الخضار': '1',
    'الساندوشات': '2',
    'الباستا': '3',
    'المقبلات': '4',
    'الفطار': '5',
    'الحلويات': '6',
    'الصواني': '7',
    'الأطباق الرئيسة': '8',
    'المشاوي': '9',
    'الشوربة': '10'
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cartService: CartService,
    private translationService: TranslationService,
    private viewportScroller: ViewportScroller
  ) { }

  ngOnInit(): void {
    // Static mock data until backend is ready
    const categories: Category[] = [
      {
        id: '5',
        name: 'الفطار',
        nameEn: 'Breakfast',
        description: 'وجبات الفطور اللذيذة',
        descriptionEn: 'Delicious breakfast meals',
        displayOrder: 1,
        isActive: true
      },
      {
        id: '4',
        name: 'المقبلات',
        nameEn: 'Appetizers',
        description: 'ابدأ وجبتك مع مقبلاتنا اللذيذة',
        descriptionEn: 'Start your meal with our delicious appetizers',
        displayOrder: 2,
        isActive: true
      },
      {
        id: '3',
        name: 'الباستا',
        nameEn: 'Pasta',
        description: 'أطباق الباستا المميزة',
        descriptionEn: 'Signature pasta dishes',
        displayOrder: 3,
        isActive: true
      },
      {
        id: '2',
        name: 'الساندوشات',
        nameEn: 'Sandwiches',
        description: 'ساندوتشات لذيذة',
        descriptionEn: 'Delicious sandwiches',
        displayOrder: 4,
        isActive: true
      },
      {
        id: '1',
        name: 'الخضار',
        nameEn: 'Vegetables',
        description: 'أطباق الخضار الطازجة',
        descriptionEn: 'Fresh vegetable dishes',
        displayOrder: 5,
        isActive: true
      },
      {
        id: '10',
        name: 'الشوربة',
        nameEn: 'Soup',
        description: 'شوربات ساخنة',
        descriptionEn: 'Hot soups',
        displayOrder: 6,
        isActive: true
      },
      {
        id: '9',
        name: 'المشاوي',
        nameEn: 'Grills',
        description: 'مشاوي مشكلة',
        descriptionEn: 'Mixed grills',
        displayOrder: 7,
        isActive: true
      },
      {
        id: '8',
        name: 'الأطباق الرئيسة',
        nameEn: 'Main Dishes',
        description: 'أطباقنا الرئيسية المميزة',
        descriptionEn: 'Our signature main dishes',
        displayOrder: 8,
        isActive: true
      },
      {
        id: '7',
        name: 'الصواني',
        nameEn: 'Trays',
        description: 'صواني مميزة',
        descriptionEn: 'Special trays',
        displayOrder: 9,
        isActive: true
      },
      {
        id: '11',
        name: 'المشروبات',
        nameEn: 'Beverages',
        description: 'مشروبات منعشة',
        descriptionEn: 'Refreshing drinks',
        displayOrder: 10,
        isActive: true
      },
      {
        id: '6',
        name: 'الحلويات',
        nameEn: 'Desserts',
        description: 'نهاية حلوة لوجبتك',
        descriptionEn: 'Sweet endings to your meal',
        displayOrder: 11,
        isActive: true
      }
    ];
    this.categories$ = of(addLanguageProperty(categories, this.translationService));

    // Check for category query parameter
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        const categoryName = params['category'];
        this.selectCategoryByName(categoryName);
      } else {
        this.loadMenuItems();
      }
    });

    this.allMenuItems = [
      {
        id: '1',
        name: 'سلطة قيصر',
        nameEn: 'Caesar Salad',
        description: 'خس روماني طازج مع صلصة قيصر',
        descriptionEn: 'Fresh romaine lettuce with Caesar dressing',
        price: 12.99,
        imageUrl: 'https://via.placeholder.com/300',
        categoryId: '1',
        isAvailable: true
      },
      {
        id: '2',
        name: 'دجاج مشوي',
        nameEn: 'Grilled Chicken',
        description: 'صدر دجاج مشوي طري مع خضار',
        descriptionEn: 'Tender grilled chicken breast with vegetables',
        price: 18.99,
        imageUrl: 'https://via.placeholder.com/300',
        categoryId: '2',
        isAvailable: true
      },
      {
        id: '3',
        name: 'كيك الشوكولاتة',
        nameEn: 'Chocolate Cake',
        description: 'كيك شوكولاتة غني مع آيس كريم الفانيليا',
        descriptionEn: 'Rich chocolate cake with vanilla ice cream',
        price: 8.99,
        imageUrl: 'https://via.placeholder.com/300',
        categoryId: '3',
        isAvailable: true
      },
      {
        id: '4',
        name: 'بطاطس مقلية',
        nameEn: 'French Fries',
        description: 'بطاطس مقلية مقرمشة ذهبية',
        descriptionEn: 'Crispy golden fries',
        price: 6.99,
        imageUrl: 'https://via.placeholder.com/300',
        categoryId: '1',
        isAvailable: true
      },
      {
        id: '5',
        name: 'ستيك لحم',
        nameEn: 'Beef Steak',
        description: 'ستيك لحم عصير مع بطاطس مهروسة',
        descriptionEn: 'Juicy beef steak with mashed potatoes',
        price: 24.99,
        imageUrl: 'https://via.placeholder.com/300',
        categoryId: '2',
        isAvailable: true
      },
      {
        id: '6',
        name: 'آيس كريم',
        nameEn: 'Ice Cream',
        description: 'آيس كريم فانيليا مع صلصة الشوكولاتة',
        descriptionEn: 'Vanilla ice cream with chocolate sauce',
        price: 7.99,
        imageUrl: 'https://via.placeholder.com/300',
        categoryId: '3',
        isAvailable: true
      },
      // Adding many items to الفطار category (categoryId: '5') to show pagination
      {
        id: '7',
        name: 'ساندوتش فلافل رويال ميكس',
        nameEn: 'Falafel Royal Mix Sandwich',
        description: 'ساندوتش فلافل رويال ميكس لذيذ',
        descriptionEn: 'Delicious falafel royal mix sandwich',
        price: 82,
        imageUrl: 'https://via.placeholder.com/300',
        categoryId: '5',
        isAvailable: true
      },
      {
        id: '8',
        name: 'ساندوتش فلافل محشية',
        nameEn: 'Stuffed Falafel Sandwich',
        description: 'ساندوتش فلافل محشية',
        descriptionEn: 'Stuffed falafel sandwich',
        price: 82,
        imageUrl: 'https://via.placeholder.com/300',
        categoryId: '5',
        isAvailable: true
      },
      {
        id: '9',
        name: 'ساندوتش فلافل',
        nameEn: 'Falafel Sandwich',
        description: 'ساندوتش فلافل تقليدي',
        descriptionEn: 'Traditional falafel sandwich',
        price: 82,
        imageUrl: 'https://via.placeholder.com/300',
        categoryId: '5',
        isAvailable: true
      },
      {
        id: '10',
        name: 'ساندوتش بيض مسلوق',
        nameEn: 'Boiled Egg Sandwich',
        description: 'ساندوتش بيض مسلوق',
        descriptionEn: 'Boiled egg sandwich',
        price: 82,
        imageUrl: 'https://via.placeholder.com/300',
        categoryId: '5',
        isAvailable: true
      },
      {
        id: '11',
        name: 'ساندوتش فول اسكندراني',
        nameEn: 'Alexandrian Foul Sandwich',
        description: 'ساندوتش فول اسكندراني',
        descriptionEn: 'Alexandrian foul sandwich',
        price: 82,
        imageUrl: 'https://via.placeholder.com/300',
        categoryId: '5',
        isAvailable: true
      },
      {
        id: '12',
        name: 'ساندوتش فول بالبيض',
        nameEn: 'Foul with Egg Sandwich',
        description: 'ساندوتش فول بالبيض',
        descriptionEn: 'Foul with egg sandwich',
        price: 82,
        imageUrl: 'https://via.placeholder.com/300',
        categoryId: '5',
        isAvailable: true
      },
      {
        id: '13',
        name: 'ساندوتش فول',
        nameEn: 'Foul Sandwich',
        description: 'ساندوتش فول',
        descriptionEn: 'Foul sandwich',
        price: 82,
        imageUrl: 'https://via.placeholder.com/300',
        categoryId: '5',
        isAvailable: true
      },
      {
        id: '14',
        name: 'ساندوتش جبنة بيضاء',
        nameEn: 'White Cheese Sandwich',
        description: 'ساندوتش جبنة بيضاء',
        descriptionEn: 'White cheese sandwich',
        price: 82,
        imageUrl: 'https://via.placeholder.com/300',
        categoryId: '5',
        isAvailable: true
      },
      {
        id: '15',
        name: 'ساندوتش جبنة صفراء',
        nameEn: 'Yellow Cheese Sandwich',
        description: 'ساندوتش جبنة صفراء',
        descriptionEn: 'Yellow cheese sandwich',
        price: 82,
        imageUrl: 'https://via.placeholder.com/300',
        categoryId: '5',
        isAvailable: true
      },
      {
        id: '16',
        name: 'ساندوتش زعتر وزيت',
        nameEn: 'Zaatar and Oil Sandwich',
        description: 'ساندوتش زعتر وزيت',
        descriptionEn: 'Zaatar and oil sandwich',
        price: 82,
        imageUrl: 'https://via.placeholder.com/300',
        categoryId: '5',
        isAvailable: true
      },
      {
        id: '17',
        name: 'ساندوتش لبنة',
        nameEn: 'Labneh Sandwich',
        description: 'ساندوتش لبنة',
        descriptionEn: 'Labneh sandwich',
        price: 82,
        imageUrl: 'https://via.placeholder.com/300',
        categoryId: '5',
        isAvailable: true
      },
      {
        id: '18',
        name: 'ساندوتش طماطم',
        nameEn: 'Tomato Sandwich',
        description: 'ساندوتش طماطم',
        descriptionEn: 'Tomato sandwich',
        price: 82,
        imageUrl: 'https://via.placeholder.com/300',
        categoryId: '5',
        isAvailable: true
      },
      {
        id: '19',
        name: 'ساندوتش خيار',
        nameEn: 'Cucumber Sandwich',
        description: 'ساندوتش خيار',
        descriptionEn: 'Cucumber sandwich',
        price: 82,
        imageUrl: 'https://via.placeholder.com/300',
        categoryId: '5',
        isAvailable: true
      },
      {
        id: '20',
        name: 'ساندوتش بيض مقلي',
        nameEn: 'Fried Egg Sandwich',
        description: 'ساندوتش بيض مقلي',
        descriptionEn: 'Fried egg sandwich',
        price: 82,
        imageUrl: 'https://via.placeholder.com/300',
        categoryId: '5',
        isAvailable: true
      },
      {
        id: '21',
        name: 'ساندوتش بيض عيون',
        nameEn: 'Sunny Side Up Egg Sandwich',
        description: 'ساندوتش بيض عيون',
        descriptionEn: 'Sunny side up egg sandwich',
        price: 82,
        imageUrl: 'https://via.placeholder.com/300',
        categoryId: '5',
        isAvailable: true
      },
      {
        id: '22',
        name: 'ساندوتش بيض أومليت',
        nameEn: 'Omelet Sandwich',
        description: 'ساندوتش بيض أومليت',
        descriptionEn: 'Omelet sandwich',
        price: 82,
        imageUrl: 'https://via.placeholder.com/300',
        categoryId: '5',
        isAvailable: true
      },
      {
        id: '23',
        name: 'ساندوتش لحم مفروم',
        nameEn: 'Minced Meat Sandwich',
        description: 'ساندوتش لحم مفروم',
        descriptionEn: 'Minced meat sandwich',
        price: 82,
        imageUrl: 'https://via.placeholder.com/300',
        categoryId: '5',
        isAvailable: true
      },
      {
        id: '24',
        name: 'ساندوتش كبدة',
        nameEn: 'Liver Sandwich',
        description: 'ساندوتش كبدة',
        descriptionEn: 'Liver sandwich',
        price: 82,
        imageUrl: 'https://via.placeholder.com/300',
        categoryId: '5',
        isAvailable: true
      },
      {
        id: '25',
        name: 'ساندوتش سجق',
        nameEn: 'Sausage Sandwich',
        description: 'ساندوتش سجق',
        descriptionEn: 'Sausage sandwich',
        price: 82,
        imageUrl: 'https://via.placeholder.com/300',
        categoryId: '5',
        isAvailable: true
      },
      {
        id: '26',
        name: 'ساندوتش بسطرمة',
        nameEn: 'Pastrami Sandwich',
        description: 'ساندوتش بسطرمة',
        descriptionEn: 'Pastrami sandwich',
        price: 82,
        imageUrl: 'https://via.placeholder.com/300',
        categoryId: '5',
        isAvailable: true
      },
      {
        id: '27',
        name: 'ساندوتش مرتديلا',
        nameEn: 'Mortadella Sandwich',
        description: 'ساندوتش مرتديلا',
        descriptionEn: 'Mortadella sandwich',
        price: 82,
        imageUrl: 'https://via.placeholder.com/300',
        categoryId: '5',
        isAvailable: true
      },
      {
        id: '28',
        name: 'ساندوتش تونة',
        nameEn: 'Tuna Sandwich',
        description: 'ساندوتش تونة',
        descriptionEn: 'Tuna sandwich',
        price: 82,
        imageUrl: 'https://via.placeholder.com/300',
        categoryId: '5',
        isAvailable: true
      },
      {
        id: '29',
        name: 'ساندوتش جبنة قريش',
        nameEn: 'Cottage Cheese Sandwich',
        description: 'ساندوتش جبنة قريش',
        descriptionEn: 'Cottage cheese sandwich',
        price: 82,
        imageUrl: 'https://via.placeholder.com/300',
        categoryId: '5',
        isAvailable: true
      },
      {
        id: '30',
        name: 'ساندوتش جبنة نابلسية',
        nameEn: 'Nabulsi Cheese Sandwich',
        description: 'ساندوتش جبنة نابلسية',
        descriptionEn: 'Nabulsi cheese sandwich',
        price: 82,
        imageUrl: 'https://via.placeholder.com/300',
        categoryId: '5',
        isAvailable: true
      },
      {
        id: '31',
        name: 'ساندوتش جبنة شيدر',
        nameEn: 'Cheddar Cheese Sandwich',
        description: 'ساندوتش جبنة شيدر',
        descriptionEn: 'Cheddar cheese sandwich',
        price: 82,
        imageUrl: 'https://via.placeholder.com/300',
        categoryId: '5',
        isAvailable: true
      },
      {
        id: '32',
        name: 'ساندوتش جبنة موتزاريلا',
        nameEn: 'Mozzarella Cheese Sandwich',
        description: 'ساندوتش جبنة موتزاريلا',
        descriptionEn: 'Mozzarella cheese sandwich',
        price: 82,
        imageUrl: 'https://via.placeholder.com/300',
        categoryId: '5',
        isAvailable: true
      }
    ];

    this.loadMenuItems();
  }

  selectCategory(categoryId: string): void {
    this.selectedCategoryId = categoryId;
    this.currentPage = 1;
    this.loadMenuItems();
  }

  selectCategoryByName(categoryName: string): void {
    this.selectedCategoryName = categoryName;
    const categoryId = this.categoryNameToIdMap[categoryName];
    if (categoryId) {
      this.selectedCategoryId = categoryId;
      this.currentPage = 1;
      this.loadMenuItems();
      // Update URL without reloading
      this.router.navigate(['/menu'], { queryParams: { category: categoryName } });
    }
  }

  loadMenuItems(): void {
    let items: MenuItem[];
    if (this.selectedCategoryId) {
      items = this.allMenuItems.filter(item => item.categoryId === this.selectedCategoryId);
    } else {
      items = this.allMenuItems;
    }

    // Pagination
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    items = items.slice(startIndex, endIndex);

    // Add isArabicLang property to items
    this.menuItems$ = of(addLanguageProperty(items, this.translationService));
  }

  getCategoryItemCount(categoryId: string): number {
    return this.allMenuItems.filter(item => item.categoryId === categoryId).length;
  }

  goToPage(page: number): void {
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

  addToCart(item: MenuItem, event: Event): void {
    event.stopPropagation();
    this.cartService.addItem(item, 1);
    this.router.navigate(['/cart']);
  }
}

