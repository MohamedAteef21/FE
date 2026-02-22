import { Component, Inject, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DOCUMENT, ViewportScroller } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { CartService } from '../core/services/cart.service';
import { TranslationService } from '../core/services/translation.service';
import { CategoryService } from '../core/services/category.service';
import { AuthService } from '../core/services/auth.service';
import { BranchService } from '../core/services/branch.service';
import { ProductService, Product } from '../core/services/product.service';
import { Observable, Subscription, of } from 'rxjs';
import { map, filter, catchError } from 'rxjs/operators';
import { Cart } from '../models/menu-item.model';
import { MatDialog } from '@angular/material/dialog';
import { LocationDialogComponent } from './location-dialog.component';
import { Category, CategoryWithProducts } from '../models/category.model';
import { User, UserRole } from '../models/auth.model';
import { Branch } from '../models/branch.model';







@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule, TranslateModule, ReactiveFormsModule],
  template: `
  
    <!-- Mobile Menu Overlay -->
  <div class="mobile-menu-overlay" [class.active]="isMobileMenuOpen" (click)="closeMobileMenu()"></div>
  
  <!-- Mobile Drawer -->
  <div class="mobile-drawer" [class.open]="isMobileMenuOpen">
    <div class="mobile-drawer-header">
      <img src="assets/Bashwat-logo.png" alt="Logo" class="mobile-drawer-logo" />
      <button class="mobile-drawer-close" (click)="closeMobileMenu()">✕</button>
    </div>
    <div class="mobile-drawer-body">
      <!-- User section -->
      <div class="mobile-user-section">
        <button mat-icon-button [matMenuTriggerFor]="userMenu" class="mobile-user-menu-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C11.0111 2 10.0444 2.29324 9.22215 2.84265C8.3999 3.39206 7.75904 4.17295 7.3806 5.08658C7.00216 6.00021 6.90315 7.00555 7.09607 7.97545C7.289 8.94536 7.7652 9.83627 8.46447 10.5355C9.16373 11.2348 10.0546 11.711 11.0245 11.9039C11.9945 12.0969 12.9998 11.9978 13.9134 11.6194C14.827 11.241 15.6079 10.6001 16.1573 9.77785C16.7068 8.95561 17 7.98891 17 7C17 5.67392 16.4732 4.40215 15.5355 3.46447C14.5979 2.52678 13.3261 2 12 2Z" fill="#333"/><path d="M21 21V20C21 18.1435 20.2625 16.363 18.9497 15.0503C17.637 13.7375 15.8565 13 14 13H10C8.14348 13 6.36301 13.7375 5.05025 15.0503C3.7375 16.363 3 18.1435 3 20V21H5V20C5 18.6739 5.52678 17.4021 6.46447 16.4645C7.40215 15.5268 8.67392 15 10 15H14C15.3261 15 16.5979 15.5268 17.5355 16.4645C18.4732 17.4021 19 18.6739 19 20V21H21Z" fill="#333"/>
          </svg>
        </button>
        <mat-menu #userMenu="matMenu">
          <button *ngIf="currentUser" mat-menu-item disabled>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C11.0111 2 10.0444 2.29324 9.22215 2.84265C8.3999 3.39206 7.75904 4.17295 7.3806 5.08658C7.00216 6.00021 6.90315 7.00555 7.09607 7.97545C7.289 8.94536 7.7652 9.83627 8.46447 10.5355C9.16373 11.2348 10.0546 11.711 11.0245 11.9039C11.9945 12.0969 12.9998 11.9978 13.9134 11.6194C14.827 11.241 15.6079 10.6001 16.1573 9.77785C16.7068 8.95561 17 7.98891 17 7C17 5.67392 16.4732 4.40215 15.5355 3.46447C14.5979 2.52678 13.3261 2 12 2Z" fill="#666"/><path d="M21 21V20C21 18.1435 20.2625 16.363 18.9497 15.0503C17.637 13.7375 15.8565 13 14 13H10C8.14348 13 6.36301 13.7375 5.05025 15.0503C3.7375 16.363 3 18.1435 3 20V21H5V20C5 18.6739 5.52678 17.4021 6.46447 16.4645C7.40215 15.5268 8.67392 15 10 15H14C15.3261 15 16.5979 15.5268 17.5355 16.4645C18.4732 17.4021 19 18.6739 19 20V21H21Z" fill="#666"/>
            </svg>
            <span>{{ currentUser.email }}</span>
          </button>
          <button *ngIf="!currentUser" mat-menu-item (click)="onUserClick(); closeMobileMenu()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 7L9.6 8.4L11.17 10H2V12H11.17L9.6 13.6L11 15L15 11L11 7ZM20 19H4V5H20V7H22V3C22 2.45 21.55 2 21 2H3C2.45 2 2 2.45 2 3V21C2 21.55 2.45 22 3 22H21C21.55 22 22 21.55 22 21V17H20V19Z" fill="#666"/>
            </svg>
            <span>{{ 'NAV.LOGIN' | translate }}</span>
          </button>
          <button *ngIf="currentUser" mat-menu-item (click)="onLogout(); closeMobileMenu()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.59L17 17L22 12L17 7ZM4 5H12V3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H12V19H4V5Z" fill="#666"/>
            </svg>
            <span>{{ 'NAV.LOGOUT' | translate }}</span>
          </button>
        </mat-menu>
      </div>
      <!-- Location -->
      <div class="mobile-location" (click)="openLocationDialog(); closeMobileMenu()">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity="0.3" d="M12 2C13.9891 2 15.8968 2.79018 17.3033 4.1967C18.7098 5.60322 19.5 7.51088 19.5 9.5C19.5 12.068 18.1 14.156 16.65 15.64C16.0736 16.2239 15.4542 16.7638 14.797 17.255C14.203 17.701 12.845 18.537 12.845 18.537C12.5874 18.6834 12.2963 18.7604 12 18.7604C11.7037 18.7604 11.4126 18.6834 11.155 18.537C10.4811 18.1462 9.82938 17.7182 9.203 17.255C8.5458 16.7638 7.9264 16.2239 7.35 15.64C5.9 14.156 4.5 12.068 4.5 9.5C4.5 7.51088 5.29018 5.60322 6.6967 4.1967C8.10322 2.79018 10.0109 2 12 2Z" fill="#d32f2f"/></svg>
        <span>{{ currentLocation || ('LAYOUT.DELIVERY_TO_MY_LOCATION' | translate) }}</span>
      </div>
      <!-- Categories -->
      <div class="mobile-nav-section-title">{{ 'LAYOUT.CATEGORIES' | translate }}</div>
      <div class="mobile-categories-list">
        <a *ngFor="let category of menuCategories" 
           class="mobile-category-link"
           (click)="navigateToCategory(category.id); closeMobileMenu()">
          <img [src]="category.image" [alt]="category.nameAr" class="mobile-cat-img" />
          <span>{{ currentLang === 'ar' ? category.nameAr : category.nameEn }}</span>
        </a>
      </div>
      <!-- Language & Social -->
      <div class="mobile-bottom-section">
        <button class="mobile-lang-btn" (click)="onLanguageChange()">
          <span>{{ currentLang === 'ar' ? ('LANGUAGE.ENGLISH' | translate) : ('LANGUAGE.ARABIC' | translate) }}</span>
        </button>
        <div class="mobile-social-icons">
          <a href="https://web.facebook.com/bashawatqtr" target="_blank" class="mobile-social-icon"><i class="fab fa-facebook-f"></i></a>
          <a href="https://www.instagram.com/bashawatqtr?igsh=amEzdWk1Mnc0OWNu" target="_blank" class="mobile-social-icon"><i class="fab fa-instagram"></i></a>
          <a href="https://www.tiktok.com/@al.bashawat.resta" target="_blank" class="mobile-social-icon"><i class="fab fa-tiktok"></i></a>
        </div>
      </div>
    </div>
  </div>

    <nav class="navbar-container">
  <div class="top-bar">
    <div class="top-bar-content">
      <div class="top-bar-right">
        <span class="contact-item">
          <i class="fas fa-headset"></i>
          {{ 'LAYOUT.CONTACT_US' | translate }} {{ getContactPhone() }}
        </span>
        <span class="top-bar-hide-mobile">{{ 'LAYOUT.FAQ' | translate }}</span>
        <span class="divider top-bar-hide-mobile">| |</span>
        <span class="top-bar-hide-mobile">{{ 'LAYOUT.BLOGS' | translate }}</span>
        <span class="divider top-bar-hide-mobile">|</span>
        <a routerLink="/about" class="top-bar-hide-mobile">{{ 'LAYOUT.ABOUT_US' | translate }}</a>
      </div>

      <div class="top-bar-left">
        <span class="discount-text" style=''>{{ 'LAYOUT.DISCOUNT_TEXT' | translate }}</span>
      </div>

      <div class="social-icons">
        <a href="https://web.facebook.com/bashawatqtr" class="social-icon" target="_blank" rel="noopener noreferrer" title="Facebook">
          <i class="fab fa-facebook-f"></i>
        </a>
        <a href="https://www.instagram.com/bashawatqtr?igsh=amEzdWk1Mnc0OWNu" class="social-icon" target="_blank" rel="noopener noreferrer" title="Instagram">
          <i class="fab fa-instagram"></i>
        </a>
        <a href="https://www.tiktok.com/@al.bashawat.resta" class="social-icon" target="_blank" rel="noopener noreferrer" title="TikTok">
          <i class="fab fa-tiktok"></i>
        </a>
      </div>
    </div>
  </div>

  <div class="main-navbar">
    <div class="navbar">

<div class="row" style="width: 100%;display: flex;justify-content: space-between;align-items: center;padding-left: 60px;padding-right: 15px;">

  <div class="col-4 col-sm-4 col-md-4 col-lg-4 col-xl-4 col-xxl-4 row" id="Gr">
      <div class="col-12 col-md-12 col-sm-12 col-lg-12 col-xl-12 col-xxl-12">
      <div class="navbar-right">
        <button class="cart-button" (click)="onCartClick()">
          <div class="cart-icon-wrapper">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.25 12C7.25 11.8011 7.32902 11.6103 7.46967 11.4697C7.61032 11.329 7.80109 11.25 8 11.25H16C16.1989 11.25 16.3897 11.329 16.5303 11.4697C16.671 11.6103 16.75 11.8011 16.75 12C16.75 12.1989 16.671 12.3897 16.5303 12.5303C16.3897 12.671 16.1989 12.75 16 12.75H8C7.80109 12.75 7.61032 12.671 7.46967 12.5303C7.32902 12.3897 7.25 12.1989 7.25 12ZM10 14.25C9.80109 14.25 9.61032 14.329 9.46967 14.4697C9.32902 14.6103 9.25 14.8011 9.25 15C9.25 15.1989 9.32902 15.3897 9.46967 15.5303C9.61032 15.671 9.80109 15.75 10 15.75H14C14.1989 15.75 14.3897 15.671 14.5303 15.5303C14.671 15.3897 14.75 15.1989 14.75 15C14.75 14.8011 14.671 14.6103 14.5303 14.4697C14.3897 14.329 14.1989 14.25 14 14.25H10Z" fill="black"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M14.6666 2.33015C14.8444 2.24123 15.0503 2.22658 15.239 2.28939C15.4276 2.35221 15.5836 2.48737 15.6726 2.66515L17.4856 6.29115C17.9129 6.31181 18.3029 6.34715 18.6556 6.39715C19.7116 6.54815 20.5856 6.87415 21.2066 7.64215C21.8276 8.41015 21.9636 9.33315 21.8906 10.3971C21.8206 11.4281 21.5406 12.7291 21.1926 14.3541L20.7416 16.4611C20.5066 17.5581 20.3156 18.4471 20.0756 19.1411C19.8256 19.8661 19.4956 20.4611 18.9336 20.9161C18.3716 21.3711 17.7196 21.5681 16.9596 21.6611C16.2296 21.7501 15.3196 21.7501 14.1996 21.7501H9.80361C8.68161 21.7501 7.77261 21.7501 7.04261 21.6611C6.28261 21.5681 5.63061 21.3711 5.06861 20.9161C4.50661 20.4611 4.17661 19.8661 3.92661 19.1421C3.68661 18.4471 3.49661 17.5581 3.26061 16.4621L2.80961 14.3551C2.46161 12.7291 2.18261 11.4281 2.11161 10.3971C2.03861 9.33315 2.17461 8.41115 2.79561 7.64215C3.41561 6.87415 4.28961 6.54815 5.34561 6.39715C5.69894 6.34781 6.08894 6.31248 6.51561 6.29115L8.33161 2.66515C8.42138 2.48878 8.57723 2.35504 8.76518 2.29307C8.95313 2.23111 9.15795 2.24594 9.33502 2.33434C9.51208 2.42274 9.64703 2.57754 9.71045 2.76501C9.77387 2.95247 9.76063 3.1574 9.67361 3.33515L8.21361 6.25215C8.57761 6.25015 8.96061 6.24948 9.36261 6.25015H14.6406C15.0426 6.25015 15.4256 6.25081 15.7896 6.25215L14.3306 3.33515C14.2417 3.15731 14.227 2.95144 14.2899 2.7628C14.3527 2.57416 14.4878 2.41818 14.6656 2.32915M5.73361 7.85815L5.33061 8.66415C5.28571 8.75236 5.25872 8.84859 5.25118 8.94728C5.24365 9.04598 5.25573 9.14519 5.28672 9.23919C5.31771 9.3332 5.367 9.42014 5.43175 9.495C5.49651 9.56986 5.57544 9.63117 5.664 9.67538C5.75256 9.7196 5.84899 9.74584 5.94774 9.75261C6.04649 9.75938 6.1456 9.74653 6.23937 9.71481C6.33313 9.68308 6.41968 9.63312 6.49404 9.56778C6.5684 9.50245 6.62909 9.42305 6.67261 9.33415L7.45961 7.76015C8.02961 7.75015 8.67961 7.74915 9.42361 7.74915H14.5796C15.3236 7.74915 15.9736 7.74915 16.5436 7.75915L17.3306 9.33415C17.4204 9.51052 17.5762 9.64425 17.7642 9.70622C17.9521 9.76818 18.157 9.75335 18.334 9.66495C18.5111 9.57655 18.646 9.42175 18.7094 9.23429C18.7729 9.04682 18.7596 8.84189 18.6726 8.66415L18.2696 7.85815L18.4436 7.88115C19.3276 8.00815 19.7606 8.23915 20.0406 8.58415C20.3206 8.93015 20.4546 9.40315 20.3936 10.2941C20.3316 11.2041 20.0776 12.4001 19.7136 14.0991L19.2836 16.0991C19.0366 17.2541 18.8636 18.0531 18.6576 18.6511C18.4576 19.2311 18.2536 19.5371 17.9906 19.7491C17.7286 19.9611 17.3856 20.0971 16.7786 20.1711C16.1496 20.2481 15.3316 20.2491 14.1506 20.2491H9.85161C8.67161 20.2491 7.85361 20.2481 7.22461 20.1711C6.61661 20.0971 6.27461 19.9611 6.01261 19.7491C5.74961 19.5371 5.54461 19.2301 5.34561 18.6511C5.13861 18.0531 4.96561 17.2541 4.71861 16.0991L4.28961 14.0991C3.92561 12.3991 3.67161 11.2051 3.60961 10.2941C3.54861 9.40315 3.68361 8.93015 3.96261 8.58415C4.24261 8.23915 4.67561 8.00815 5.55961 7.88115L5.73361 7.85815Z" fill="black"/>
            </svg>
            <span class="cart-badge">{{ (cartItemCount$ | async) || 0 }}</span>
          </div>
          <span class="wallet-amount">{{ ((cart$ | async)?.subtotal || 0).toFixed(2) }} {{ 'COMMON.RIYAL' | translate }}</span>
        </button>

        <div class="user-menu-wrapper">
          <button *ngIf="!currentUser" class="user-button" (click)="onUserClick()">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C11.0111 2 10.0444 2.29324 9.22215 2.84265C8.3999 3.39206 7.75904 4.17295 7.3806 5.08658C7.00216 6.00021 6.90315 7.00555 7.09607 7.97545C7.289 8.94536 7.7652 9.83627 8.46447 10.5355C9.16373 11.2348 10.0546 11.711 11.0245 11.9039C11.9945 12.0969 12.9998 11.9978 13.9134 11.6194C14.827 11.241 15.6079 10.6001 16.1573 9.77785C16.7068 8.95561 17 7.98891 17 7C17 5.67392 16.4732 4.40215 15.5355 3.46447C14.5979 2.52678 13.3261 2 12 2ZM12 10C11.4067 10 10.8266 9.82405 10.3333 9.49441C9.83994 9.16476 9.45542 8.69623 9.22836 8.14805C9.0013 7.59987 8.94189 6.99667 9.05764 6.41473C9.1734 5.83279 9.45912 5.29824 9.87868 4.87868C10.2982 4.45912 10.8328 4.1734 11.4147 4.05764C11.9967 3.94189 12.5999 4.0013 13.1481 4.22836C13.6962 4.45542 14.1648 4.83994 14.4944 5.33329C14.8241 5.82664 15 6.40666 15 7C15 7.79565 14.6839 8.55871 14.1213 9.12132C13.5587 9.68393 12.7956 10 12 10ZM21 21V20C21 18.1435 20.2625 16.363 18.9497 15.0503C17.637 13.7375 15.8565 13 14 13H10C8.14348 13 6.36301 13.7375 5.05025 15.0503C3.7375 16.363 3 18.1435 3 20V21H5V20C5 18.6739 5.52678 17.4021 6.46447 16.4645C7.40215 15.5268 8.67392 15 10 15H14C15.3261 15 16.5979 15.5268 17.5355 16.4645C18.4732 17.4021 19 18.6739 19 20V21H21Z" fill="black"/>
            </svg>
            <span *ngIf="!isMobile()">{{ 'NAV.LOGIN' | translate }}</span>
          </button>
          <button *ngIf="currentUser" mat-icon-button [matMenuTriggerFor]="desktopUserMenu" class="user-menu-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C11.0111 2 10.0444 2.29324 9.22215 2.84265C8.3999 3.39206 7.75904 4.17295 7.3806 5.08658C7.00216 6.00021 6.90315 7.00555 7.09607 7.97545C7.289 8.94536 7.7652 9.83627 8.46447 10.5355C9.16373 11.2348 10.0546 11.711 11.0245 11.9039C11.9945 12.0969 12.9998 11.9978 13.9134 11.6194C14.827 11.241 15.6079 10.6001 16.1573 9.77785C16.7068 8.95561 17 7.98891 17 7C17 5.67392 16.4732 4.40215 15.5355 3.46447C14.5979 2.52678 13.3261 2 12 2Z" fill="#333"/><path d="M21 21V20C21 18.1435 20.2625 16.363 18.9497 15.0503C17.637 13.7375 15.8565 13 14 13H10C8.14348 13 6.36301 13.7375 5.05025 15.0503C3.7375 16.363 3 18.1435 3 20V21H5V20C5 18.6739 5.52678 17.4021 6.46447 16.4645C7.40215 15.5268 8.67392 15 10 15H14C15.3261 15 16.5979 15.5268 17.5355 16.4645C18.4732 17.4021 19 18.6739 19 20V21H21Z" fill="#333"/>
            </svg>
          </button>
          <mat-menu #desktopUserMenu="matMenu">
            <button mat-menu-item disabled>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C11.0111 2 10.0444 2.29324 9.22215 2.84265C8.3999 3.39206 7.75904 4.17295 7.3806 5.08658C7.00216 6.00021 6.90315 7.00555 7.09607 7.97545C7.289 8.94536 7.7652 9.83627 8.46447 10.5355C9.16373 11.2348 10.0546 11.711 11.0245 11.9039C11.9945 12.0969 12.9998 11.9978 13.9134 11.6194C14.827 11.241 15.6079 10.6001 16.1573 9.77785C16.7068 8.95561 17 7.98891 17 7C17 5.67392 16.4732 4.40215 15.5355 3.46447C14.5979 2.52678 13.3261 2 12 2Z" fill="#666"/><path d="M21 21V20C21 18.1435 20.2625 16.363 18.9497 15.0503C17.637 13.7375 15.8565 13 14 13H10C8.14348 13 6.36301 13.7375 5.05025 15.0503C3.7375 16.363 3 18.1435 3 20V21H5V20C5 18.6739 5.52678 17.4021 6.46447 16.4645C7.40215 15.5268 8.67392 15 10 15H14C15.3261 15 16.5979 15.5268 17.5355 16.4645C18.4732 17.4021 19 18.6739 19 20V21H21Z" fill="#666"/>
              </svg>
              <span>{{ currentUser?.email }}</span>
            </button>
            <button mat-menu-item *ngIf="currentUser?.role === UserRole.ADMIN" (click)="navigateToAdminDashboard()">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 13H11V3H3V13ZM3 21H11V15H3V21ZM13 21H21V11H13V21ZM13 3V9H21V3H13Z" fill="#666"/>
              </svg>
              <span>{{ 'LAYOUT.DASHBOARD' | translate }}</span>
            </button>
            <button mat-menu-item (click)="onLogout()">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.59L17 17L22 12L17 7ZM4 5H12V3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H12V19H4V5Z" fill="#666"/>
              </svg>
              <span>{{ 'NAV.LOGOUT' | translate }}</span>
            </button>
          </mat-menu>
        </div>

        <button class="language-button" (click)="onLanguageChange()">
          <span class="flag-icon" [attr.aria-label]="currentLang === 'ar' ? ('LAYOUT.ENGLISH_FLAG' | translate) : ('LAYOUT.QATAR_FLAG' | translate)">
            <svg *ngIf="currentLang === 'en'" width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#qatarFlagClip)">
                <path d="M24.888 3.88867H8.55469V24.1109H24.888C25.7131 24.1109 26.5045 23.7831 27.0879 23.1997C27.6714 22.6162 27.9991 21.8249 27.9991 20.9998V6.99978C27.9991 6.17466 27.6714 5.38334 27.0879 4.7999C26.5045 4.21645 25.7131 3.88867 24.888 3.88867Z" fill="#66001E"/>
                <path d="M8.55556 21.8641L12.6739 20.741L8.55556 19.6171L12.6739 18.494L8.55556 17.3701L12.6739 16.247L8.55556 15.1231L12.6739 14L8.55556 12.8769L12.6739 11.7538L8.55556 10.6299L12.6739 9.50677L8.55556 8.38288L12.6739 7.259L8.55556 6.13589L12.6739 5.01277L8.55556 3.88889H3.11111C2.28599 3.88889 1.49467 4.21666 0.911223 4.80011C0.327777 5.38356 0 6.17488 0 7L0 21C0 21.8251 0.327777 22.6164 0.911223 23.1999C1.49467 23.7833 2.28599 24.1111 3.11111 24.1111H8.55556L12.6739 22.988L8.55556 21.8641Z" fill="#EEEEEE"/>
              </g>
              <defs>
                <clipPath id="qatarFlagClip">
                  <rect width="28" height="28" fill="white"/>
                </clipPath>
              </defs>
            </svg>
            <svg *ngIf="currentLang === 'ar'" width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M24.8889 3.88889H3.11111C2.28599 3.88889 1.49467 4.21666 0.911223 4.80011C0.327777 5.38356 0 6.17488 0 7L0 21C0 21.8251 0.327777 22.6164 0.911223 23.1999C1.49467 23.7833 2.28599 24.1111 3.11111 24.1111H24.8889C25.714 24.1111 26.5053 23.7833 27.0888 23.1999C27.6722 22.6164 28 21.8251 28 21V7C28 6.17488 27.6722 5.38356 27.0888 4.80011C26.5053 4.21666 25.714 3.88889 24.8889 3.88889Z" fill="#EEEEEE"/>
              <path d="M16.3333 3.88889H11.6667V11.6667H0V16.3333H11.6667V24.1111H16.3333V16.3333H28V11.6667H16.3333V3.88889Z" fill="#CE1124"/>
            </svg>
          </span>
          <span>{{ currentLang === 'ar' ? ('LANGUAGE.ENGLISH' | translate) : ('LANGUAGE.ARABIC' | translate) }}</span>
        </button>
      </div>
</div>
</div>






  <div class="col-8 col-sm-8 col-md-8 col-lg-8 col-xl-8 col-xxl-8" style="display: flex;justify-content: flex-end;align-items: center;">


  <div class="col-8 col-sm-8 col-md-8 col-lg-8 col-xl-8 col-xxl-8" style="display: flex;justify-content: flex-end;" id="G-search">

<div class="col-auto col-md-auto col-sm-auto col-lg-auto col-xl-auto col-xxl-auto" style="position: relative;">
        <div class="search-wrapper" [class.search-open]="isSearchOpen">
          <div class="search-input-container" *ngIf="isSearchOpen">
            <input
              type="text"
              class="search-input"
              [placeholder]="'LAYOUT.SEARCH' | translate"
              (input)="onSearch($event)"
              (keyup.enter)="onSearchClick()"
              (focus)="onSearchFocus()"
              (blur)="onSearchBlur()"
              #searchInput
            />
            <button class="search-submit-button" (click)="onSearchClick()" [disabled]="isSearching">
              <svg *ngIf="!isSearching" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.5 16C7.68333 16 6.146 15.3707 4.888 14.112C3.63 12.8533 3.00067 11.316 3 9.5C2.99933 7.684 3.62867 6.14667 4.888 4.888C6.14733 3.62933 7.68467 3 9.5 3C11.3153 3 12.853 3.62933 14.113 4.888C15.373 6.14667 16.002 7.684 16 9.5C16 10.2333 15.8833 10.925 15.65 11.575C15.4167 12.225 15.1 12.8 14.7 13.3L20.3 18.9C20.4833 19.0833 20.575 19.3167 20.575 19.6C20.575 19.8833 20.4833 20.1167 20.3 20.3C20.1167 20.4833 19.8833 20.575 19.6 20.575C19.3167 20.575 19.0833 20.4833 18.9 20.3L13.3 14.7C12.8 15.1 12.225 15.4167 11.575 15.65C10.925 15.8833 10.2333 16 9.5 16ZM9.5 14C10.75 14 11.8127 13.5627 12.688 12.688C13.5633 11.8133 14.0007 10.7507 14 9.5C13.9993 8.24933 13.562 7.187 12.688 6.313C11.814 5.439 10.7513 5.00133 9.5 5C8.24867 4.99867 7.18633 5.43633 6.313 6.313C5.43967 7.18967 5.002 8.252 5 9.5C4.998 10.748 5.43567 11.8107 6.313 12.688C7.19033 13.5653 8.25267 14.0027 9.5 14Z" fill="currentColor"/>
              </svg>
              <span *ngIf="isSearching" class="search-spinner"></span>
            </button>
          </div>
          <button class="search-toggle-button" *ngIf="!isSearchOpen" (click)="toggleSearch()">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.5 16C7.68333 16 6.146 15.3707 4.888 14.112C3.63 12.8533 3.00067 11.316 3 9.5C2.99933 7.684 3.62867 6.14667 4.888 4.888C6.14733 3.62933 7.68467 3 9.5 3C11.3153 3 12.853 3.62933 14.113 4.888C15.373 6.14667 16.002 7.684 16 9.5C16 10.2333 15.8833 10.925 15.65 11.575C15.4167 12.225 15.1 12.8 14.7 13.3L20.3 18.9C20.4833 19.0833 20.575 19.3167 20.575 19.6C20.575 19.8833 20.4833 20.1167 20.3 20.3C20.1167 20.4833 19.8833 20.575 19.6 20.575C19.3167 20.575 19.0833 20.4833 18.9 20.3L13.3 14.7C12.8 15.1 12.225 15.4167 11.575 15.65C10.925 15.8833 10.2333 16 9.5 16ZM9.5 14C10.75 14 11.8127 13.5627 12.688 12.688C13.5633 11.8133 14.0007 10.7507 14 9.5C13.9993 8.24933 13.562 7.187 12.688 6.313C11.814 5.439 10.7513 5.00133 9.5 5C8.24867 4.99867 7.18633 5.43633 6.313 6.313C5.43967 7.18967 5.002 8.252 5 9.5C4.998 10.748 5.43567 11.8107 6.313 12.688C7.19033 13.5653 8.25267 14.0027 9.5 14Z" fill="black"/>
            </svg>
          </button>
        </div>
        <!-- Search Results Dropdown -->
        <div class="search-results-dropdown" *ngIf="isSearchOpen && searchResults.length > 0 && showSearchResults">
          <div 
            class="search-result-item" 
            *ngFor="let product of searchResults"
            (click)="selectSearchResult(product)"
            (mousedown)="$event.preventDefault()">
            <div class="search-result-image" *ngIf="product.imageUrl">
              <img [src]="product.imageUrl" [alt]="currentLang === 'ar' ? product.nameAr : product.nameEn" />
            </div>
            <div class="search-result-content">
              <div class="search-result-name">{{ currentLang === 'ar' ? product.nameAr : (product.nameEn || product.nameAr) }}</div>
              <div class="search-result-category">{{ product.categoryName }}</div>
              <div class="search-result-price">{{ product.basePrice }} {{ 'COMMON.RIYAL' | translate }}</div>
            </div>
          </div>
        </div>
        <div class="search-results-dropdown search-no-results" *ngIf="isSearchOpen && searchResults.length === 0 && showSearchResults && searchTerm.length > 0 && !isSearching">
          <div class="search-no-results-message">{{ (currentLang === 'ar' ? 'لا توجد نتائج' : 'No results found') }}</div>
        </div>
</div>

<div class="col-auto col-md-auto col-sm-auto col-lg-auto col-xl-auto col-xxl-auto">
        <button class="download-button" (click)="downloadMenuPDF()">
          <span>{{ 'DOWNLOAD.BASHWAT_MENU' | translate }}</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4H14V10H16.5L12 14.5M12 4H10V10H7.5L12 14.5" fill="black"/>
            <path d="M12 4H14V10H16.5L12 14.5L7.5 10H10V4H12Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M6 19H18" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
</div>
<div class="col-auto col-md-auto col-sm-auto col-lg-auto col-xl-auto col-xxl-auto">
        <div class="location-dropdown" (click)="openLocationDialog()">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="chevron-icon">
            <path d="M6 9L12 15L18 9" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>{{ currentLocation || ('LAYOUT.DEFAULT_LOCATION' | translate) }}</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="location-icon">
            <path d="M6.72 16.64C6.97461 16.5657 7.24829 16.5957 7.48083 16.7232C7.71338 16.8507 7.88574 17.0654 7.96 17.32C8.03426 17.5746 8.00434 17.8483 7.87681 18.0808C7.74929 18.3134 7.53461 18.4857 7.28 18.56C6.78 18.706 6.42 18.86 6.189 19C6.427 19.143 6.803 19.303 7.325 19.452C8.48 19.782 10.133 20 12 20C13.867 20 15.52 19.782 16.675 19.452C17.198 19.303 17.573 19.143 17.811 19C17.581 18.86 17.221 18.706 16.721 18.56C16.4704 18.4825 16.2603 18.3096 16.136 18.0786C16.0117 17.8476 15.9831 17.577 16.0564 17.3251C16.1298 17.0733 16.2991 16.8603 16.528 16.7321C16.7569 16.604 17.0269 16.5709 17.28 16.64C17.948 16.835 18.56 17.085 19.03 17.406C19.465 17.705 20 18.226 20 19C20 19.783 19.452 20.308 19.01 20.607C18.532 20.929 17.907 21.18 17.224 21.375C15.846 21.77 14 22 12 22C10 22 8.154 21.77 6.776 21.375C6.093 21.18 5.468 20.929 4.99 20.607C4.548 20.307 4 19.783 4 19C4 18.226 4.535 17.705 4.97 17.406C5.44 17.085 6.052 16.835 6.72 16.64ZM12 7.5C10.46 7.5 9.498 9.167 10.268 10.5C10.625 11.119 11.285 11.5 12 11.5C13.54 11.5 14.502 9.833 13.732 8.5C13.5565 8.19597 13.304 7.9435 13 7.76796C12.6959 7.59243 12.3511 7.50001 12 7.5Z" fill="black"/>
            <path opacity="0.3" d="M12 2C13.9891 2 15.8968 2.79018 17.3033 4.1967C18.7098 5.60322 19.5 7.51088 19.5 9.5C19.5 12.068 18.1 14.156 16.65 15.64C16.0736 16.2239 15.4542 16.7638 14.797 17.255C14.203 17.701 12.845 18.537 12.845 18.537C12.5874 18.6834 12.2963 18.7604 12 18.7604C11.7037 18.7604 11.4126 18.6834 11.155 18.537C10.4811 18.1462 9.82938 17.7182 9.203 17.255C8.5458 16.7638 7.9264 16.2239 7.35 15.64C5.9 14.156 4.5 12.068 4.5 9.5C4.5 7.51088 5.29018 5.60322 6.6967 4.1967C8.10322 2.79018 10.0109 2 12 2Z" fill="black"/>
          </svg>
        </div>
</div>


  </div>
      <div class="col-2 col-md-2 col-sm-2 col-lg-2 col-xl-2  col-xxl-2" style="width: 10.667%;">
      <!-- Left Side - Logo -->
      <div class="navbar-left">
        <div class="logo" routerLink="/">
          <img src="assets/Bashwat-logo.png" alt="Logo" />
        </div>
      </div>
</div>

<div id="tabs" class="col-2 col-md-2 col-sm-2 col-lg-2 col-xl-2  col-xxl-2" style="display: flex;justify-content: center;align-items: center;">
      <!-- Mobile Hamburger Button -->
      <button class="hamburger-btn" (click)="toggleMobileMenu()" aria-label="Toggle navigation">
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
      </button>
</div>
</div>
  </div>
    </div>
  </div>

  <!-- Menu Bar -->
  <div class="menu-bar">
    <div class="menu-content">
<span id="scroll" >
      <!-- Menu Toggle -->
       <span style="display: flex;">
      <button class="menu-toggle" type="button"
        (mouseenter)="!isMobile() && toggleMenuDropdown()"
        (click)="isMobile() && toggleMenuDropdown()"
        [attr.aria-expanded]="menuDropdownVisible">
        <span class="menu-toggle-label">{{ 'MENU.PRODUCT_LIST' | translate }}</span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 18C3.71667 18 3.47934 17.904 3.288 17.712C3.09667 17.52 3.00067 17.2827 3 17C2.99934 16.7173 3.09534 16.48 3.288 16.288C3.48067 16.096 3.718 16 4 16H20C20.2833 16 20.521 16.096 20.713 16.288C20.905 16.48 21.0007 16.7173 21 17C20.9993 17.2827 20.9033 17.5203 20.712 17.713C20.5207 17.9057 20.2833 18.0013 20 18H4ZM4 13C3.71667 13 3.47934 12.904 3.288 12.712C3.09667 12.52 3.00067 12.2827 3 12C2.99934 11.7173 3.09534 11.48 3.288 11.288C3.48067 11.096 3.718 11 4 11H20C20.2833 11 20.521 11.096 20.713 11.288C20.905 11.48 21.0007 11.7173 21 12C20.9993 12.2827 20.9033 12.5203 20.712 12.713C20.5207 12.9057 20.2833 13.0013 20 13H4ZM4 8C3.71667 8 3.47934 7.904 3.288 7.712C3.09667 7.52 3.00067 7.28267 3 7C2.99934 6.71733 3.09534 6.48 3.288 6.288C3.48067 6.096 3.718 6 4 6H20C20.2833 6 20.521 6.096 20.713 6.288C20.905 6.48 21.0007 6.71733 21 7C20.9993 7.28267 20.9033 7.52033 20.712 7.713C20.5207 7.90567 20.2833 8.00133 20 8H4Z" fill="white"/>
        </svg>
      </button>
</span>
      <!-- First 5 Menu Items -->
      <div class="menu-items-container">
        <a *ngFor="let category of firstFiveMenuItems" 
           (click)="navigateToCategory(category.id, $event)" 
           class="menu-link"
           style="cursor: pointer;">
          <span *ngIf="currentLang === 'ar'">{{ category.nameAr }}</span>
          <span *ngIf="currentLang === 'en'">{{ category.nameEn }}</span>
        </a>
      </div>

      <!-- Menu Dropdown -->
      <div class="menu-dropdown" *ngIf="menuDropdownVisible" (mouseleave)="!isMobile() && toggleMenuDropdown()">
        <div class="menu-dropdown-content">
          <!-- Categories Section (Left) -->
          <div class="categories-section">
            <div *ngFor="let category of menuCategories" 
                 class="category-item"
                 [class.active]="selectedCategoryId === category.id"
                 (mouseenter)="!isMobile() && selectCategory(category.id)"
                 (click)="handleCategoryClick(category.id, $event)"
                 style="cursor: pointer;">
              <span class="category-label">
                <span *ngIf="currentLang === 'ar'">{{ category.nameAr }}</span>
                <span *ngIf="currentLang === 'en'">{{ category.nameEn }}</span>
              </span>
              <div class="category-icon">
                <img [src]="category.image" [alt]="currentLang === 'ar' ? category.nameAr : category.nameEn" />
              </div>
            </div>
          </div>

          <!-- Menu Items Section (Right) -->
          <div class="menu-items-section">
            <div class="menu-items-grid">
              <a *ngFor="let item of getMenuItemsForCategory()" 
                 [href]="item.link" 
                 class="menu-item-link">
                <span *ngIf="currentLang === 'ar'">{{ item.labelAr }}</span>
                <span *ngIf="currentLang === 'en'">{{ item.labelEn }}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
</span>

    </div>
  </div>
</nav>

      <main class="flex-grow-1">
        <router-outlet></router-outlet>
      </main>

      <footer class="footer-container mt-auto">
        <!-- Top Black Bar -->
        <div class="footer-top-bar"></div>


            <section class="newsletter-section" *ngIf="!isAuthPage">
      <div class="container">
        <div class="newsletter-content">

          <form [formGroup]="newsletterForm" (ngSubmit)="onNewsletterSubmit()" class="newsletter-form">
            <div class="newsletter-input-wrapper">
              <input
                type="email"
                formControlName="email"
                [placeholder]="'LAYOUT.EMAIL_PLACEHOLDER' | translate"
                class="newsletter-input"
                [class.error]="newsletterForm.get('email')?.invalid && newsletterForm.get('email')?.touched"
              />
              <button type="submit" class="newsletter-button" >
                {{ 'LAYOUT.SUBSCRIBE_NOW' | translate }}
              </button>
            </div>
          </form>
            <div class="newsletter-text">
            <h3 class="newsletter-title">{{ 'LAYOUT.NEWSLETTER_TITLE' | translate }}</h3>
            <p class="newsletter-subtitle">{{ 'LAYOUT.NEWSLETTER_SUBTITLE' | translate }}</p>
          </div>
        </div>
      </div>
    </section>
        
        <!-- Main Content Area -->
        <div class="footer-main-content">
      <div class="footer-logo-1">
                <img src="assets/Bashwat-logo.png" alt="Al Bashawat Logo" />
              </div>

          <div class="row">


<div class="col-12 col-md-12 col-sm-12 col-lg-6 col-xl-6 col-xxl-6">

            <div class="footer-column footer-about">
      <div class="footer-logo">
                <img src="assets/Bashwat-logo.png" alt="Al Bashawat Logo" />
              </div>

              <h3 class="footer-heading">{{ 'FOOTER.ABOUT_COMPANY' | translate }}</h3>
              <ul class="footer-links">
                <li><a routerLink="/about">{{ 'NAV.ABOUT' | translate }}</a></li>
                <li><a routerLink="/privacy-policy">{{ 'FOOTER.PRIVACY_POLICY' | translate }}</a></li>
                <li><a routerLink="/help-center">{{ 'FOOTER.HELP_CENTER' | translate }}</a></li>
                <li><a routerLink="/shipping-policy">{{ 'FOOTER.SHIPPING_DELIVERY' | translate }}</a></li>
              </ul>
            </div>
</div>
<div class="col-12 col-md-12 col-sm-12 col-lg-6 col-xl-6 col-xxl-6" style="padding-bottom: 1.5rem !important;">
            <div class="footer-column footer-categories">
              <h3 class="footer-heading">{{ 'FOOTER.CATEGORIES' | translate }}</h3>
              <div class="footer-categories-grid">
                            <ul class="footer-links">
                  <li *ngFor="let category of getSecondHalfCategories()">
                    <a (click)="navigateToCategory(category.id, $event)" style="cursor: pointer;">
                      <span *ngIf="currentLang === 'ar'">{{ category.nameAr }}</span>
                      <span *ngIf="currentLang === 'en'">{{ category.nameEn }}</span>
                    </a>
                  </li>
                </ul>
                <ul class="footer-links">
                  <li *ngFor="let category of getFirstHalfCategories()">
                    <a (click)="navigateToCategory(category.id, $event)" style="cursor: pointer;">
                      <span *ngIf="currentLang === 'ar'">{{ category.nameAr }}</span>
                      <span *ngIf="currentLang === 'en'">{{ category.nameEn }}</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
</div>
<div class="col-12 col-md-12 col-sm-12 col-lg-6 col-xl-6 col-xxl-6">
            <div class="footer-column footer-social">
              <h3 class="footer-heading">{{ 'FOOTER.FOLLOW_US' | translate }}</h3>
              <div class="footer-social-icons">
                <a href="https://web.facebook.com/bashawatqtr" class="footer-social-icon" target="_blank" rel="noopener noreferrer" title="Facebook" (click)="openSocialLink('https://web.facebook.com/bashawatqtr', $event)">
                  <i class="fab fa-facebook-f"></i>
                </a>
                <a href="https://www.instagram.com/bashawatqtr?igsh=amEzdWk1Mnc0OWNu" class="footer-social-icon" target="_blank" rel="noopener noreferrer" title="Instagram" (click)="openSocialLink('https://www.instagram.com/bashawatqtr?igsh=amEzdWk1Mnc0OWNu', $event)">
                  <i class="fab fa-instagram"></i>
                </a>
                <a href="https://www.tiktok.com/@al.bashawat.resta" class="footer-social-icon" target="_blank" rel="noopener noreferrer" title="TikTok" (click)="openSocialLink('https://www.tiktok.com/@al.bashawat.resta', $event)">
                  <i class="fab fa-tiktok"></i>
                </a>
              </div>
            </div>
</div>

<div class="col-12 col-md-12 col-sm-12 col-lg-6 col-xl-6 col-xxl-6">
            <div class="footer-column footer-contact">
        
              <div class="footer-contact-info">
                <div class="footer-contact-item">
                  <i class="fas fa-map-marker-alt"></i>
                  <span>{{ getBranchAddress() }}</span>
                </div>
                <div class="footer-contact-item" *ngIf="currentBranch">
                  <i class="fas fa-phone"></i>
                  <span>{{ getBranchPhone() }}</span>
                </div>
                <div class="footer-contact-item" *ngIf="!currentBranch">
                  <i class="fas fa-phone"></i>
                  <span>{{ 'FOOTER.PHONE_1' | translate }}</span>
                </div>
                <div class="footer-contact-item" *ngIf="!currentBranch">
                  <i class="fas fa-phone"></i>
                  <span>{{ 'FOOTER.PHONE_2' | translate }}</span>
                </div>
                <div class="footer-working-hours">
                  {{ getBranchWorkingHours() }}
                </div>
                <div class="footer-payment-methods">
                  <h4 class="footer-payment-heading">{{ 'FOOTER.PAYMENT_METHODS' | translate }}</h4>
                  <div class="footer-payment-icons">
<svg width="36" height="24" viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_172_8545)">
<path d="M33.6 24H2.4C1.76348 24 1.15303 23.7471 0.702944 23.2971C0.252856 22.847 0 22.2365 0 21.6L0 2.4C0 1.76348 0.252856 1.15303 0.702944 0.702944C1.15303 0.252856 1.76348 0 2.4 0L33.6 0C34.2365 0 34.847 0.252856 35.2971 0.702944C35.7471 1.15303 36 1.76348 36 2.4V21.6C36 22.2365 35.7471 22.847 35.2971 23.2971C34.847 23.7471 34.2365 24 33.6 24ZM17.84 14.762L17.481 17.012C18.3981 17.3994 19.3891 17.5806 20.384 17.543H20.373C21.5387 17.6108 22.693 17.2819 23.648 16.61L23.631 16.621C24.0206 16.3342 24.3374 15.9599 24.5559 15.5283C24.7744 15.0967 24.8885 14.6198 24.889 14.136V14.121C24.889 13.021 24.153 12.108 22.702 11.402C22.3062 11.2107 21.9275 10.9859 21.57 10.73L21.593 10.746C21.493 10.6816 21.4097 10.5943 21.3501 10.4914C21.2904 10.3885 21.2561 10.2728 21.25 10.154V10.152C21.2578 10.0282 21.2967 9.90844 21.3629 9.8036C21.4291 9.69876 21.5206 9.61225 21.629 9.552L21.633 9.55C21.9686 9.35613 22.3543 9.26666 22.741 9.293H22.735H22.815L22.892 9.292C23.536 9.292 24.147 9.431 24.698 9.68L24.67 9.669L24.904 9.794L25.263 7.623C24.5372 7.34058 23.7648 7.19741 22.986 7.201H22.937H22.94C21.8133 7.1519 20.7024 7.47986 19.783 8.133L19.799 8.122C19.4168 8.39157 19.1049 8.74901 18.8897 9.16422C18.6744 9.57944 18.562 10.0403 18.562 10.508V10.513C18.552 11.571 19.314 12.485 20.828 13.233C21.228 13.408 21.573 13.622 21.882 13.879L21.875 13.873C21.964 13.9482 22.0363 14.0411 22.0874 14.1458C22.1386 14.2504 22.1674 14.3646 22.172 14.481V14.485C22.172 14.804 21.982 15.078 21.708 15.201L21.703 15.203C21.403 15.361 21.047 15.453 20.669 15.453H20.623H20.625H20.55C19.693 15.453 18.881 15.263 18.153 14.923L18.188 14.938L17.845 14.766L17.84 14.762ZM27.965 15.903H31.28C31.3333 16.1317 31.4377 16.6317 31.593 17.403H34L31.906 7.372H29.906C29.62 7.34601 29.3332 7.4133 29.0886 7.56381C28.844 7.71432 28.6547 7.93996 28.549 8.207L28.546 8.216L24.706 17.403H27.426L27.972 15.904L27.965 15.903ZM14.891 7.372L13.265 17.403H15.859L17.484 7.372H14.891ZM4.922 9.419L7.032 17.387H9.766L13.841 7.372H11.095L8.561 14.216L8.295 12.825L7.391 8.216C7.34301 7.94992 7.19328 7.713 6.97356 7.55544C6.75385 7.39789 6.48141 7.33209 6.214 7.372L6.22 7.371H2.033L2.002 7.574C5.226 8.393 7.344 10.16 8.298 12.824C8.00594 12.0622 7.55376 11.372 6.972 10.8L6.971 10.799C6.40047 10.2131 5.71794 9.74785 4.964 9.431L4.924 9.416L4.922 9.419ZM30.859 13.84H28.699C28.845 13.4547 29.189 12.5213 29.731 11.04L29.777 10.899L29.937 10.493C30.0017 10.3263 30.0483 10.191 30.077 10.087L30.265 10.946L30.858 13.836L30.859 13.84Z" fill="black"/>
</g>
<defs>
<clipPath id="clip0_172_8545">
<rect width="36" height="24" fill="white"/>
</clipPath>
</defs>
</svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>


        </div>
        <!-- Bottom Dark Red Bar -->
        <div class="footer-bottom-bar">
          <div class="footer-bottom-content">
            <div class="footer-powered-by">{{ 'LAYOUT.POWERED_BY' | translate }}</div>
            <div class="footer-copyright">{{ 'FOOTER.COPYRIGHT_FULL' | translate }}</div>
          </div>
        </div>
      </footer>

  `,
  styles: [`
    .navbar-brand {
      color: white !important;
      text-decoration: none;
      font-weight: bold;
      font-size: 1.2rem;
    }
    .navbar-brand:hover {
      color: rgba(255, 255, 255, 0.8) !important;
    }
    .nav-link.active {
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
    }
    .btn-link {
      padding: 0.25rem 0.5rem;
    }
    .btn-link:hover {
      opacity: 0.8;
    }
    /* RTL Support for Bootstrap */
    body.rtl .navbar-nav {
      flex-direction: row-reverse;
    }
    body.rtl .d-flex.gap-2 {
      flex-direction: row-reverse;
    }

    /* Navbar Container */
.navbar-container {
  width: 100%;
  font-family: 'Arial', sans-serif;
}

/* RTL Support for Navbar Container */
body.rtl .navbar-container,
html[dir="rtl"] .navbar-container {
  direction: rtl;
}

/* Top Bar */
.top-bar {
  background-image: url('../../assets/5sm.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  color: white;
  padding: 8px 0;
  font-size: 13px;
}

.top-bar-content {
  // max-width: 1400px;
  margin: 0 2.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  font-family: 'Almarai', sans-serif;
  font-weight: 700;
  font-style: normal;
  font-size: 12px;
  line-height: 100%;
  letter-spacing: 0%;
  vertical-align: middle;
}

/* RTL Support for Top Bar */
body.rtl .top-bar-content {
  flex-direction: row-reverse;
}

body.rtl .top-bar-right {
  order: 3;
}

body.rtl .top-bar-left {
  order: 2;
}

body.rtl .social-icons {
  order: 1;
}

.top-bar-right {
  display: flex;
  gap: 15px;
  align-items: center;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.divider {
  color: rgba(255, 255, 255, 0.5);
}

.top-bar-left {
  flex: 1;
  text-align: center;
}

.discount-text {
  padding: 4px 12px;
  border-radius: 4px;
  font-weight: bold;
}

.social-icons {
  display: flex;
  gap: 10px;
}

.social-icon {
  color: white;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: opacity 0.3s;
  font-size: 18px;
}

.social-icon:hover {
  opacity: 0.8;
}

.social-icon i {
  font-size: 18px;
}

/* Main Navbar */
.main-navbar {
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 12px 0;
}

.navbar-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  gap: 20px;
}

/* RTL Support for Navbar Content */
body.rtl .navbar-content,
html[dir="rtl"] .navbar-content,
.navbar-container[dir="rtl"] .navbar-content {
  flex-direction: row-reverse !important;
  direction: rtl;
}

/* Navbar Right */
.navbar-right {
  display: flex;
  gap: 15px;
  align-items: center;
}

/* RTL: Icons move to left, Logo moves to right */
body.rtl .navbar-right,
html[dir="rtl"] .navbar-right {
  order: 1;
}

body.rtl .navbar-left,
html[dir="rtl"] .navbar-left {
  order: 3;
}

body.rtl .navbar-center,
html[dir="rtl"] .navbar-center {
  order: 2;
}

.cart-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  transition: opacity 0.3s;
}

.cart-button:hover {
  opacity: 0.8;
}

.cart-icon-wrapper {
  position: relative;
  width: 40px;
  height: 40px;
  background-color: #FFD700;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cart-icon-wrapper svg {
  width: 24px;
  height: 24px;
  display: block;
}

.cart-badge {
  position: absolute;
  top: -5px;
  left: -5px;
  background-color: #DC2626;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: bold;
  border: 2px solid white;
}

.wallet-amount {
  font-weight: 700;
  color: #000;
  font-size: 14px;
}

.user-menu-wrapper {
  position: relative;
  display: inline-block;
}

.user-button {
  background-color: transparent;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
}

.user-menu-btn {
  color: #333;
  transition: background-color 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-button:hover {
  background-color: #E8E8E8;
}

.user-name {
  font-family: 'Almarai', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.logout-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 4px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  min-width: 120px;
  overflow: hidden;
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.logout-button {
  width: 100%;
  padding: 12px 16px;
  background-color: transparent;
  border: none;
  text-align: right;
  cursor: pointer;
  font-family: 'Almarai', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #F00E0C;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.logout-button:hover {
  background-color: #F5F5F5;
}

.language-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: transparent;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.language-button:hover {
  background-color: #F5F5F5;
}

.flag-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  min-width: 28px;
  min-height: 28px;
}

.flag-icon svg {
  width: 28px;
  height: 28px;
  display: block;
  flex-shrink: 0;
}

.flag-emoji {
  font-size: 24px;
  display: inline-block;
  line-height: 1;
  font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji', 'EmojiOne Color', 'Android Emoji', 'Twemoji Mozilla', 'Noto Emoji', sans-serif !important;
  vertical-align: middle;
  font-style: normal;
  font-weight: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

/* Navbar Center */
.navbar-center {
  display: flex;
  flex: 1;
  gap: 15px;
  align-items: center;
  justify-content: center;
  position: relative;
}

.search-wrapper {
  display: flex;
  align-items: center;
  position: relative;
}

.search-input-container {
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 25px;
  padding: 8px 12px;
  min-width: 300px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.search-input-container:focus-within {
  border-color: #d32f2f;
  box-shadow: 0 2px 8px rgba(211, 47, 47, 0.2);
  background-color: #fff;
}

.search-input {
  border: none;
  background: transparent;
  padding: 4px 8px;
  flex: 1;
  outline: none;
  font-size: 14px;
  font-family: 'Almarai', sans-serif;
  color: #333;
  min-width: 0;
}

.search-input::placeholder {
  color: #999;
}

.search-submit-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #d32f2f;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
  padding: 0;
  color: white;
  min-width: 32px;
}

.search-submit-button:hover:not(:disabled) {
  background-color: #b71c1c;
  transform: scale(1.05);
}

.search-submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}


.search-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  display: inline-block;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.search-toggle-button {
  background: transparent;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  border-radius: 50%;
}

.search-toggle-button:hover {
  background-color: #f5f5f5;
  color: #d32f2f;
}

.search-toggle-button svg {
  display: block;
}

.search-results-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  min-width: 400px;
  max-width: 500px;
  max-height: 500px;
  overflow-y: auto;
  animation: fadeIn 0.2s ease-in-out;
}

.search-results-dropdown::-webkit-scrollbar {
  width: 8px;
}

.search-results-dropdown::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.search-results-dropdown::-webkit-scrollbar-thumb {
  background: #d32f2f;
  border-radius: 10px;
}

.search-result-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid #f0f0f0;
}

.search-result-item:last-child {
  border-bottom: none;
}

.search-result-item:hover {
  background-color: #f9f9f9;
}

.search-result-image {
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
  background-color: #f5f5f5;
}

.search-result-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.search-result-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.search-result-name {
  font-family: 'Almarai', sans-serif;
  font-weight: 700;
  font-size: 16px;
  color: #333;
  line-height: 1.3;
}

.search-result-category {
  font-family: 'Almarai', sans-serif;
  font-weight: 400;
  font-size: 14px;
  color: #666;
}

.search-result-price {
  font-family: 'Almarai', sans-serif;
  font-weight: 700;
  font-size: 16px;
  color: #d32f2f;
}

.search-no-results {
  padding: 24px;
  text-align: center;
}

.search-no-results-message {
  font-family: 'Almarai', sans-serif;
  font-size: 14px;
  color: #666;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.search-button {
  background: transparent;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-button svg {
  display: block;
}

.download-badge {
  background-color: #0EA5E9;
  color: white;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  border-radius: 4px;
  font-weight: bold;
  font-size: 14px;
}

.download-icon {
  font-size: 16px;
}

.download-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: transparent;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.3s;
  font-family: 'Almarai', sans-serif;
  font-weight: 700;
  font-size: 16px;
  line-height: 100%;
  vertical-align: middle;
}

.download-button:hover {
  background-color: #F5F5F5;
}

.download-button i {
  font-size: 16px;
  vertical-align: middle;
}

.location-dropdown {
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: #ECECEC;
  border: none;
  width: 254px;
  height: 40px;
  padding: 8px 14px;
  border-radius: 25px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.3s;
  box-shadow: 0px 5.18px 6.91px 0px #0000001A;
  opacity: 1;
}

.location-dropdown:hover {
  background-color: #E0E0E0;
  box-shadow: 0px 5.18px 6.91px 0px #0000001A;
}

.location-dropdown .location-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.location-dropdown .chevron-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.location-dropdown span {
  font-family: Almarai, sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: 12px;
  line-height: 100%;
  letter-spacing: 0%;
  color: #333;
  flex: 1;
  text-align: right;
}

/* Navbar Left */
.navbar-left {
  display: flex;
  align-items: center;
}

.logo {
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.logo:hover {
  opacity: 0.8;
}

.logo img {
  height: 86px;
  width: auto;
}

/* Menu Bar */
.menu-bar {
  background-color: #DC2626;
  color: white;
}

.menu-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  padding: 0 50px;
  position: relative;
  justify-content: space-between;
}

@media (max-width: 767px) {
  .menu-content {
    padding: 0;
  }
}

.menu-bar {
  position: relative;
}

/* Arabic (LTR) - menu toggle on right, items on right */
html[dir="ltr"] .menu-content,
body.ltr .menu-content {
  justify-content: space-between;
}

html[dir="ltr"] .menu-toggle,
body.ltr .menu-toggle {
  margin-left: auto;
  margin-right: 0;
  order: 2;
}

html[dir="ltr"] .menu-items-container,
body.ltr .menu-items-container {
  order: 1;
}

/* English (RTL) - menu toggle on right, items on left */
html[dir="rtl"] .menu-content,
body.rtl .menu-content {
  justify-content: space-between;
}

html[dir="rtl"] .menu-toggle,
body.rtl .menu-toggle {
  margin-left: auto;
  margin-right: 0;
  order: 2;
}

html[dir="rtl"] .menu-items-container,
body.rtl .menu-items-container {
  order: 1;
}

.menu-toggle {
  background: transparent;
  border: none;
  color: white;
  padding: 12px 15px;
  cursor: pointer;
  font-size: 20px;
  margin-left: auto;
  order: 2;
  display: flex;
  align-items: center;
  gap: 8px;
}

.menu-toggle-label {
  font-family: Almarai, sans-serif;
  font-weight: 700;
  font-style: normal;
  font-size: 16px;
  line-height: 100%;
  letter-spacing: 0%;
  white-space: nowrap;
}

.menu-items {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 5px;
  flex: 1;
}

.menu-item {
  position: relative;
}

.menu-items-container {
  display: flex;
  align-items: center;
  gap: 5px;
  flex: 1;
  justify-content: flex-end;
  order: 1;
}

.menu-link {
  display: flex;
  align-items: center;
  gap: 6px;
  color: white;
  text-decoration: none;
  padding: 12px 18px;
  white-space: nowrap;
  transition: background-color 0.3s;
  font-family: Almarai, sans-serif;
  font-weight: 700;
  font-style: normal;
  font-size: 16px;
  line-height: 100%;
  letter-spacing: 0%;
}

.menu-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

/* Menu Dropdown Styling */
.menu-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  width: 1060px;
  height: 557px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  border-radius: 8px;
  overflow: hidden;
  border-top: 3px solid #DC2626;
  padding-top: 28px;
  padding-right: 16px;
  padding-bottom: 28px;
  padding-left: 16px;
  box-sizing: border-box;
  margin-top: 0;
}

.menu-dropdown-content {
  display: flex;
  flex-direction: row-reverse;
  height: 100%;
  gap: 10px;
}

/* Categories Section (Left) */
.categories-section {
  width: 352px;
  height: 100%;
  background-color: #F5F5F5;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  gap: 0;
  padding: 0;
}

.category-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.3s;
  background-color: white;
  border-radius: 0;
  border-bottom: 1px solid #E0E0E0;
  direction: ltr;
}

.category-item:hover {
  background-color: #F9F9F9;
}

.category-item.active {
  background-color: #FFF9C4;
}

.category-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.category-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.category-label {
  font-family: Alexandria, sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: 16px;
  line-height: 100%;
  letter-spacing: 0%;
  text-align: right;
  color: #333;
  flex: 1;
}

/* Menu Items Section (Right) */
.menu-items-section {
  flex: 1;
  padding: 0;
  background-color: white;
  overflow-y: auto;
  height: 100%;
}

.menu-items-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-start;
}

.menu-item-link {
  display: block;
  color: #666;
  text-decoration: none;
  padding: 10px 15px;
  font-family: Alexandria, sans-serif;
  font-weight: 300;
  font-style: normal;
  font-size: 16px;
  line-height: 19.2px;
  letter-spacing: 0%;
  text-align: right;
  vertical-align: middle;
  transition: color 0.3s;
  border-radius: 4px;
  width: 100%;
}

.menu-item-link:hover {
  color: #DC2626;
  background-color: #F9F9F9;
}





/* Icons - Using Unicode and CSS for non-PrimeNG icons */
.icon-phone::before { content: "☎"; }
.icon-cart::before { content: "🛒"; }
.icon-user::before { content: "👤"; }
.icon-search::before { content: "🔍"; }
.icon-download::before { content: "⬇"; }
.icon-location::before { content: "📍"; }
.icon-chevron::before { content: "▼"; font-size: 10px; }
.icon-menu::before { content: "☰"; }
.icon-gift::before { content: "🎁"; }
.icon-breakfast::before { content: "🍳"; }
.icon-appetizer::before { content: "🥗"; }
.icon-pasta::before { content: "🍝"; }
.icon-sandwich::before { content: "🥪"; }
.icon-vegetables::before { content: "🥬"; }
.icon-soup::before { content: "🍲"; }
.icon-grill::before { content: "🍖"; }

/* PrimeNG Icons Styling */
.social-icon {
  font-size: 18px;
}

.social-icon .pi {
  font-size: 18px;
  display: inline-block;
  font-family: 'primeicons' !important;
  speak: none;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Hamburger Button */
.hamburger-btn {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: background-color 0.2s;
  flex-shrink: 0;
}

.hamburger-btn:hover {
  background-color: #f5f5f5;
}

.hamburger-line {
  display: block;
  width: 24px;
  height: 2px;
  background-color: #333;
  border-radius: 2px;
  transition: all 0.3s;
}

/* Mobile Drawer */
.mobile-menu-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  z-index: 9998;
  opacity: 0;
  transition: opacity 0.3s;
}

.mobile-menu-overlay.active {
  display: block;
  opacity: 1;
}

.mobile-drawer {
  position: fixed;
  top: 0;
  right: -320px;
  width: 300px;
  height: 100%;
  background: white;
  z-index: 9999;
  transition: right 0.3s ease;
  display: flex;
  flex-direction: column;
  box-shadow: -4px 0 20px rgba(0,0,0,0.2);
  overflow-y: auto;
}

.mobile-drawer.open {
  right: 0;
}

.mobile-drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  background: #fff;
  position: sticky;
  top: 0;
  z-index: 1;
}

.mobile-drawer-logo {
  height: 50px;
  width: auto;
}

.mobile-drawer-close {
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #666;
  padding: 8px;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.mobile-drawer-close:hover {
  background-color: #f5f5f5;
}

.mobile-drawer-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
}

.mobile-user-section {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f9f9f9;
  border-radius: 10px;
}

.mobile-user-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: none;
  cursor: pointer;
  font-family: 'Almarai', sans-serif;
  font-size: 15px;
  color: #333;
  flex: 1;
}

.mobile-user-menu-btn {
  color: #333;
  width: 40px;
  height: 40px;
}

.mobile-logout-btn {
  background: transparent;
  border: 1px solid #d32f2f;
  color: #d32f2f;
  font-family: 'Almarai', sans-serif;
  font-size: 13px;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  white-space: nowrap;
}

.mobile-location {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: #ececec;
  border-radius: 25px;
  cursor: pointer;
  font-family: 'Almarai', sans-serif;
  font-size: 13px;
  color: #333;
}

.mobile-nav-section-title {
  font-family: 'Almarai', sans-serif;
  font-weight: 700;
  font-size: 14px;
  color: #d32f2f;
  border-bottom: 2px solid #d32f2f;
  padding-bottom: 6px;
}

.mobile-categories-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-height: 300px;
  overflow-y: auto;
}

.mobile-category-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  text-decoration: none;
  color: #333;
  font-family: 'Almarai', sans-serif;
  font-size: 14px;
  transition: background-color 0.2s;
}

.mobile-category-link:hover {
  background-color: #fff3f3;
  color: #d32f2f;
}

.mobile-cat-img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.mobile-bottom-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-top: 1px solid #f0f0f0;
  margin-top: auto;
}

.mobile-lang-btn {
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 8px 16px;
  font-family: 'Almarai', sans-serif;
  font-size: 14px;
  cursor: pointer;
  color: #333;
}

.mobile-social-icons {
  display: flex;
  gap: 12px;
}

.mobile-social-icon {
  color: #333;
  font-size: 18px;
  text-decoration: none;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #f5f5f5;
  transition: background-color 0.2s;
}

.mobile-social-icon:hover {
  background: #d32f2f;
  color: white;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .navbar-center {
    flex-wrap: wrap;
  }
  
  .search-input-container {
    min-width: 250px;
  }

  .search-results-dropdown {
    min-width: 350px;
    max-width: 400px;
  }
}

@media (max-width: 992px) {
  .top-bar-right {
    font-size: 12px;
    gap: 10px;
  }
  
  .menu-items {
    overflow-x: auto;
  }
  
  .location-dropdown span {
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .download-button span {
    display: none;
  }
  
  .logo img {
    height: 64px;
  }
}

@media (max-width: 768px) {
  .top-bar {
    display: none;
  }
  
  .hamburger-btn {
    display: flex;
    order: 0;
  }
  
  .navbar-content {
    flex-wrap: nowrap;
    gap: 8px;
    padding: 0 12px;
  }
  
  .navbar-right {
    gap: 6px;
  }
  
  .user-button {
    padding: 6px;
  }
  
  .user-name {
    display: none;
  }
  
  .language-button span:last-child {
    display: none;
  }
  
  .language-button {
    padding: 6px;
  }
  
  .navbar-center {
    display: none;
  }
  
  .logo img {
    height: 52px;
  }
  
  .wallet-amount {
    display: none;
  }
  
  .menu-items {
    display: none;
  }
  
  .menu-toggle {
    display: block;
  }
  
  .menu-items-container {
    display: none;
  }
  
  .menu-toggle-label {
    font-size: 13px;
  }
  
  .menu-dropdown {
    width: calc(100vw - 20px);
    right: 10px;
    height: auto;
    max-height: 80vh;
    overflow-y: auto;
  }

  .menu-dropdown-content {
    flex-direction: row-reverse;
  }

  .categories-section {
    width: 100%;
    height: auto;
    flex-direction: column;
    flex-wrap: nowrap;
    overflow-x: unset;
    overflow-y: auto;
  }

  .category-item {
    flex-direction: row;
    width: 100%;
    gap: 16px;
    padding: 10px;
  }

  .menu-items-section {
    display: none;
  }

  .search-input-container {
    min-width: 200px;
    width: 100%;
  }

  .search-results-dropdown {
    min-width: calc(100vw - 40px);
    max-width: calc(100vw - 40px);
    right: 20px;
    left: 20px;
  }
}

@media (max-width: 480px) {
  .top-bar-hide-mobile {
    display: none;
  }
  
  .navbar-content {
    padding: 0 8px;
  }
}

/* Footer Styles */
.footer-container {
  width: 100%;
  font-family: 'Almarai', sans-serif;
}

.footer-top-bar {
  width: 100%;
  height: 4px;
}

.footer-main-content {
  background-image: url('../../assets/Frame_1321315894.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 40px 20px;
}

.footer-content-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr 1.5fr 2fr;
  gap: 40px;
  align-items: start;
}

.footer-column {
  display: flex;
  flex-direction: column;
  align-items: end;
}

.footer-heading {
  color: #DC2626;
  font-family: 'Almarai', sans-serif;
  font-weight: 700;
  font-size: 18px;
  margin-bottom: 20px;
  line-height: 1.2;
}

.footer-social-icons {
  display: flex;
  gap: 15px;
  flex-direction: row;
}

.footer-social-icon {
  color: #000000;
  font-size: 24px;
  text-decoration: none;
  transition: opacity 0.3s;
  display: inline-block;
}

.footer-social-icon:hover {
  opacity: 0.7;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: end;
}

.footer-links li {
  margin: 0;
}

.footer-links a {
  color: #5C4033;
  text-decoration: none;
  font-size: 16px;
  transition: color 0.3s;
  display: block;
}

.footer-links a:hover {
  color: #DC2626;
}

.footer-categories-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.footer-contact {
  align-items: flex-end;
  text-align: right;
}

.footer-logo {
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-end;
}

.footer-logo img {
  width: 100px;
  height: 93px;
  object-fit: contain;
  border-radius: 50%;
  padding: 8px;
  display: block;
}

.footer-contact-info {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.footer-contact-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  color: #5C4033;
  font-size: 14px;
  line-height: 1.5;
  justify-content: flex-start;
  flex-direction: row-reverse;
}

.footer-contact-item i {
  color: #000000;
  font-size: 16px;
  margin-top: 2px;
  flex-shrink: 0;
}

.footer-working-hours {
  color: #5C4033;
  font-size: 14px;
  line-height: 1.5;
  margin-top: 5px;
  text-align: right;
}

.footer-payment-methods {
  margin-top: 20px;
  text-align: right;
}

.footer-payment-heading {
  color: #DC2626;
  font-family: 'Almarai', sans-serif;
  font-weight: 700;
  font-size: 16px;
  margin-bottom: 12px;
}

.footer-payment-icons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.payment-icon {
  padding: 8px 16px;
  background-color: #FFFFFF;
  border: 1px solid #DDD;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  color: #333;
  text-align: center;
  min-width: 80px;
}

.payment-icon.visa {
  background-color: #1A1F71;
  color: #FFFFFF;
}

.payment-icon.mastercard {
  background-color: #EB001B;
  color: #FFFFFF;
}

.footer-bottom-bar {
  background: radial-gradient(53.69% 53.69% at 50% 46.31%, #A12628 0%, #551314 100%);
  padding: 15px 20px;
}

.footer-bottom-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #FFFFFF;
  font-size: 14px;
}

.footer-powered-by {
  font-weight: 400;
}

.footer-copyright {
  font-weight: 400;
}

/* RTL Support for Footer */
body.rtl .footer-content-wrapper,
html[dir="rtl"] .footer-content-wrapper {
  direction: rtl;
}

body.rtl .footer-bottom-content,
html[dir="rtl"] .footer-bottom-content {
  flex-direction: row-reverse;
}

/* Responsive Footer */
@media (max-width: 1200px) {
  .footer-content-wrapper {
    grid-template-columns: 1fr 1fr;
    gap: 30px;
  }
  
  .footer-contact {
    grid-column: 1 / -1;
  }
}

@media (max-width: 768px) {
  .footer-main-content {
    padding: 24px 16px;
  }
  
  .footer-content-wrapper {
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
  
  .footer-contact {
    grid-column: 1 / -1;
  }
  
  .footer-categories-grid {
    grid-template-columns: 1fr 1fr;
  }
  
  .footer-bottom-content {
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }
  
  .footer-heading {
    font-size: 15px;
    margin-bottom: 12px;
  }
  
  .footer-links a {
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .footer-content-wrapper {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .footer-categories-grid {
    grid-template-columns: 1fr 1fr;
  }
  
  .footer-social-icons {
    justify-content: flex-start;
  }
}

/* Newsletter Section */
.newsletter-section {
  padding: 1.5rem;
  background-color: #FDC55E26;
  margin: 2rem;
}

.newsletter-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  flex-wrap: wrap;
}

.newsletter-text {
  flex: 1;
  min-width: 300px;
  text-align: right;
}

.newsletter-title {
  font-family: 'Almarai', sans-serif;
  font-weight: 700;
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.newsletter-subtitle {
  font-family: 'Almarai', sans-serif;
  font-weight: 400;
  font-size: 1rem;
  color: #666;
  margin: 0;
}

.newsletter-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: stretch;
}

.newsletter-input-wrapper {
  position: relative;
  width: 100%;
}

.newsletter-input {
  width: 100%;
  max-width: 522px;
  height: 72px;
  padding: 16px;
  padding-left: 200px;
  border: 1px solid #ddd;
  border-radius: 15px;
  font-size: 1.25rem;
  font-family: 'Almarai', sans-serif;
  background-color: #F5EDED;
  direction: rtl;
  text-align: right;
  opacity: 1;
}

.newsletter-input:focus {
  outline: none;
  border-color: #d32f2f;
  box-shadow: 0 0 0 2px rgba(211, 47, 47, 0.1);
}

.newsletter-input.error {
  border-color: #d32f2f;
}

.newsletter-input::placeholder {
  font-family: 'Almarai', sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: 16px;
  line-height: 100%;
  letter-spacing: 0%;
  text-align: right;
  direction: rtl;
  color: #999;
}

.newsletter-button {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 183px;
  height: 40px;
  padding: 12px 10px;
  background-color: #d32f2f;
  color: white;
  border: 1px solid transparent;
  border-radius: 100px;
  font-size: 1rem;
  font-weight: 700;
  font-family: 'Almarai', sans-serif;
  cursor: pointer;
  transition: background-color 0.3s ease;
  white-space: nowrap;
  z-index: 1;
  opacity: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.newsletter-button:hover:not(:disabled) {
  background-color: #b71c1c;
}

.newsletter-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .newsletter-section {
    margin: 1rem;
    padding: 1.25rem;
  }
  
  .newsletter-content {
    flex-direction: column;
    text-align: center;
  }
  
  .newsletter-text {
    text-align: center;
    min-width: unset;
  }
  
  .newsletter-title {
    font-size: 1.1rem;
  }
  
  .newsletter-form {
    width: 100%;
    flex-direction: column;
  }
  
  .newsletter-input-wrapper {
    width: 100%;
  }
  
  .newsletter-input {
    width: 100%;
    max-width: 100%;
    height: 60px;
    padding: 1rem 1rem 1rem 160px;
    font-size: 0.9rem;
  }
  
  .newsletter-button {
    width: 150px;
    height: 36px;
    padding: 8px 10px;
    font-size: 0.85rem;
    background-color: #F00E0C;
    border-radius: 100px;
    border: 1px solid transparent;
    left: 8px;
  }
}

@media (max-width: 480px) {
  .newsletter-input {
    padding-left: 130px;
    font-size: 0.8rem;
    height: 55px;
  }
  
  .newsletter-button {
    width: 120px;
    font-size: 0.78rem;
    left: 6px;
  }
  
  .newsletter-title {
    font-size: 1rem;
  }
}

  `]
})
export class PublicLayoutComponent implements OnInit, OnDestroy {
  cart$: Observable<Cart>;
  cartItemCount$: Observable<number>;
  currentLang: string = 'en';
  isSearchOpen = false;
  newsletterForm!: FormGroup;
  isAuthPage = false;
  currentBranch: Branch | null = null;
  branches: Branch[] = [];
  private routerSubscription?: Subscription;
  searchResults: Product[] = [];
  searchTerm: string = '';
  showSearchResults: boolean = false;
  isSearching: boolean = false;

  menuItems: any[] = [
    // { label: 'قائمة المنتجات', link: '#', icon: 'menu' },
    {
      label: 'عروض الشبوات', link: '#', subItems: [
        { label: 'عرض 1', link: '#' },
        { label: 'عرض 2', link: '#' }
      ]
    },
    // { label: 'عروض الشبوات', link: '#', icon: 'gift' },
    {
      label: 'المقبلات', link: '#', subItems: [
        { label: 'مقبلات ساخنة', link: '#' },
        { label: 'مقبلات باردة', link: '#' }
      ]
    },
    { label: 'مين بيتزا', link: '#' },
    { label: 'الباستا', link: '#' },
    { label: 'الساندويشات', link: '#' },
    { label: 'الافطار', link: '#' }
  ];

  // Menu categories with menu items - loaded from API
  menuCategories: Array<{
    id: number;
    nameAr: string;
    nameEn: string;
    image: string;
    menuItems: Array<{ labelAr: string; labelEn: string; link: string }>;
  }> = [];

  selectedCategoryId: number | null = null;
  menuDropdownVisible = false;
  isMobileMenuOpen = false;
  currentLocation: string = '';
  currentUser: User | null = null;
  isAuthenticated: boolean = false;
  readonly UserRole = UserRole;
  private authSubscription?: Subscription;

  navigateToAdminDashboard(): void {
    this.router.navigate(['/admin/dashboard']);
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (this.isMobileMenuOpen) {
      this.document.body.style.overflow = 'hidden';
    } else {
      this.document.body.style.overflow = '';
    }
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
    this.document.body.style.overflow = '';
  }

  get firstFiveMenuItems() {
    return this.menuCategories.slice(0, 5);
  }

  toggleMenuDropdown() {
    this.menuDropdownVisible = !this.menuDropdownVisible;
  }

  selectCategory(categoryId: number) {
    this.selectedCategoryId = categoryId;
  }

  isMobile(): boolean {
    console.log(window.innerWidth);
    return window.innerWidth <= 768;
  }

  handleCategoryClick(categoryId: number, event: Event): void {
    if (this.isMobile()) {
      // On mobile: just navigate, don't show products
      this.navigateToCategory(categoryId);
    } else {
      // On desktop: select category to show products (hover already handles this)
      // Click still navigates as fallback
      this.navigateToCategory(categoryId);
    }
  }

  getMenuItemsForCategory() {
    const category = this.menuCategories.find(c => c.id === this.selectedCategoryId);
    return category ? category.menuItems : [];
  }

  loadMenuCategories(): void {
    // Fetch categories with products from API (uses cache if available)
    this.categoryService.getCategoriesWithProducts().pipe(
      catchError(error => {
        console.error('Error loading categories with products:', error);
        // Fallback to empty array on error
        return of([]);
      })
    ).subscribe((categories: CategoryWithProducts[]) => {
      // Filter only active categories
      const activeCategories = categories.filter(category => category.isActive);

      // Transform API data to match the current structure
      this.menuCategories = activeCategories.map(category => {
        // Transform products to menuItems format
        const menuItems = (category.products || []).map((product: any) => ({
          labelAr: product.nameAr || '',
          labelEn: product.nameEn || '',
          link: `/menu?category=${category.id}&product=${product.id}`
        }));

        return {
          id: category.id,
          nameAr: category.nameAr || '',
          nameEn: category.nameEn || '',
          image: category.imageUrl || `assets/itmes/${category.nameAr || category.nameEn || 'default'}.png`,
          menuItems: menuItems
        };
      });

      // Set default selected category if available
      if (this.menuCategories.length > 0 && !this.selectedCategoryId) {
        this.selectedCategoryId = this.menuCategories[0].id;
      }
    });
  }

  navigateToCategory(categoryId: number, event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.router.navigate(['/menu'], { queryParams: { category: categoryId } }).then(() => {
      // Scroll to top smoothly after navigation completes
      // Use window.scrollTo with smooth behavior
      setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      }, 50);
      this.menuDropdownVisible = false; // Close dropdown after navigation
    });
  }

  getFirstHalfCategories(): any[] {
    const midPoint = Math.ceil(this.menuCategories.length / 2);
    return this.menuCategories.slice(0, midPoint);
  }

  getSecondHalfCategories(): any[] {
    const midPoint = Math.ceil(this.menuCategories.length / 2);
    return this.menuCategories.slice(midPoint);
  }

  toggleSearch() {
    if (this.isSearchOpen) {
      this.closeSearch();
    } else {
      this.isSearchOpen = true;
      setTimeout(() => {
        const input = document.querySelector('.search-input') as HTMLInputElement;
        if (input) {
          input.focus();
        }
      }, 100);
    }
  }

  onSearch(event: Event) {
    // Only update the search term, don't trigger API call
    const searchTerm = (event.target as HTMLInputElement).value;
    this.searchTerm = searchTerm;
    // Clear results while typing
    if (searchTerm.length === 0) {
      this.searchResults = [];
      this.showSearchResults = false;
    }
  }

  onSearchFocus() {
    // Show existing results if available
    if (this.searchTerm.length > 0 && this.searchResults.length > 0) {
      this.showSearchResults = true;
    }
  }

  onSearchBlur() {
    // Delay to allow click events on results
    setTimeout(() => {
      // Check if user clicked outside search area
      const activeElement = document.activeElement;
      const searchWrapper = document.querySelector('.search-wrapper');

      // If focus moved outside search area and not on results, close search
      if (activeElement && searchWrapper && !searchWrapper.contains(activeElement)) {
        // Check if clicked on search results
        const searchResults = document.querySelector('.search-results-dropdown');
        if (!searchResults || !searchResults.contains(activeElement)) {
          // Close search and return to original state
          this.closeSearch();
        }
      } else if (!this.searchTerm || this.searchTerm.trim().length === 0) {
        this.showSearchResults = false;
      }
    }, 200);
  }

  closeSearch(): void {
    this.isSearchOpen = false;
    this.searchResults = [];
    this.searchTerm = '';
    this.showSearchResults = false;
    this.isSearching = false;
  }

  onSearchClick(): void {
    // Trigger search when button is clicked or Enter is pressed
    if (this.searchTerm && this.searchTerm.trim().length > 0) {
      this.performSearch(this.searchTerm.trim());
    } else {
      this.searchResults = [];
      this.showSearchResults = false;
    }
  }

  performSearch(query: string): void {
    if (!query || query.trim().length === 0) {
      this.searchResults = [];
      this.isSearching = false;
      this.showSearchResults = false;
      return;
    }

    this.isSearching = true;
    this.showSearchResults = true;

    this.productService.searchProducts(query).pipe(
      catchError(error => {
        console.error('Search error:', error);
        this.isSearching = false;
        this.searchResults = [];
        return of([]);
      })
    ).subscribe(results => {
      this.searchResults = results;
      this.isSearching = false;
      this.showSearchResults = true;
    });
  }

  selectSearchResult(product: Product): void {
    this.router.navigate(['/item', product.id]).then(() => {
      this.closeSearch();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  onCartClick() {
    this.router.navigate(['/cart']);
  }

  onUserClick() {
    // If not logged in, navigate to login page
    if (!this.isAuthenticated) {
      this.router.navigate(['/login']);
    }
    // If logged in, do nothing (hover will show logout)
  }

  onLogout() {
    this.authService.logout();
    // Optionally navigate to home
    this.router.navigate(['/']);
  }

  getUserDisplayName(): string {
    if (!this.currentUser) {
      return 'User';
    }
    if (this.currentUser.firstName) {
      return this.currentUser.firstName;
    }
    if (this.currentUser.name) {
      return this.currentUser.name;
    }
    return 'User';
  }

  onLanguageChange() {
    const newLang = this.currentLang === 'ar' ? 'en' : 'ar';
    this.setLanguage(newLang);
  }

  constructor(
    private cartService: CartService,
    private translationService: TranslationService,
    private translate: TranslateService,
    @Inject(DOCUMENT) private document: Document,
    private fb: FormBuilder,
    private router: Router,
    private viewportScroller: ViewportScroller,
    private dialog: MatDialog,
    private categoryService: CategoryService,
    private authService: AuthService,
    private branchService: BranchService,
    private productService: ProductService,
    private cdr: ChangeDetectorRef
  ) {
    this.cart$ = this.cartService.cart$;
    this.cartItemCount$ = this.cart$.pipe(
      map(cart => cart.items.reduce((sum, item) => sum + item.quantity, 0))
    );

    this.currentLang = this.translationService.getCurrentLanguage();
    this.updateDirection(this.currentLang);

    this.translate.onLangChange.subscribe(event => {
      this.currentLang = event.lang;
      this.updateDirection(event.lang);
      this.cdr.detectChanges();
    });
  }

  ngOnInit(): void {
    // Initialize newsletter form
    this.newsletterForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    // Subscribe to authentication state
    this.authSubscription = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isAuthenticated = !!user;
    });

    // Check initial route
    this.checkAuthPage(this.router.url);

    // Subscribe to route changes
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.checkAuthPage(event.url);
        // Scroll to the top of the page on every navigation
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
      });

    // Load saved location
    const savedLocation = localStorage.getItem('user_location');
    if (savedLocation) {
      this.currentLocation = savedLocation;
    } else {
      // Try to get current location on init
      this.getCurrentLocation();
    }

    // Load menu categories from API
    this.loadMenuCategories();

    // Load branch data
    this.loadBranchData();
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  private checkAuthPage(url: string): void {
    const authRoutes = ['/login', '/register', '/forgot-password'];
    this.isAuthPage = authRoutes.some(route => url.includes(route));
  }

  getCurrentLocation(): void {
    if (!navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        this.reverseGeocode(lat, lng);
      },
      () => {
        // Silent fail - user can set location manually
      },
      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 300000 // 5 minutes
      }
    );
  }

  reverseGeocode(lat: number, lng: number): void {
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=ar`)
      .then(response => response.json())
      .then(data => {
        if (data.address) {
          const addr = data.address;
          const parts = [];
          if (addr.city || addr.town || addr.village) {
            parts.push(addr.city || addr.town || addr.village);
          }
          if (addr.state || addr.region) {
            parts.push(addr.state || addr.region);
          }
          if (addr.country) {
            parts.push(addr.country);
          }
          const address = parts.length > 0 ? parts.join('، ') : data.display_name || 'موقعي الحالي';
          this.currentLocation = address;
          localStorage.setItem('user_location', address);
        }
      })
      .catch(() => {
        // Silent fail
      });
  }

  openLocationDialog(): void {
    const dialogRef = this.dialog.open(LocationDialogComponent, {
      width: '90vw',
      maxWidth: '500px',
      maxHeight: '90vh',
      panelClass: 'location-dialog-panel',
      data: { currentLocation: this.currentLocation }
    });

    dialogRef.afterClosed().subscribe((result?: string) => {
      if (result) {
        this.currentLocation = result;
      }
    });
  }

  onNewsletterSubmit(): void {
    if (this.newsletterForm.valid) {
      const email = this.newsletterForm.get('email')?.value;
      console.log('Newsletter subscription:', email);
      // TODO: Implement API call to subscribe email
      // Reset form after successful submission
      this.newsletterForm.reset();
    }
  }

  setLanguage(lang: string): void {
    this.translationService.setLanguage(lang);
    this.updateDirection(lang);
  }

  private updateDirection(lang: string): void {
    const htmlElement = this.document.documentElement;
    const bodyElement = this.document.body;

    if (lang === 'ar') {
      htmlElement.setAttribute('dir', 'ltr');
      htmlElement.setAttribute('lang', 'ar');
      bodyElement.setAttribute('dir', 'ltr');
      bodyElement.classList.add('ltr');
      bodyElement.classList.remove('rtl');
    } else {
      htmlElement.setAttribute('dir', 'rtl');
      htmlElement.setAttribute('lang', 'en');
      bodyElement.setAttribute('dir', 'rtl');
      bodyElement.classList.add('rtl');
      bodyElement.classList.remove('ltr');
    }
  }

  downloadPDF(): void {
    // Create a link element to download PDF from assets
    const link = this.document.createElement('a');
    link.href = 'assets/menu.pdf'; // Path to PDF in assets folder
    link.download = 'menu.pdf';
    link.click();
  }

  downloadMenuPDF(): void {
    // Create a link element to download PDF from assets
    const link = this.document.createElement('a');
    link.href = 'assets/Bashwat_menu.pdf'; // Path to PDF in assets folder
    link.download = 'Bashwat_menu.pdf';
    link.click();
  }

  openSocialLink(url: string, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  loadBranchData(): void {
    this.branchService.getBranches().pipe(
      catchError(error => {
        console.error('Error loading branches:', error);
        return of([]);
      })
    ).subscribe((branches: Branch[]) => {
      // Store branches array
      this.branches = branches;
      // Get the first active branch, or first branch if no active branch found
      const activeBranch = branches.find(b => b.isActive) || branches[0];
      if (activeBranch) {
        this.currentBranch = activeBranch;
      }
    });
  }

  getContactPhone(): string {
    if (this.branches.length > 0) {
      // Try phoneNumber first, fallback to phone
      const firstBranch = this.branches[0] as any;
      return firstBranch.phoneNumber || firstBranch.phone || '39990689';
    }
    return '39990689'; // Fallback to default
  }

  getBranchName(): string {
    if (!this.currentBranch) {
      return '';
    }
    return this.currentLang === 'ar' ? this.currentBranch.nameAr : this.currentBranch.nameEn;
  }

  getBranchAddress(): string {
    if (!this.currentBranch) {
      return this.translate.instant('FOOTER.ADDRESS');
    }
    const address = this.currentLang === 'ar' ? this.currentBranch.addressAr : this.currentBranch.addressEn;
    return (address && address.trim()) || this.translate.instant('FOOTER.ADDRESS');
  }

  getBranchPhone(): string {
    if (!this.currentBranch) {
      return this.translate.instant('FOOTER.PHONE_1');
    }
    return this.currentBranch.phone || this.translate.instant('FOOTER.PHONE_1');
  }

  getBranchWorkingHours(): string {
    if (!this.currentBranch) {
      return this.translate.instant('FOOTER.WORKING_HOURS');
    }
    const openingTime = this.formatTime(this.currentBranch.openingTime);
    const closingTime = this.formatTime(this.currentBranch.closingTime);
    if (openingTime && closingTime) {
      const translated = this.translate.instant('FOOTER.WORKING_HOURS_FORMAT', {
        opening: openingTime,
        closing: closingTime
      });
      // If translation returns the key itself, use fallback
      if (translated === 'FOOTER.WORKING_HOURS_FORMAT') {
        return this.currentLang === 'ar'
          ? `ساعات العمل: من الساعة ${openingTime} حتى ${closingTime} طوال أيام الأسبوع.`
          : `Working Hours: From ${openingTime} to ${closingTime}, seven days a week.`;
      }
      return translated;
    }
    return this.translate.instant('FOOTER.WORKING_HOURS');
  }

  formatTime(timeString: string): string {
    if (!timeString) return '';
    // TimeSpan format is "HH:mm:ss", we only need "HH:mm"
    const parts = timeString.split(':');
    if (parts.length >= 2) {
      return `${parts[0]}:${parts[1]}`;
    }
    return timeString;
  }
}



