import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SharedModule } from '../../../shared/shared.module';
import { Category, MenuItem } from '../../../models/menu-item.model';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CategoryService } from '../../../core/services/category.service';
import { PagedResponse } from '../../../models/api-response.model';
import { Category as BackendCategory } from '../../../models/category.model';
import { AddCategoryDialogComponent } from './add-category-dialog.component';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-menu-management',
  standalone: true,
  imports: [CommonModule, SharedModule, TranslateModule, MatSlideToggleModule, MatPaginatorModule],
  template: `
    <div class="categories-container">
      <!-- Header Section -->
      <div class="header-section">
        <h1 class="page-title">الأصناف</h1>
        <div class="date-range">1 يناير 2026 - 30 يناير 2026</div>
      </div>

      <!-- Summary Cards -->
      <div class="summary-cards">
        <div class="summary-card">
          <div class="card-content">
            <div class="card-value">11</div>
            <div class="card-label">إجمالي الأصناف</div>
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
        <button class="add-category-btn" (click)="openCategoryDialog()">
          <div class="btn-text-container">
            <span class="btn-text">اضافة صنف</span>
            <svg class="plus-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <img src="assets/BkMenu.png" alt="Menu" class="btn-image" />
        </button>
      </div>

      <!-- Category Grid -->
      <div class="category-grid">
        <div class="category-card" *ngFor="let category of categories$ | async">
          <div class="category-content">
            <div class="category-image-container">
              <img [src]="category.imageUrl || ''" [alt]="category.name" class="category-image" />
            </div>
            <div class="category-header">
              <h3 class="category-name">{{ category.name }}</h3>
              <div class="custom-toggle" (click)="toggleCategory(category)">
                <svg *ngIf="category.isActive" width="44" height="24" viewBox="0 0 44 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_70_1747)">
                    <rect width="44" height="24" rx="12" fill="#F9F9F9"/>
                    <g filter="url(#filter0_dd_70_1747)">
                      <rect x="22" y="2" width="20" height="20" rx="10" fill="#3BB77E"/>
                      <path d="M36.6666 8.5L30.2499 14.9167L27.3333 12" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </g>
                  </g>
                  <rect x="0.5" y="0.5" width="43" height="23" rx="11.5" stroke="#0AAD0A"/>
                  <defs>
                    <filter id="filter0_dd_70_1747_{{category.id}}" x="19" y="0" width="26" height="26" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                      <feOffset dy="1"/>
                      <feGaussianBlur stdDeviation="1"/>
                      <feColorMatrix type="matrix" values="0 0 0 0 0.0627451 0 0 0 0 0.0941176 0 0 0 0 0.156863 0 0 0 0.06 0"/>
                      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_70_1747"/>
                      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                      <feOffset dy="1"/>
                      <feGaussianBlur stdDeviation="1.5"/>
                      <feColorMatrix type="matrix" values="0 0 0 0 0.0627451 0 0 0 0 0.0941176 0 0 0 0 0.156863 0 0 0 0.1 0"/>
                      <feBlend mode="normal" in2="effect1_dropShadow_70_1747" result="effect2_dropShadow_70_1747"/>
                      <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_70_1747" result="shape"/>
                    </filter>
                    <clipPath id="clip0_70_1747_{{category.id}}">
                      <rect width="44" height="24" rx="12" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
                <svg *ngIf="!category.isActive" width="45" height="25" viewBox="0 0 45 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g opacity="0.6">
                    <g [attr.clip-path]="'url(#clip0_399_77131_' + category.id + ')'">
                      <rect x="0.5" y="0.5" width="44" height="24" rx="12" fill="#E7EAEB"/>
                      <g [attr.filter]="'url(#filter0_dd_399_77131_' + category.id + ')'">
                        <g [attr.clip-path]="'url(#clip1_399_77131_' + category.id + ')'">
                          <rect x="2.5" y="2.5" width="20" height="20" rx="10" fill="#BDC6C7"/>
                          <path d="M19.1667 7.5L10 16.6667L5.83337 12.5" stroke="#E7EAEB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </g>
                        <rect x="3" y="3" width="19" height="19" rx="9.5" stroke="#9EACAE"/>
                      </g>
                    </g>
                    <rect x="0.5" y="0.5" width="44" height="24" rx="12" stroke="#617275"/>
                  </g>
                  <defs>
                    <filter [attr.id]="'filter0_dd_399_77131_' + category.id" x="-0.5" y="0.5" width="26" height="26" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                      <feOffset dy="1"/>
                      <feGaussianBlur stdDeviation="1"/>
                      <feColorMatrix type="matrix" values="0 0 0 0 0.0627451 0 0 0 0 0.0941176 0 0 0 0 0.156863 0 0 0 0.06 0"/>
                      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_399_77131"/>
                      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                      <feOffset dy="1"/>
                      <feGaussianBlur stdDeviation="1.5"/>
                      <feColorMatrix type="matrix" values="0 0 0 0 0.0627451 0 0 0 0 0.0941176 0 0 0 0 0.156863 0 0 0 0.1 0"/>
                      <feBlend mode="normal" in2="effect1_dropShadow_399_77131" result="effect2_dropShadow_399_77131"/>
                      <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_399_77131" result="shape"/>
                    </filter>
                    <clipPath [attr.id]="'clip0_399_77131_' + category.id">
                      <rect x="0.5" y="0.5" width="44" height="24" rx="12" fill="white"/>
                    </clipPath>
                    <clipPath [attr.id]="'clip1_399_77131_' + category.id">
                      <rect x="2.5" y="2.5" width="20" height="20" rx="10" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
              </div>
            </div>
            <div class="category-stats">
              <div class="stat-item">
                <span class="stat-label">العدد:</span>
                <span class="stat-value">{{ category.productCount }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">المبيعات:</span>
                <span class="stat-value">{{ category.totalSales | number }} رق</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">عدد الطلبات:</span>
                <span class="stat-value">{{ category.orderCount }}</span>
              </div>
            </div>
          </div>
          <div class="category-actions">
            <div class="action-group">
              <button class="action-btn edit" (click)="editCategory(category)">
                تعديل
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M14.3033 3.61071C14.3666 3.70685 14.3948 3.8219 14.3832 3.93644C14.3715 4.05098 14.3207 4.15798 14.2393 4.23938L8.1106 10.3674C8.0479 10.43 7.96967 10.4749 7.88393 10.4974L5.33126 11.164C5.24688 11.1861 5.15821 11.1856 5.07406 11.1628C4.9899 11.1399 4.91319 11.0954 4.85152 11.0338C4.78986 10.9721 4.7454 10.8954 4.72255 10.8113C4.6997 10.7271 4.69926 10.6384 4.72126 10.554L5.38793 8.00205C5.40786 7.92562 5.44452 7.85458 5.49526 7.79405L11.6466 1.64672C11.7403 1.55308 11.8674 1.50049 11.9999 1.50049C12.1324 1.50049 12.2595 1.55308 12.3533 1.64672L14.2393 3.53205C14.2626 3.55661 14.284 3.58291 14.3033 3.61071ZM13.1786 3.88538L11.9999 2.70738L6.32126 8.38605L5.9046 9.98138L7.49993 9.56472L13.1786 3.88538Z" fill="#118632"/>
                  <path d="M13.0941 11.4401C13.2763 9.88268 13.3345 8.3133 13.2681 6.74672C13.2665 6.7098 13.2726 6.67295 13.2861 6.63852C13.2995 6.60409 13.3199 6.57283 13.3461 6.54672L14.0021 5.89072C14.02 5.87269 14.0428 5.86022 14.0676 5.85481C14.0924 5.84941 14.1183 5.85128 14.1421 5.86023C14.1659 5.86917 14.1866 5.88479 14.2018 5.90522C14.2169 5.92565 14.2258 5.95001 14.2274 5.97538C14.3506 7.83622 14.3037 9.7044 14.0874 11.5567C13.9301 12.9047 12.8474 13.9614 11.5054 14.1114C9.17565 14.3692 6.82453 14.3692 4.49476 14.1114C3.15342 13.9614 2.07009 12.9047 1.91276 11.5567C1.63683 9.19363 1.63683 6.80647 1.91276 4.44338C2.07009 3.09538 3.15276 2.03872 4.49476 1.88872C6.26306 1.69342 8.04456 1.64592 9.82076 1.74672C9.84618 1.74854 9.87054 1.75761 9.89096 1.77286C9.91139 1.7881 9.92701 1.80888 9.93599 1.83273C9.94497 1.85658 9.94693 1.88251 9.94163 1.90743C9.93633 1.93236 9.924 1.95525 9.90609 1.97338L9.24409 2.63472C9.21821 2.66062 9.18727 2.68091 9.15321 2.69433C9.11914 2.70774 9.08268 2.71401 9.04609 2.71272C7.56393 2.66195 6.08003 2.71877 4.60609 2.88272C4.17538 2.93039 3.77332 3.12187 3.46486 3.42622C3.1564 3.73057 2.95954 4.13002 2.90609 4.56005C2.63866 6.84559 2.63866 9.15451 2.90609 11.4401C2.95954 11.8701 3.1564 12.2695 3.46486 12.5739C3.77332 12.8782 4.17538 13.0697 4.60609 13.1174C6.84276 13.3674 9.15742 13.3674 11.3948 13.1174C11.8255 13.0697 12.2275 12.8782 12.536 12.5739C12.8445 12.2695 13.0406 11.8701 13.0941 11.4401Z" fill="#118632"/>
                </svg></button>
              <button class="action-btn delete" (click)="deleteCategory(category.id)">
                حذف
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.8001 3.19995H9.2001C9.2001 2.88169 9.07367 2.57647 8.84863 2.35142C8.62358 2.12638 8.31836 1.99995 8.0001 1.99995C7.68184 1.99995 7.37661 2.12638 7.15157 2.35142C6.92653 2.57647 6.8001 2.88169 6.8001 3.19995ZM6.0001 3.19995C6.0001 2.66952 6.21081 2.16081 6.58588 1.78574C6.96096 1.41066 7.46966 1.19995 8.0001 1.19995C8.53053 1.19995 9.03924 1.41066 9.41431 1.78574C9.78938 2.16081 10.0001 2.66952 10.0001 3.19995H14.0001C14.1062 3.19995 14.2079 3.24209 14.2829 3.31711C14.358 3.39212 14.4001 3.49386 14.4001 3.59995C14.4001 3.70604 14.358 3.80778 14.2829 3.88279C14.2079 3.95781 14.1062 3.99995 14.0001 3.99995H13.1569L12.2017 12.2752C12.1342 12.8601 11.854 13.3998 11.4144 13.7916C10.9748 14.1834 10.4065 14.3999 9.8177 14.4H6.1825C5.59366 14.3999 5.02539 14.1834 4.58581 13.7916C4.14623 13.3998 3.86602 12.8601 3.7985 12.2752L2.8433 3.99995H2.0001C1.89401 3.99995 1.79227 3.95781 1.71726 3.88279C1.64224 3.80778 1.6001 3.70604 1.6001 3.59995C1.6001 3.49386 1.64224 3.39212 1.71726 3.31711C1.79227 3.24209 1.89401 3.19995 2.0001 3.19995H6.0001ZM4.5929 12.184C4.63804 12.5739 4.82493 12.9336 5.11803 13.1947C5.41113 13.4558 5.78998 13.6 6.1825 13.6H9.8177C10.2102 13.6 10.5891 13.4558 10.8822 13.1947C11.1753 12.9336 11.3622 12.5739 11.4073 12.184L12.3513 3.99995H3.6489L4.5929 12.184ZM6.8001 5.99995C6.90618 5.99995 7.00793 6.04209 7.08294 6.11711C7.15796 6.19212 7.2001 6.29386 7.2001 6.39995V11.2C7.2001 11.306 7.15796 11.4078 7.08294 11.4828C7.00793 11.5578 6.90618 11.6 6.8001 11.6C6.69401 11.6 6.59227 11.5578 6.51725 11.4828C6.44224 11.4078 6.4001 11.306 6.4001 11.2V6.39995C6.4001 6.29386 6.44224 6.19212 6.51725 6.11711C6.59227 6.04209 6.69401 5.99995 6.8001 5.99995ZM9.6001 6.39995C9.6001 6.29386 9.55796 6.19212 9.48294 6.11711C9.40793 6.04209 9.30618 5.99995 9.2001 5.99995C9.09401 5.99995 8.99227 6.04209 8.91725 6.11711C8.84224 6.19212 8.8001 6.29386 8.8001 6.39995V11.2C8.8001 11.306 8.84224 11.4078 8.91725 11.4828C8.99227 11.5578 9.09401 11.6 9.2001 11.6C9.30618 11.6 9.40793 11.5578 9.48294 11.4828C9.55796 11.4078 9.6001 11.306 9.6001 11.2V6.39995Z" fill="#F00E0C"/>
                </svg></button>
            </div>
            <button class="action-btn add-product" (click)="addProduct(category)">
              <mat-icon>add</mat-icon>
              إضافة منتج
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div class="loading-container" *ngIf="isLoading">
        <mat-spinner></mat-spinner>
      </div>

      <!-- Pagination -->
      <mat-paginator
        *ngIf="!isLoading && totalRecords > 0"
        [length]="totalRecords"
        [pageSize]="pageSize"
        [pageIndex]="pageIndex"
        [pageSizeOptions]="pageSizeOptions"
        [showFirstLastButtons]="true"
        (page)="onPageChange($event)"
        class="category-paginator">
      </mat-paginator>
    </div>
    <!-- <p-toast></p-toast> -->
  `,
  styles: [`
    .categories-container {
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

    .add-category-btn {
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

    .add-category-btn:hover {
      opacity: 0.9;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(69, 66, 90, 0.3);
    }

    .add-category-btn:active {
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

    .category-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 24px;
    }

    .category-card {
      background: #ffffff;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      position: relative;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .category-content {
      padding: 20px;
      position: relative;
    }

    .category-image-container {
      position: absolute;
      top: 20px;
      left: .7rem;
      width: 80px;
      height: 80px;
    }

    .category-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
    }

    .category-header {
      display: flex;
      align-items: flex-start;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 16px;
      margin-top: 20px;
    }

    .custom-toggle {
      cursor: pointer;
      display: flex;
      align-items: center;
      margin: 0;
    }

    .category-name {
      font-size: 18px;
      font-weight: 600;
      color: #333;
      margin: 0;
      flex: 1;
    }

    .category-stats {
      margin-bottom: 20px;
      padding-top: 16px;
    }

    .stat-item {
      display: flex;
      justify-content: flex-start;
      margin-bottom: 8px;
      font-size: 14px;
    }

    .stat-label {
      font-family: Alexandria;
      font-weight: 300;
      font-style: normal;
      font-size: 14px;
      line-height: 100%;
      letter-spacing: 0%;
      text-align: right;
      color: #ADB5BD;
      position: relative;
      padding-right: 12px;
    }

    .stat-label::before {
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

    .stat-value {
      font-family: Alexandria;
      font-weight: 400;
      font-style: normal;
      font-size: 14px;
      line-height: 100%;
      letter-spacing: 0%;
      text-align: right;
      color: #000000;
      margin-inline: 5px;
    }

    .category-actions {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 8px;
      margin-top: auto;
    }

    .action-group {
      display: flex;
      gap: 8px;
      margin: .5rem;
      padding-inline: 0.5rem;
    }

    .action-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s;
    }

    .action-btn.add-product {
      background: #FDC040;
      color: #FFFFFF;
      width: 132px;
      height: 54.22222137451172px;
      padding: 16px 12px;
      gap: 11.11px;
      border-top-right-radius: 10px;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      box-shadow: 0px 4.44px 4.44px 0px rgba(0, 0, 0, 0.07);
      position: relative;
      right: 41px;
      font-family: Alexandria;
      font-weight: 400;
      font-style: normal;
      font-size: 14px;
      line-height: 100%;
      letter-spacing: 0%;
      text-align: right;
      display: flex;
      justify-content: space-between;
      padding: 1.5rem;
    }

    .action-btn.add-product:hover {
      background: #FDC040;
      opacity: 0.9;
    }

    .action-btn.delete {
      width: 80px;
      height: 32px;
      background: #FFF6F6;
      border: 0.56px solid #FFD6D4;
      border-radius: 2.23px;
      padding: 8px 16px;
      gap: 4px;
      color: #F00E0C;
    }

    .action-btn.delete:hover {
      background: #FFE8E8;
      border-color: #FFB8B8;
      transform: translateY(-1px);
      box-shadow: 0 2px 4px rgba(240, 14, 12, 0.2);
    }

    .action-btn.edit {
      width: 86px;
      height: 32px;
      background: #F5FFF8;
      border: 0.56px solid #D4FFE3;
      border-radius: 2.23px;
      padding: 8px 16px;
      gap: 4px;
      color: #118632;
    }

    .action-btn.edit:hover {
      background: #E8F8F0;
      border-color: #B8E6CC;
      transform: translateY(-1px);
      box-shadow: 0 2px 4px rgba(17, 134, 50, 0.2);
    }

    .action-btn mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 40px;
    }

    .category-paginator {
      margin-top: 32px;
      direction: ltr;
    }
  `]
})
export class MenuManagementComponent implements OnInit {
  categories$!: Observable<Category[]>;
  menuItems$!: Observable<MenuItem[]>;
  categoryColumns = ['name', 'description', 'displayOrder', 'isActive', 'actions'];
  menuItemColumns = ['name', 'category', 'price', 'isAvailable', 'actions'];

  // Pagination properties
  paginatedCategories: Category[] = [];
  backendCategories: BackendCategory[] = []; // Store original backend categories
  totalRecords: number = 0;
  pageSize: number = 9; // 3 columns x 3 rows
  pageIndex: number = 0;
  pageSizeOptions: number[] = [9, 18, 27, 36];
  isLoading: boolean = false;
  imageCacheBuster: number = Date.now();

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private categoryService: CategoryService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadCategories();
    this.loadMenuItems();
  }

  loadCategories(): void {
    this.isLoading = true;
    this.categoryService.getCategoriesPaged(this.pageIndex + 1, this.pageSize).subscribe({
      next: (response: PagedResponse<BackendCategory>) => {
        // Store original backend categories
        this.backendCategories = response.items;
        // Map backend category to component category format
        this.paginatedCategories = response.items.map((cat: BackendCategory) => this.mapBackendCategoryToCategory(cat));
        this.totalRecords = response.totalCount;
        this.categories$ = of(this.paginatedCategories);
        // Update cache buster to force image reload
        this.imageCacheBuster = Date.now();
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading categories:', error);
        this.snackBar.open('فشل تحميل الأصناف', 'إغلاق', { duration: 3000 });
        this.isLoading = false;
        // Fallback to empty array
        this.categories$ = of([]);
      }
    });
  }

  mapBackendCategoryToCategory(backendCat: BackendCategory): Category {
    return {
      id: backendCat.id.toString(),
      name: backendCat.nameAr || backendCat.nameEn || '',
      nameEn: backendCat.nameEn,
      description: backendCat.descriptionAr || backendCat.descriptionEn || '',
      descriptionEn: backendCat.descriptionEn,
      imageUrl: backendCat.imageUrl || '',
      displayOrder: backendCat.id, // Use id as display order if not available
      isActive: backendCat.isActive,
      productCount: backendCat.productCount || 0,
      totalSales: 0, // Backend might not provide this
      orderCount: 0 // Backend might not provide this
    };
  }

  getImageUrl(category: Category): string {
    if (!category || !category.imageUrl) {
      return '';
    }

    const imageUrl = category.imageUrl.trim();

    if (!imageUrl) {
      return '';
    }

    // Don't add cache-busting to data URLs (base64 images) or blob URLs
    // These URLs are already unique and don't need cache-busting
    if (imageUrl.startsWith('data:') || imageUrl.startsWith('blob:')) {
      return imageUrl;
    }

    // For regular HTTP/HTTPS URLs or relative paths, add cache-busting parameter
    // Use a timestamp that updates when categories are reloaded
    // This forces the browser to reload the image after updates
    const separator = imageUrl.includes('?') ? '&' : '?';
    const urlWithCacheBuster = `${imageUrl}${separator}t=${this.imageCacheBuster}`;

    return urlWithCacheBuster;
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadCategories();
  }

  loadCategoriesOld(): void {
    // Static mock data until backend is ready
    this.categories$ = of([
      {
        id: '1',
        name: 'الباستا',
        description: 'Start your meal with our delicious appetizers',
        displayOrder: 1,
        isActive: true,
        imageUrl: 'assets/itmes/الباستا.png',
        productCount: 60,
        totalSales: 60000,
        orderCount: 254
      },
      {
        id: '2',
        name: 'المقبلات',
        description: 'Our signature main dishes',
        displayOrder: 2,
        isActive: true,
        imageUrl: 'assets/itmes/المقبلات.png',
        productCount: 60,
        totalSales: 60000,
        orderCount: 254
      },
      {
        id: '3',
        name: 'الفطار',
        description: 'Sweet endings to your meal',
        displayOrder: 3,
        isActive: true,
        imageUrl: 'assets/itmes/الفطار.png',
        productCount: 60,
        totalSales: 60000,
        orderCount: 254
      },
      {
        id: '4',
        name: 'الشوربة',
        description: 'Refreshing drinks',
        displayOrder: 4,
        isActive: true,
        imageUrl: 'assets/itmes/الشوربةز.png',
        productCount: 60,
        totalSales: 60000,
        orderCount: 254
      },
      {
        id: '5',
        name: 'الساندوشات',
        description: 'Refreshing drinks',
        displayOrder: 5,
        isActive: true,
        imageUrl: 'assets/itmes/الساندوشات.png',
        productCount: 60,
        totalSales: 60000,
        orderCount: 254
      },
      {
        id: '6',
        name: 'الخضار',
        description: 'Refreshing drinks',
        displayOrder: 6,
        isActive: true,
        imageUrl: 'assets/itmes/الخضار.png',
        productCount: 60,
        totalSales: 60000,
        orderCount: 254
      },
      {
        id: '7',
        name: 'الصوانى',
        description: 'Refreshing drinks',
        displayOrder: 7,
        isActive: true,
        imageUrl: 'assets/itmes/الصوانى.png',
        productCount: 60,
        totalSales: 60000,
        orderCount: 254
      },
      {
        id: '8',
        name: 'الأطباق الرئيسة',
        description: 'Refreshing drinks',
        displayOrder: 8,
        isActive: true,
        imageUrl: 'assets/itmes/الأطباق الرئيسة.png',
        productCount: 60,
        totalSales: 60000,
        orderCount: 254
      },
      {
        id: '9',
        name: 'المشاوى',
        description: 'Refreshing drinks',
        displayOrder: 9,
        isActive: true,
        imageUrl: 'assets/itmes/المشاوى.png',
        productCount: 60,
        totalSales: 60000,
        orderCount: 254
      },
      {
        id: '10',
        name: 'المشروبات',
        description: 'Refreshing drinks',
        displayOrder: 10,
        isActive: true,
        imageUrl: 'assets/itmes/المشروبات.png',
        productCount: 60,
        totalSales: 60000,
        orderCount: 254
      },
      {
        id: '11',
        name: 'الحلويات',
        description: 'Refreshing drinks',
        displayOrder: 11,
        isActive: true,
        imageUrl: 'assets/itmes/الحلويات.png',
        productCount: 60,
        totalSales: 60000,
        orderCount: 254
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
    const dialogRef = this.dialog.open(AddCategoryDialogComponent, {
      width: '500px',
      maxWidth: '90vw',
      disableClose: false,
      panelClass: 'add-category-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Prepare the request data
        const categoryData = {
          nameAr: result.name,
          nameEn: result.nameEn,
          descriptionAr: result.description,
          descriptionEn: result.descriptionEn,
          imageUrl: result.image, // The image is base64 string from file input
          isActive: result.isActive
        };

        // Call API to create category
        this.categoryService.createCategory(categoryData).subscribe({
          next: (category) => {
            this.translate.get(['ADMIN.MENU_MANAGEMENT.CATEGORY_ADDED']).subscribe(translations => {
              this.messageService.add({
                severity: 'success',
                summary: 'نجح',
                detail: translations['ADMIN.MENU_MANAGEMENT.CATEGORY_ADDED'] || 'تم إضافة الصنف بنجاح',
                life: 3000
              });
            });
            // Reload categories on the current page
            this.loadCategories();
          },
          error: (error) => {
            console.error('Error creating category:', error);
            this.translate.get(['ADMIN.MENU_MANAGEMENT.CATEGORY_ERROR']).subscribe(translations => {
              this.messageService.add({
                severity: 'error',
                summary: 'خطأ',
                detail: translations['ADMIN.MENU_MANAGEMENT.CATEGORY_ERROR'] || 'حدث خطأ أثناء إضافة الصنف',
                life: 3000
              });
            });
          }
        });
      }
    });
  }

  openMenuItemDialog(): void {
    // Implement dialog for adding/editing menu item
    this.translate.get(['ADMIN.MENU_MANAGEMENT.MENU_ITEM_DIALOG', 'COMMON.CLOSE']).subscribe(translations => {
      this.snackBar.open(translations['ADMIN.MENU_MANAGEMENT.MENU_ITEM_DIALOG'], translations['COMMON.CLOSE'], { duration: 2000 });
    });
  }

  editCategory(category: Category): void {
    // Find the original backend category by matching the id
    const backendCategory = this.backendCategories.find(cat => cat.id.toString() === category.id);
    const categoryToEdit = backendCategory || category; // Fallback to mapped category if not found

    const dialogRef = this.dialog.open(AddCategoryDialogComponent, {
      width: '500px',
      maxWidth: '90vw',
      disableClose: false,
      panelClass: 'add-category-dialog',
      data: { category: categoryToEdit, isEdit: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Prepare the request data
        const categoryData = {
          nameAr: result.name,
          nameEn: result.nameEn,
          descriptionAr: result.description,
          descriptionEn: result.descriptionEn,
          imageUrl: result.image, // The image is base64 string from file input
          isActive: result.isActive
        };

        // Call API to update category
        this.categoryService.updateCategory(Number(category.id), categoryData).subscribe({
          next: (updatedCategory) => {
            // Reload categories on the current page to show the updated category
            this.loadCategories();
            this.translate.get(['ADMIN.MENU_MANAGEMENT.CATEGORY_UPDATED']).subscribe(translations => {
              this.messageService.add({
                severity: 'success',
                summary: 'نجح',
                detail: translations['ADMIN.MENU_MANAGEMENT.CATEGORY_UPDATED'] || 'تم تحديث الصنف بنجاح',
                life: 3000
              });
            });
          },
          error: (error) => {
            console.error('Error updating category:', error);
            this.translate.get(['ADMIN.MENU_MANAGEMENT.ERROR_UPDATING_CATEGORY']).subscribe(translations => {
              this.messageService.add({
                severity: 'error',
                summary: 'خطأ',
                detail: translations['ADMIN.MENU_MANAGEMENT.ERROR_UPDATING_CATEGORY'] || 'حدث خطأ أثناء تحديث الصنف',
                life: 3000
              });
            });
          }
        });
      }
    });
  }

  editMenuItem(item: MenuItem): void {
    // Implement edit menu item
    this.translate.get(['ADMIN.MENU_MANAGEMENT.EDIT_MENU_ITEM', 'COMMON.CLOSE']).subscribe(translations => {
      this.snackBar.open(translations['ADMIN.MENU_MANAGEMENT.EDIT_MENU_ITEM'], translations['COMMON.CLOSE'], { duration: 2000 });
    });
  }

  toggleCategory(category: Category): void {
    const newStatus = !category.isActive;

    // Find the original backend category from paginatedCategories to get the actual imageUrl
    // This ensures we preserve the imageUrl even if the category object in the template has stale data
    const originalCategory = this.paginatedCategories.find(cat => cat.id === category.id);
    const imageUrlToUse = originalCategory?.imageUrl || category.imageUrl;

    // If imageUrl is still empty, log a warning but proceed
    if (!imageUrlToUse) {
      console.warn('Category imageUrl is empty when toggling status:', category.id);
    }

    // Prepare the request data with current category data
    // Make sure we preserve the imageUrl - don't send empty string if imageUrl exists
    const categoryData = {
      nameAr: category.name || '',
      nameEn: category.nameEn || '',
      descriptionAr: category.description || '',
      descriptionEn: category.descriptionEn || '',
      imageUrl: imageUrlToUse || '', // Use the preserved imageUrl
      isActive: newStatus
    };

    // Call API to update category status
    this.categoryService.updateCategory(Number(category.id), categoryData).subscribe({
      next: (updatedCategory) => {
        // The backend should return the updated category with imageUrl preserved
        // Update the local category immediately to preserve the imageUrl
        const categoryIndex = this.paginatedCategories.findIndex(cat => cat.id === category.id);
        if (categoryIndex !== -1 && updatedCategory) {
          // Map the backend category to our component format
          const mappedCategory = this.mapBackendCategoryToCategory(updatedCategory as any);
          this.paginatedCategories[categoryIndex] = mappedCategory;
          this.categories$ = of([...this.paginatedCategories]);
        }

        // Show success message with translation
        this.translate.get(['ADMIN.MENU_MANAGEMENT.CATEGORY_STATUS_UPDATED']).subscribe(translations => {
          this.messageService.add({
            severity: 'success',
            summary: 'نجح',
            detail: translations['ADMIN.MENU_MANAGEMENT.CATEGORY_STATUS_UPDATED'] || 'تم تحديث حالة الصنف بنجاح',
            life: 3000
          });
        });

        // Then reload categories on the current page to show the updated status
        this.loadCategories();
      },
      error: (error) => {
        console.error('Error updating category status:', error);
        // Show error message with translation
        this.translate.get(['ADMIN.MENU_MANAGEMENT.ERROR_UPDATING_CATEGORY']).subscribe(translations => {
          this.messageService.add({
            severity: 'error',
            summary: 'خطأ',
            detail: translations['ADMIN.MENU_MANAGEMENT.ERROR_UPDATING_CATEGORY'] || 'حدث خطأ أثناء تحديث حالة الصنف',
            life: 3000
          });
        });
      }
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
    this.translate.get(['ADMIN.MENU_MANAGEMENT.CATEGORY_DELETE_CONFIRM']).subscribe(translations => {
      const confirmMessage = translations['ADMIN.MENU_MANAGEMENT.CATEGORY_DELETE_CONFIRM'] || 'هل أنت متأكد من حذف هذا الصنف؟';
      if (confirm(confirmMessage)) {
        // Call API to delete category
        this.categoryService.deleteCategory(Number(id)).subscribe({
          next: () => {
            // Reload categories on the current page
            this.loadCategories();
            this.translate.get(['ADMIN.MENU_MANAGEMENT.CATEGORY_DELETED']).subscribe(deleteTranslations => {
              this.messageService.add({
                severity: 'success',
                summary: 'نجح',
                detail: deleteTranslations['ADMIN.MENU_MANAGEMENT.CATEGORY_DELETED'] || 'تم حذف الصنف بنجاح',
                life: 3000
              });
            });
          },
          error: (error) => {
            console.error('Error deleting category:', error);
            this.translate.get(['ADMIN.MENU_MANAGEMENT.ERROR_DELETING_CATEGORY']).subscribe(errorTranslations => {
              this.messageService.add({
                severity: 'error',
                summary: 'خطأ',
                detail: errorTranslations['ADMIN.MENU_MANAGEMENT.ERROR_DELETING_CATEGORY'] || 'حدث خطأ أثناء حذف الصنف',
                life: 3000
              });
            });
          }
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

  addProduct(category: Category): void {
    // Implement add product functionality
    this.translate.get(['ADMIN.MENU_MANAGEMENT.ADD_PRODUCT', 'COMMON.CLOSE']).subscribe(translations => {
      this.snackBar.open(translations['ADMIN.MENU_MANAGEMENT.ADD_PRODUCT'], translations['COMMON.CLOSE'], { duration: 2000 });
    });
  }
}

