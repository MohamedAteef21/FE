import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule, ViewportScroller } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { SharedModule } from '../../../shared/shared.module';
import { CartService } from '../../../core/services/cart.service';
import { OrderService } from '../../../core/services/order.service';
import { Cart } from '../../../models/menu-item.model';
import { CityWithDetails, District, Area } from '../../../models/location.model';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../models/auth.model';
import { AuthRequiredDialogComponent } from './auth-required-dialog.component';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, SharedModule, TranslateModule, ReactiveFormsModule, MatRadioModule, MatSnackBarModule],
  template: `
    <div class="container-fluid px-0">
      <!-- Breadcrumb Navigation -->
      <div class="breadcrumb-container">
        <nav class="breadcrumb-nav">
          <a routerLink="/">{{ 'NAV.HOME' | translate }}</a>
          <span> > </span>
          <a routerLink="/menu">{{ 'NAV.MENU' | translate }}</a>
          <span> > </span>
          <a routerLink="/cart">{{ 'NAV.CART' | translate }}</a>
          <span> > </span>
          <span>{{ 'CHECKOUT.TITLE' | translate }}</span>
        </nav>
      </div>

      <!-- Main Content -->
      <div class="checkout-content-wrapper">
        <div class="container-fluid px-0">
          <ng-container *ngIf="cart$ | async as cart">
            <div class="checkout-grid-container">
              <!-- Order Summary Sidebar -->
              <div class="sidebar-wrapper">
                <div class="sidebar-content" *ngIf="cart.items.length > 0">
                  <div class="order-summary">
                    <div class="summary-item summary-item-total">
                      <span>{{ 'CART.ITEMS_TOTAL' | translate }}:</span>
                      <span>{{ formatCurrency(cart.subtotal) }}</span>
                    </div>
                    <div class="summary-item">
                      <span>{{ 'CART.SHIPPING' | translate }}:</span>
                      <span>{{ formatCurrency(deliveryFees) }}</span>
                    </div>
                    
                    <!-- Discount Code -->
                    <div class="discount-section">
                      <div class="discount-input-group">
                        <input 
                          type="text" 
                          class="discount-input" 
                          [placeholder]="'CART.DISCOUNT_PLACEHOLDER' | translate"
                          [(ngModel)]="discountCode"
                          [ngModelOptions]="{standalone: true}"
                          (keyup.enter)="applyDiscount()" />
                        <button class="discount-btn" (click)="applyDiscount()">
                          {{ 'CART.ACTIVATE' | translate }}
                          <svg width="24" height="19" viewBox="0 0 24 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M0 16.2857C0 17.7051 1.14857 18.8571 2.568 18.8571H21.432C22.8514 18.8571 24 17.7051 24 16.2857V12.7989C24.0002 12.6105 23.9383 12.4274 23.824 12.2777C23.7096 12.128 23.5492 12.0202 23.3674 11.9709C22.8096 11.8189 22.3171 11.4877 21.9661 11.0283C21.615 10.5689 21.4249 10.0068 21.4249 9.42857C21.4249 8.85038 21.615 8.28824 21.9661 7.82882C22.3171 7.3694 22.8096 7.0382 23.3674 6.88629C23.5492 6.83694 23.7096 6.7291 23.824 6.57944C23.9383 6.42978 24.0002 6.24663 24 6.05829V2.57143C24 1.152 22.8514 0 21.432 0H2.568C1.14857 0 0 1.152 0 2.57143V6.05143C0.000227924 6.24067 0.0630764 6.42452 0.178744 6.57429C0.294411 6.72407 0.456393 6.83136 0.639429 6.87943C1.20321 7.02686 1.70222 7.35703 2.05836 7.81828C2.41451 8.27953 2.6077 8.84583 2.6077 9.42857C2.6077 10.0113 2.41451 10.5776 2.05836 11.0389C1.70222 11.5001 1.20321 11.8303 0.639429 11.9777C0.456393 12.0258 0.294411 12.1331 0.178744 12.2828C0.0630764 12.4326 0.000227924 12.6165 0 12.8057L0 16.2857ZM8.50629 14.472L17.0777 5.90057C17.269 5.69789 17.3738 5.42865 17.3699 5.14998C17.3659 4.87131 17.2535 4.60515 17.0566 4.40797C16.8596 4.21079 16.5936 4.09811 16.3149 4.09385C16.0363 4.08959 15.7669 4.19408 15.564 4.38514L6.99257 12.9566C6.88821 13.0549 6.80462 13.1731 6.74678 13.3042C6.68893 13.4354 6.65799 13.5769 6.6558 13.7202C6.65361 13.8635 6.68021 14.0059 6.73401 14.1387C6.78782 14.2716 6.86775 14.3923 6.96906 14.4938C7.07037 14.5952 7.19101 14.6753 7.32383 14.7292C7.45664 14.7832 7.59893 14.8099 7.74228 14.8079C7.88562 14.8059 8.0271 14.7751 8.15833 14.7174C8.28957 14.6597 8.40789 14.5763 8.50629 14.472ZM6.89314 6C6.89314 5.54534 7.07375 5.10931 7.39525 4.78782C7.71674 4.46633 8.15277 4.28571 8.60743 4.28571C9.06209 4.28571 9.49812 4.46633 9.81961 4.78782C10.1411 5.10931 10.3217 5.54534 10.3217 6C10.3217 6.45466 10.1411 6.89069 9.81961 7.21218C9.49812 7.53367 9.06209 7.71429 8.60743 7.71429C8.15277 7.71429 7.71674 7.53367 7.39525 7.21218C7.07375 6.89069 6.89314 6.45466 6.89314 6ZM13.7503 12.8571C13.7503 12.4025 13.9309 11.9665 14.2524 11.645C14.5739 11.3235 15.0099 11.1429 15.4646 11.1429C15.9192 11.1429 16.3553 11.3235 16.6768 11.645C16.9982 11.9665 17.1789 12.4025 17.1789 12.8571C17.1789 13.3118 16.9982 13.7478 16.6768 14.0693C16.3553 14.3908 15.9192 14.5714 15.4646 14.5714C15.0099 14.5714 14.5739 14.3908 14.2524 14.0693C13.9309 13.7478 13.7503 13.3118 13.7503 12.8571Z" fill="#343538"/>
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div class="summary-item summary-item-discount">
                      <span>{{ 'CART.APPLIED_DISCOUNT' | translate }}:</span>
                      <span>{{ formatCurrency(appliedDiscount) }}</span>
                    </div>
                    
                    <div class="summary-total">
                      <span>{{ 'CART.TOTAL' | translate }}:</span>
                      <span class="total-amount">{{ formatCurrency(getFinalTotal(cart)) }}</span>
                    </div>

                    <!-- Terms and Delivery Container -->
                    <div class="terms-delivery-container">
                      <!-- Terms and Conditions -->
                      <div class="terms-section">
                        <div class="terms-checked">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="terms-checkmark">
                            <path d="M9 11L12 14L20 6" stroke="#0AAD0A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M20 12V18C20 18.5304 19.7893 19.0391 19.4142 19.4142C19.0391 19.7893 18.5304 20 18 20H6C5.46957 20 4.96086 19.7893 4.58579 19.4142C4.21071 19.0391 4 18.5304 4 18V6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4H15" stroke="#0AAD0A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          </svg>
                          <span class="terms-label">{{ 'CART.TERMS_AGREEMENT' | translate }}</span>
                        </div>
                      </div>

                      <!-- Delivery Info -->
                      <div class="delivery-info">
                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8.9375 6.1875H6.875C6.51033 6.1875 6.16059 6.33237 5.90273 6.59023C5.64487 6.84809 5.5 7.19783 5.5 7.5625V13.8944C7.09156 14.3509 8.25 15.8345 8.25 17.5594C8.25 18.0022 7.9585 18.3886 7.54875 18.5171L7.54325 18.5625H13.5245C13.0269 18.1604 12.6662 17.6139 12.4921 16.9983C12.318 16.3827 12.339 15.7283 12.5522 15.1251C12.7654 14.522 13.1604 13.9997 13.6827 13.6303C14.205 13.2609 14.829 13.0626 15.4688 13.0625H18.2779C18.6182 13.0625 18.9447 13.1182 19.25 13.2213V13.0625C19.25 12.5155 19.0327 11.9909 18.6459 11.6041C18.2591 11.2173 17.7345 11 17.1875 11H9.96875C9.87758 11 9.79015 11.0362 9.72568 11.1007C9.66122 11.1651 9.625 11.2526 9.625 11.3438V12.375C9.625 12.7397 9.76987 13.0894 10.0277 13.3473C10.2856 13.6051 10.6353 13.75 11 13.75H11.3438C11.6173 13.75 11.8796 13.8586 12.073 14.052C12.2664 14.2454 12.375 14.5077 12.375 14.7812C12.375 15.0548 12.2664 15.3171 12.073 15.5105C11.8796 15.7038 11.6173 15.8125 11.3438 15.8125H8.70856C8.58694 15.8125 8.47031 15.7642 8.38431 15.6782C8.29831 15.5922 8.25 15.4756 8.25 15.3539V7.5625H8.9375C9.11984 7.5625 9.2947 7.49007 9.42364 7.36114C9.55257 7.2322 9.625 7.05734 9.625 6.875C9.625 6.69266 9.55257 6.5178 9.42364 6.38886C9.2947 6.25993 9.11984 6.1875 8.9375 6.1875Z" fill="currentColor"/>
                          <path d="M10.7711 8.9375C10.1386 8.9375 9.625 9.45037 9.625 10.0836C9.625 10.2101 9.72813 10.3125 9.85394 10.3125H15.5836C15.7101 10.3125 15.8125 10.2094 15.8125 10.0836C15.8125 9.45106 15.2996 8.9375 14.6664 8.9375H10.7711ZM6.875 18.2188C6.87441 18.5489 6.80588 18.8754 6.67369 19.1779C6.54149 19.4804 6.34846 19.7525 6.1066 19.9772C5.86473 20.2019 5.57921 20.3745 5.2678 20.4841C4.95639 20.5938 4.62576 20.6381 4.29646 20.6145C3.96716 20.5909 3.64625 20.4997 3.3537 20.3467C3.06114 20.1937 2.80319 19.9822 2.59591 19.7252C2.38862 19.4682 2.23643 19.1714 2.14881 18.8531C2.06118 18.5348 2.03999 18.2018 2.08656 17.875H1.68781C1.60465 17.8741 1.5252 17.8405 1.46665 17.7814C1.4081 17.7223 1.37518 17.6426 1.375 17.5594C1.375 15.851 2.76031 14.4375 4.46875 14.4375C6.17719 14.4375 7.5625 15.851 7.5625 17.5594C7.56233 17.6425 7.52949 17.7221 7.47109 17.7812C7.41269 17.8402 7.33341 17.8739 7.25037 17.875H6.85094C6.86698 17.9873 6.875 18.1019 6.875 18.2188ZM3.49594 17.875C3.44124 18.0305 3.42461 18.1969 3.44745 18.3601C3.47029 18.5234 3.53193 18.6788 3.62721 18.8133C3.72249 18.9478 3.84862 19.0575 3.99504 19.1332C4.14147 19.209 4.30391 19.2485 4.46875 19.2485C4.63359 19.2485 4.79603 19.209 4.94246 19.1332C5.08888 19.0575 5.21501 18.9478 5.31029 18.8133C5.40557 18.6788 5.46721 18.5234 5.49005 18.3601C5.51289 18.1969 5.49626 18.0305 5.44156 17.875H3.49594ZM19.9134 18.5625C19.8302 19.1369 19.5422 19.6619 19.1025 20.0408C18.6628 20.4197 18.101 20.6269 17.5206 20.6243C16.9402 20.6217 16.3803 20.4095 15.944 20.0267C15.5077 19.6439 15.2244 19.1163 15.1463 18.5412C14.541 18.4601 13.9892 18.1519 13.6027 17.679C13.2162 17.2061 13.024 16.604 13.065 15.9947C13.106 15.3853 13.3772 14.8144 13.8235 14.3976C14.2699 13.9808 14.858 13.7493 15.4688 13.75H18.2779C18.9004 13.75 19.4974 13.9973 19.9375 14.4375C20.3777 14.8776 20.625 15.4746 20.625 16.0971V17.875C20.625 18.0573 20.5526 18.2322 20.4236 18.3611C20.2947 18.4901 20.1198 18.5625 19.9375 18.5625H19.9134ZM16.5584 18.5625C16.6293 18.7639 16.7609 18.9384 16.9352 19.0618C17.1094 19.1852 17.3177 19.2515 17.5312 19.2515C17.7448 19.2515 17.9531 19.1852 18.1273 19.0618C18.3016 18.9384 18.4332 18.7639 18.5041 18.5625H16.5584Z" fill="currentColor"/>
                        </svg>
                        <span>{{ 'CART.DELIVERY_TIME' | translate }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Checkout Form Section -->
              <div class="checkout-form-wrapper">
                <div class="checkout-content" *ngIf="cart.items.length > 0">
                  <!-- Page Title -->
                  <div class="checkout-title-section">
                    <h2 class="checkout-title">{{ 'CHECKOUT.TITLE' | translate }}</h2>
<svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M21.9997 33C17.079 33 12.5874 33.693 9.16637 34.8333M32.9997 23.8333C34.1448 23.8329 35.2739 23.5644 36.2966 23.0491C37.3193 22.5339 38.2071 21.7864 38.8889 20.8663C39.5707 19.9463 40.0276 18.8794 40.223 17.7511C40.4183 16.6227 40.3467 15.4643 40.0139 14.3686C39.6811 13.2729 39.0963 12.2704 38.3064 11.4414C37.5164 10.6123 36.5433 9.97977 35.465 9.59441C34.3867 9.20904 33.2331 9.08156 32.0966 9.22218C30.9602 9.3628 29.8724 9.7676 28.9205 10.4042C28.4162 8.97132 27.4796 7.73032 26.2399 6.85244C25.0003 5.97456 23.5187 5.50308 21.9997 5.50308C20.4807 5.50308 18.9991 5.97456 17.7595 6.85244C16.5198 7.73032 15.5832 8.97132 15.0789 10.4042C14.127 9.7676 13.0393 9.3628 11.9028 9.22218C10.7663 9.08156 9.61274 9.20904 8.53441 9.59441C7.45607 9.97977 6.48297 10.6123 5.69305 11.4414C4.90313 12.2704 4.31833 13.2729 3.98551 14.3686C3.65269 15.4643 3.58109 16.6227 3.77645 17.7511C3.97181 18.8794 4.42869 19.9463 5.11051 20.8663C5.79232 21.7864 6.68012 22.5339 7.70279 23.0491C8.72546 23.5644 9.85458 23.8329 10.9997 23.8333V33.9167M38.4997 33.9167H27.4997M38.4997 33.9167C38.4997 35.2 34.844 37.5998 33.9164 38.5M38.4997 33.9167C38.4997 32.6333 34.844 30.2335 33.9164 29.3333" stroke="black" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
                  </div>

                  <form [formGroup]="checkoutForm" class="checkout-form" (ngSubmit)="submitOrder()">
                    <!-- Delivery Method -->
                    <div class="form-section">
                      <h3 class="section-title">{{ 'CHECKOUT.DELIVERY_METHOD' | translate }}</h3>
                      <div class="radio-group">
                        <mat-radio-group formControlName="deliveryMethod">
                          <mat-radio-button value="home" class="radio-option">
                            {{ 'CHECKOUT.HOME_DELIVERY' | translate }}
                          </mat-radio-button>
                          <mat-radio-button value="pickup" class="radio-option">
                            {{ 'CHECKOUT.PICKUP_FROM_BRANCH' | translate }}
                          </mat-radio-button>
                        </mat-radio-group>
                      </div>
                    </div>

                    <!-- Delivery Date -->
                    <div class="form-section">
                      <h3 class="section-title">{{ 'CHECKOUT.DELIVERY_DATE' | translate }}</h3>
                      <div class="radio-group">
                        <mat-radio-group formControlName="deliveryDateOption">
                          <mat-radio-button value="today" class="radio-option radio-option-transparent">
                            {{ 'CHECKOUT.TODAY_90_MINUTES' | translate }}
                          </mat-radio-button>
                          <mat-radio-button value="choose" class="radio-option radio-option-transparent">
                            {{ 'CHECKOUT.CHOOSE_DATE' | translate }}
                            <span style="padding-inline: .5rem;">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="calendar-icon">
                              <g clip-path="url(#clip0_312_58823)">
                                <path d="M22.5 2.24735L16.4948 2.24737V0.752624C16.4948 0.338249 16.1591 0.00262451 15.7448 0.00262451C15.3304 0.00262451 14.9948 0.338249 14.9948 0.752624V2.247H8.99475V0.752624C8.99475 0.338249 8.65913 0.00262451 8.24475 0.00262451C7.83038 0.00262451 7.49475 0.338249 7.49475 0.752624V2.247H1.5C0.671625 2.247 0 2.91862 0 3.747V22.497C0 23.3254 0.671625 23.997 1.5 23.997H22.5C23.3284 23.997 24 23.3254 24 22.497V3.747C24 2.91898 23.3284 2.24735 22.5 2.24735ZM22.5 22.497H1.5V3.747H7.49475V4.50262C7.49475 4.91698 7.83038 5.25262 8.24475 5.25262C8.65913 5.25262 8.99475 4.91698 8.99475 4.50262V3.74737H14.9948V4.503C14.9948 4.91737 15.3304 5.253 15.7448 5.253C16.1591 5.253 16.4948 4.91737 16.4948 4.503V3.74737H22.5V22.497ZM17.25 11.9974H18.75C19.164 11.9974 19.5 11.6614 19.5 11.2474V9.74735C19.5 9.33335 19.164 8.99735 18.75 8.99735H17.25C16.836 8.99735 16.5 9.33335 16.5 9.74735V11.2474C16.5 11.6614 16.836 11.9974 17.25 11.9974ZM17.25 17.997H18.75C19.164 17.997 19.5 17.6614 19.5 17.247V15.747C19.5 15.333 19.164 14.997 18.75 14.997H17.25C16.836 14.997 16.5 15.333 16.5 15.747V17.247C16.5 17.6617 16.836 17.997 17.25 17.997ZM12.75 14.997H11.25C10.836 14.997 10.5 15.333 10.5 15.747V17.247C10.5 17.6614 10.836 17.997 11.25 17.997H12.75C13.164 17.997 13.5 17.6614 13.5 17.247V15.747C13.5 15.3334 13.164 14.997 12.75 14.997ZM12.75 8.99735H11.25C10.836 8.99735 10.5 9.33335 10.5 9.74735V11.2474C10.5 11.6614 10.836 11.9974 11.25 11.9974H12.75C13.164 11.9974 13.5 11.6614 13.5 11.2474V9.74735C13.5 9.33298 13.164 8.99735 12.75 8.99735ZM6.75 8.99735H5.25C4.836 8.99735 4.5 9.33335 4.5 9.74735V11.2474C4.5 11.6614 4.836 11.9974 5.25 11.9974H6.75C7.164 11.9974 7.5 11.6614 7.5 11.2474V9.74735C7.5 9.33298 7.164 8.99735 6.75 8.99735ZM6.75 14.997H5.25C4.836 14.997 4.5 15.333 4.5 15.747V17.247C4.5 17.6614 4.836 17.997 5.25 17.997H6.75C7.164 17.997 7.5 17.6614 7.5 17.247V15.747C7.5 15.3334 7.164 14.997 6.75 14.997Z" fill="#F00E0C"/>
                              </g>
                              <defs>
                                <clipPath id="clip0_312_58823">
                                  <rect width="24" height="24" fill="transparent"/>
                                </clipPath>
                              </defs>
                            </svg>
                            </span>

                          </mat-radio-button>
                        </mat-radio-group>
                      </div>
                      <input 
                        *ngIf="checkoutForm.get('deliveryDateOption')?.value === 'choose'" 
                        type="date" 
                        formControlName="selectedDate"
                        class="date-input"
                        [min]="minDate" />
                    </div>

                    <!-- Customer Details -->
                    <div class="form-section" *ngIf="!isAuthenticated">
                      <h3 class="section-title">{{ 'CHECKOUT.CUSTOMER_DETAILS' | translate }}</h3>
                      <div class="form-row">
                        <div class="form-group">
                          <div class="float-label-wrapper">
                            <input 
                              type="text" 
                              formControlName="firstName" 
                              class="form-input" 
                              [placeholder]="getPlaceholder('CHECKOUT.FIRST_NAME' | translate)"
                              id="firstName" />
                            <label for="firstName">{{ 'CHECKOUT.FIRST_NAME' | translate }}<span class="required-asterisk">*</span></label>
                          </div>
                        </div>
                        <div class="form-group">
                          <div class="float-label-wrapper">
                            <input 
                              type="text" 
                              formControlName="lastName" 
                              class="form-input" 
                              [placeholder]="getPlaceholder('CHECKOUT.LAST_NAME' | translate)"
                              id="lastName" />
                            <label for="lastName">{{ 'CHECKOUT.LAST_NAME' | translate }}<span class="required-asterisk">*</span></label>
                          </div>
                        </div>
                      </div>
                      <div class="form-row">
                        <div class="form-group full-width">
                          <div class="float-label-wrapper">
                            <input 
                              type="tel" 
                              formControlName="phone" 
                              class="form-input" 
                              [placeholder]="getPlaceholder('CHECKOUT.PHONE' | translate)"
                              id="phone" />
                            <label for="phone">{{ 'CHECKOUT.PHONE' | translate }}<span class="required-asterisk">*</span></label>
                          </div>
                        </div>
                      </div>
                      <div class="form-row">
                        <div class="form-group full-width">
                          <div class="float-label-wrapper">
                            <input 
                              type="email" 
                              formControlName="email" 
                              class="form-input" 
                              [placeholder]="getPlaceholder('CHECKOUT.EMAIL' | translate)"
                              id="email" />
                            <label for="email">{{ 'CHECKOUT.EMAIL' | translate }}<span class="required-asterisk">*</span></label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Create Account -->
                    <div class="form-section" *ngIf="!isAuthenticated">
                      <div class="create-account-section">
                        <div *ngIf="!createAccount" class="create-account-unchecked" (click)="toggleCreateAccount()">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="terms-checkmark">
                            <path d="M20 12V18C20 18.5304 19.7893 19.0391 19.4142 19.4142C19.0391 19.7893 18.5304 20 18 20H6C5.46957 20 4.96086 19.7893 4.58579 19.4142C4.21071 19.0391 4 18.5304 4 18V6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4H15" stroke="#808080" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          </svg>
                          <span class="terms-label">{{ 'CHECKOUT.CREATE_ACCOUNT' | translate }}</span>
                        </div>
                        <div *ngIf="createAccount" class="create-account-checked" (click)="toggleCreateAccount()">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9 11L12 14L20 6" stroke="#0AAD0A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M20 12V18C20 18.5304 19.7893 19.0391 19.4142 19.4142C19.0391 19.7893 18.5304 20 18 20H6C5.46957 20 4.96086 19.7893 4.58579 19.4142C4.21071 19.0391 4 18.5304 4 18V6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4H15" stroke="#0AAD0A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

                          <span class="terms-label">{{ 'CHECKOUT.CREATE_ACCOUNT' | translate }}</span>
                        </div>
                      </div>
                      <div *ngIf="createAccount" class="form-row">
                        <div class="form-group full-width">
                          <div class="float-label-wrapper">
                            <input 
                              type="password" 
                              formControlName="password" 
                              class="form-input" 
                              [placeholder]="getPlaceholder('CHECKOUT.PASSWORD' | translate)"
                              id="password" />
                            <label for="password">{{ 'CHECKOUT.PASSWORD' | translate }}<span class="required-asterisk">*</span></label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Delivery Address -->
                    <div class="form-section" *ngIf="checkoutForm.get('deliveryMethod')?.value === 'home'">
                      <h3 class="section-title">{{ 'CHECKOUT.DELIVERY_ADDRESS' | translate }}</h3>
                      <!-- City -->
                      <div class="form-row">
                        <div class="form-group full-width">
                          <div class="float-label-wrapper">
                            <select formControlName="city" class="form-input form-select" id="city"
                              [class.has-value]="checkoutForm.get('city')?.value"
                              [disabled]="citiesLoading">
                              <option value="">
                                {{ citiesLoading ? ('CHECKOUT.LOADING' | translate) : ('CHECKOUT.SELECT_CITY' | translate) }}
                              </option>
                              <option *ngFor="let city of cities" [value]="city.id">
                                {{ isAr ? city.nameAr : city.nameEn }}
                              </option>
                            </select>
                            <label for="city">{{ 'CHECKOUT.CITY' | translate }}<span class="required-asterisk">*</span></label>
                          </div>
                        </div>
                      </div>
                      <!-- District (populated after city is chosen) -->
                      <div class="form-row">
                        <div class="form-group full-width">
                          <div class="float-label-wrapper">
                            <select formControlName="district" class="form-input form-select" id="district"
                              [class.has-value]="checkoutForm.get('district')?.value"
                              [disabled]="!filteredDistricts.length">
                              <option value="">{{ 'CHECKOUT.SELECT_DISTRICT' | translate }}</option>
                              <option *ngFor="let district of filteredDistricts" [value]="district.id">
                                {{ isAr ? district.nameAr : district.nameEn }}
                              </option>
                            </select>
                            <label for="district">{{ 'CHECKOUT.DISTRICT' | translate }}<span class="required-asterisk">*</span></label>
                          </div>
                        </div>
                      </div>
                      <!-- Area (populated after district is chosen) -->
                      <div class="form-row">
                        <div class="form-group full-width">
                          <div class="float-label-wrapper">
                            <select formControlName="area" class="form-input form-select" id="area"
                              [class.has-value]="checkoutForm.get('area')?.value"
                              [disabled]="!filteredAreas.length">
                              <option value="">{{ 'CHECKOUT.SELECT_AREA' | translate }}</option>
                              <option *ngFor="let area of filteredAreas" [value]="area.id">
                                {{ isAr ? area.nameAr : area.nameEn }}
                              </option>
                            </select>
                            <label for="area">{{ 'CHECKOUT.AREA' | translate }}</label>
                          </div>
                        </div>
                      </div>
                      <div class="form-row">
                        <div class="form-group full-width">
                          <div class="float-label-wrapper">
                            <input 
                              type="text" 
                              formControlName="propertyStreet" 
                              class="form-input" 
                              [placeholder]="'CHECKOUT.PROPERTY_STREET' | translate"
                              id="propertyStreet" />
                            <label for="propertyStreet">{{ 'CHECKOUT.PROPERTY_STREET' | translate }}</label>
                          </div>
                        </div>
                      </div>
                      <div class="form-row">
                        <div class="form-group">
                          <div class="float-label-wrapper">
                            <input 
                              type="text" 
                              formControlName="floor" 
                              class="form-input" 
                              [placeholder]="'CHECKOUT.FLOOR' | translate"
                              id="floor" />
                            <label for="floor">{{ 'CHECKOUT.FLOOR' | translate }}</label>
                          </div>
                        </div>
                        <div class="form-group">
                          <div class="float-label-wrapper">
                            <input 
                              type="text" 
                              formControlName="apartment" 
                              class="form-input" 
                              [placeholder]="'CHECKOUT.APARTMENT' | translate"
                              id="apartment" />
                            <label for="apartment">{{ 'CHECKOUT.APARTMENT' | translate }}</label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Payment Method -->
                    <div class="form-section payment-method-section">
                      <h3 class="section-title payment-method-title">{{ 'CHECKOUT.PAYMENT_METHOD' | translate }}</h3>
                      <div class="radio-group payment-method-group">
                        <mat-radio-group formControlName="paymentMethod">
                          <mat-radio-button value="cash" class="radio-option payment-option" style="display: flex;
  align-items: center;">
                            <i class="pi pi-money-bill"></i>
                            <span class="payment-label">{{ 'CHECKOUT.CASH' | translate }}</span>
                          </mat-radio-button>
                          <mat-radio-button value="visa" class="radio-option payment-option radio-option-disabled" [disabled]="true">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M21 4H3C1.89543 4 1 4.89543 1 6V18C1 19.1046 1.89543 20 3 20H21C22.1046 20 23 19.1046 23 18V6C23 4.89543 22.1046 4 21 4Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                              <path d="M1 10H23" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <span class="visa-label payment-label">{{ 'CHECKOUT.VISA' | translate }}</span>
                            <span class="coming-soon-badge">{{ 'CHECKOUT.COMING_SOON' | translate }}</span>
                          </mat-radio-button>
                        </mat-radio-group>
                      </div>
                    </div>

                    <!-- Validation Messages -->
                    <div *ngIf="getValidationMessages().length > 0 && !isSubmitting" class="validation-messages">
                      <div *ngFor="let message of getValidationMessages()" class="validation-message">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#F00E0C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span>{{ message }}</span>
                      </div>
                    </div>

                    <!-- Order Summary (Mobile Only - appears between validation and button) -->
                    <div class="order-summary-mobile" *ngIf="cart.items.length > 0">
                      <div class="order-summary">
                        <div class="summary-item summary-item-total">
                          <span>{{ 'CART.ITEMS_TOTAL' | translate }}:</span>
                          <span>{{ formatCurrency(cart.subtotal) }}</span>
                        </div>
                        <div class="summary-item">
                          <span>{{ 'CART.SHIPPING' | translate }}:</span>
                          <span>{{ formatCurrency(deliveryFees) }}</span>
                        </div>
                        
                        <!-- Discount Code -->
                        <div class="discount-section">
                          <div class="discount-input-group">
                            <input 
                              type="text" 
                              class="discount-input" 
                              [placeholder]="'CART.DISCOUNT_PLACEHOLDER' | translate"
                              [(ngModel)]="discountCode"
                              [ngModelOptions]="{standalone: true}"
                              (keyup.enter)="applyDiscount()" />
                            <button class="discount-btn" (click)="applyDiscount()">
                              {{ 'CART.ACTIVATE' | translate }}
                              <svg width="24" height="19" viewBox="0 0 24 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M0 16.2857C0 17.7051 1.14857 18.8571 2.568 18.8571H21.432C22.8514 18.8571 24 17.7051 24 16.2857V12.7989C24.0002 12.6105 23.9383 12.4274 23.824 12.2777C23.7096 12.128 23.5492 12.0202 23.3674 11.9709C22.8096 11.8189 22.3171 11.4877 21.9661 11.0283C21.615 10.5689 21.4249 10.0068 21.4249 9.42857C21.4249 8.85038 21.615 8.28824 21.9661 7.82882C22.3171 7.3694 22.8096 7.0382 23.3674 6.88629C23.5492 6.83694 23.7096 6.7291 23.824 6.57944C23.9383 6.42978 24.0002 6.24663 24 6.05829V2.57143C24 1.152 22.8514 0 21.432 0H2.568C1.14857 0 0 1.152 0 2.57143V6.05143C0.000227924 6.24067 0.0630764 6.42452 0.178744 6.57429C0.294411 6.72407 0.456393 6.83136 0.639429 6.87943C1.20321 7.02686 1.70222 7.35703 2.05836 7.81828C2.41451 8.27953 2.6077 8.84583 2.6077 9.42857C2.6077 10.0113 2.41451 10.5776 2.05836 11.0389C1.70222 11.5001 1.20321 11.8303 0.639429 11.9777C0.456393 12.0258 0.294411 12.1331 0.178744 12.2828C0.0630764 12.4326 0.000227924 12.6165 0 12.8057L0 16.2857ZM8.50629 14.472L17.0777 5.90057C17.269 5.69789 17.3738 5.42865 17.3699 5.14998C17.3659 4.87131 17.2535 4.60515 17.0566 4.40797C16.8596 4.21079 16.5936 4.09811 16.3149 4.09385C16.0363 4.08959 15.7669 4.19408 15.564 4.38514L6.99257 12.9566C6.88821 13.0549 6.80462 13.1731 6.74678 13.3042C6.68893 13.4354 6.65799 13.5769 6.6558 13.7202C6.65361 13.8635 6.68021 14.0059 6.73401 14.1387C6.78782 14.2716 6.86775 14.3923 6.96906 14.4938C7.07037 14.5952 7.19101 14.6753 7.32383 14.7292C7.45664 14.7832 7.59893 14.8099 7.74228 14.8079C7.88562 14.8059 8.0271 14.7751 8.15833 14.7174C8.28957 14.6597 8.40789 14.5763 8.50629 14.472ZM6.89314 6C6.89314 5.54534 7.07375 5.10931 7.39525 4.78782C7.71674 4.46633 8.15277 4.28571 8.60743 4.28571C9.06209 4.28571 9.49812 4.46633 9.81961 4.78782C10.1411 5.10931 10.3217 5.54534 10.3217 6C10.3217 6.45466 10.1411 6.89069 9.81961 7.21218C9.49812 7.53367 9.06209 7.71429 8.60743 7.71429C8.15277 7.71429 7.71674 7.53367 7.39525 7.21218C7.07375 6.89069 6.89314 6.45466 6.89314 6ZM13.7503 12.8571C13.7503 12.4025 13.9309 11.9665 14.2524 11.645C14.5739 11.3235 15.0099 11.1429 15.4646 11.1429C15.9192 11.1429 16.3553 11.3235 16.6768 11.645C16.9982 11.9665 17.1789 12.4025 17.1789 12.8571C17.1789 13.3118 16.9982 13.7478 16.6768 14.0693C16.3553 14.3908 15.9192 14.5714 15.4646 14.5714C15.0099 14.5714 14.5739 14.3908 14.2524 14.0693C13.9309 13.7478 13.7503 13.3118 13.7503 12.8571Z" fill="#343538"/>
                              </svg>
                            </button>
                          </div>
                        </div>

                        <div class="summary-item summary-item-discount">
                          <span>{{ 'CART.APPLIED_DISCOUNT' | translate }}:</span>
                          <span>{{ formatCurrency(appliedDiscount) }}</span>
                        </div>
                        
                        <div class="summary-total">
                          <span>{{ 'CART.TOTAL' | translate }}:</span>
                          <span class="total-amount">{{ formatCurrency(getFinalTotal(cart)) }}</span>
                        </div>

                        <!-- Terms and Delivery Container -->
                        <div class="terms-delivery-container">
                          <!-- Terms and Conditions -->
                          <div class="terms-section">
                            <div class="terms-checked">
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="terms-checkmark">
                                <path d="M9 11L12 14L20 6" stroke="#0AAD0A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M20 12V18C20 18.5304 19.7893 19.0391 19.4142 19.4142C19.0391 19.7893 18.5304 20 18 20H6C5.46957 20 4.96086 19.7893 4.58579 19.4142C4.21071 19.0391 4 18.5304 4 18V6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4H15" stroke="#0AAD0A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                              </svg>
                              <span class="terms-label">{{ 'CART.TERMS_AGREEMENT' | translate }}</span>
                            </div>
                          </div>

                          <!-- Delivery Info -->
                          <div class="delivery-info">
                            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M8.9375 6.1875H6.875C6.51033 6.1875 6.16059 6.33237 5.90273 6.59023C5.64487 6.84809 5.5 7.19783 5.5 7.5625V13.8944C7.09156 14.3509 8.25 15.8345 8.25 17.5594C8.25 18.0022 7.9585 18.3886 7.54875 18.5171L7.54325 18.5625H13.5245C13.0269 18.1604 12.6662 17.6139 12.4921 16.9983C12.318 16.3827 12.339 15.7283 12.5522 15.1251C12.7654 14.522 13.1604 13.9997 13.6827 13.6303C14.205 13.2609 14.829 13.0626 15.4688 13.0625H18.2779C18.6182 13.0625 18.9447 13.1182 19.25 13.2213V13.0625C19.25 12.5155 19.0327 11.9909 18.6459 11.6041C18.2591 11.2173 17.7345 11 17.1875 11H9.96875C9.87758 11 9.79015 11.0362 9.72568 11.1007C9.66122 11.1651 9.625 11.2526 9.625 11.3438V12.375C9.625 12.7397 9.76987 13.0894 10.0277 13.3473C10.2856 13.6051 10.6353 13.75 11 13.75H11.3438C11.6173 13.75 11.8796 13.8586 12.073 14.052C12.2664 14.2454 12.375 14.5077 12.375 14.7812C12.375 15.0548 12.2664 15.3171 12.073 15.5105C11.8796 15.7038 11.6173 15.8125 11.3438 15.8125H8.70856C8.58694 15.8125 8.47031 15.7642 8.38431 15.6782C8.29831 15.5922 8.25 15.4756 8.25 15.3539V7.5625H8.9375C9.11984 7.5625 9.2947 7.49007 9.42364 7.36114C9.55257 7.2322 9.625 7.05734 9.625 6.875C9.625 6.69266 9.55257 6.5178 9.42364 6.38886C9.2947 6.25993 9.11984 6.1875 8.9375 6.1875Z" fill="currentColor"/>
                              <path d="M10.7711 8.9375C10.1386 8.9375 9.625 9.45037 9.625 10.0836C9.625 10.2101 9.72813 10.3125 9.85394 10.3125H15.5836C15.7101 10.3125 15.8125 10.2094 15.8125 10.0836C15.8125 9.45106 15.2996 8.9375 14.6664 8.9375H10.7711ZM6.875 18.2188C6.87441 18.5489 6.80588 18.8754 6.67369 19.1779C6.54149 19.4804 6.34846 19.7525 6.1066 19.9772C5.86473 20.2019 5.57921 20.3745 5.2678 20.4841C4.95639 20.5938 4.62576 20.6381 4.29646 20.6145C3.96716 20.5909 3.64625 20.4997 3.3537 20.3467C3.06114 20.1937 2.80319 19.9822 2.59591 19.7252C2.38862 19.4682 2.23643 19.1714 2.14881 18.8531C2.06118 18.5348 2.03999 18.2018 2.08656 17.875H1.68781C1.60465 17.8741 1.5252 17.8405 1.46665 17.7814C1.4081 17.7223 1.37518 17.6426 1.375 17.5594C1.375 15.851 2.76031 14.4375 4.46875 14.4375C6.17719 14.4375 7.5625 15.851 7.5625 17.5594C7.56233 17.6425 7.52949 17.7221 7.47109 17.7812C7.41269 17.8402 7.33341 17.8739 7.25037 17.875H6.85094C6.86698 17.9873 6.875 18.1019 6.875 18.2188ZM3.49594 17.875C3.44124 18.0305 3.42461 18.1969 3.44745 18.3601C3.47029 18.5234 3.53193 18.6788 3.62721 18.8133C3.72249 18.9478 3.84862 19.0575 3.99504 19.1332C4.14147 19.209 4.30391 19.2485 4.46875 19.2485C4.63359 19.2485 4.79603 19.209 4.94246 19.1332C5.08888 19.0575 5.21501 18.9478 5.31029 18.8133C5.40557 18.6788 5.46721 18.5234 5.49005 18.3601C5.51289 18.1969 5.49626 18.0305 5.44156 17.875H3.49594ZM19.9134 18.5625C19.8302 19.1369 19.5422 19.6619 19.1025 20.0408C18.6628 20.4197 18.101 20.6269 17.5206 20.6243C16.9402 20.6217 16.3803 20.4095 15.944 20.0267C15.5077 19.6439 15.2244 19.1163 15.1463 18.5412C14.541 18.4601 13.9892 18.1519 13.6027 17.679C13.2162 17.2061 13.024 16.604 13.065 15.9947C13.106 15.3853 13.3772 14.8144 13.8235 14.3976C14.2699 13.9808 14.858 13.7493 15.4688 13.75H18.2779C18.9004 13.75 19.4974 13.9973 19.9375 14.4375C20.3777 14.8776 20.625 15.4746 20.625 16.0971V17.875C20.625 18.0573 20.5526 18.2322 20.4236 18.3611C20.2947 18.4901 20.1198 18.5625 19.9375 18.5625H19.9134ZM16.5584 18.5625C16.6293 18.7639 16.7609 18.9384 16.9352 19.0618C17.1094 19.1852 17.3177 19.2515 17.5312 19.2515C17.7448 19.2515 17.9531 19.1852 18.1273 19.0618C18.3016 18.9384 18.4332 18.7639 18.5041 18.5625H16.5584Z" fill="currentColor"/>
                            </svg>
                            <span>{{ 'CART.DELIVERY_TIME' | translate }}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Payment Button -->
                    <button 
                      type="submit"
                      class="payment-btn" 
                      mat-raised-button
                      [disabled]="isSubmitting">
                      <ng-container *ngIf="!isSubmitting">
                        {{ 'CHECKOUT.PAYMENT' | translate }}
                      </ng-container>
                      <ng-container *ngIf="isSubmitting">
                        {{ 'CHECKOUT.PROCESSING' | translate }}
                      </ng-container>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </ng-container>
        </div>
      </div>

      <!-- Order Success Modal -->
      <div *ngIf="showOrderSuccess" class="order-success-overlay" (click)="closeOrderSuccess()">
        <div class="order-success-modal" (click)="$event.stopPropagation()">
<span style="width: 100%;">

    <button class="close-modal-btn" (click)="closeOrderSuccess()" style="position: relative;left: 0px;">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 6L6 18M6 6L18 18" stroke="#F00E0C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
    </span>
<span style="
    width: 100%;
    display: flex;
    flex-direction: column;
">

          <div class="success-icon" style="
    display: flex;
    flex-direction: column;
">
            <div class="success-circle">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 20L17 27L30 14" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <span>
            <h2 class="success-title">{{ 'CHECKOUT.THANK_YOU' | translate }}</h2>
            <p class="success-subtitle">{{ 'CHECKOUT.ORDER_CONFIRMATION_MESSAGE' | translate }}</p>
</span>
          </div>
</span>

          <div class="order-details" *ngIf="orderData">
            <div class="detail-row">
              <span class="detail-label">{{ 'CHECKOUT.FIRST_NAME' | translate }}:</span>
              <span class="detail-value">{{ orderData.firstName }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">{{ 'CHECKOUT.LAST_NAME' | translate }}:</span>
              <span class="detail-value">{{ orderData.lastName }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">{{ 'CHECKOUT.ORDER_NUMBER' | translate }}:</span>
              <span class="detail-value">{{ orderData.orderNumber }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">{{ 'CHECKOUT.ORDER_DATE_TIME' | translate }}:</span>
              <span class="detail-value">{{ orderData.orderDateTime }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">{{ 'CHECKOUT.PAYMENT_METHOD' | translate }}:</span>
              <span class="detail-value">{{ orderData.paymentMethodLabel }}</span>
            </div>
            <div class="detail-row" *ngIf="orderData.transactionNumber">
              <span class="detail-label">{{ 'CHECKOUT.TRANSACTION_NUMBER' | translate }}:</span>
              <span class="detail-value">{{ orderData.transactionNumber }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">{{ 'CHECKOUT.AMOUNT_PAID' | translate }}:</span>
              <span class="detail-value">{{ orderData.amountPaid }}</span>
            </div>
            <div class="detail-row" *ngIf="orderData.building">
              <span class="detail-label"></span>
              <span class="detail-value">{{ orderData.building }}</span>
            </div>
            <div class="detail-row" *ngIf="orderData.street">
              <span class="detail-label"></span>
              <span class="detail-value">{{ orderData.street }}</span>
            </div>
            <div class="detail-row" *ngIf="orderData.zone">
              <span class="detail-label"></span>
              <span class="detail-value">{{ orderData.zone }}</span>
            </div>
            <div class="detail-row" *ngIf="orderData.district || orderData.city">
              <span class="detail-label"></span>
              <span class="detail-value">{{ orderData.district }} {{ orderData.city }}، {{ orderData.country }}</span>
            </div>
            <div class="detail-row" *ngIf="orderData.apartment">
              <span class="detail-label"></span>
              <span class="detail-value">{{ orderData.apartment }}</span>
            </div>
          </div>

          <button class="return-home-btn" (click)="returnToHome()">
            {{ 'CHECKOUT.RETURN_TO_HOME' | translate }}
          </button>

          <div class="delivery-estimate">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.9375 6.1875H6.875C6.51033 6.1875 6.16059 6.33237 5.90273 6.59023C5.64487 6.84809 5.5 7.19783 5.5 7.5625V13.8944C7.09156 14.3509 8.25 15.8345 8.25 17.5594C8.25 18.0022 7.9585 18.3886 7.54875 18.5171L7.54325 18.5625H13.5245C13.0269 18.1604 12.6662 17.6139 12.4921 16.9983C12.318 16.3827 12.339 15.7283 12.5522 15.1251C12.7654 14.522 13.1604 13.9997 13.6827 13.6303C14.205 13.2609 14.829 13.0626 15.4688 13.0625H18.2779C18.6182 13.0625 18.9447 13.1182 19.25 13.2213V13.0625C19.25 12.5155 19.0327 11.9909 18.6459 11.6041C18.2591 11.2173 17.7345 11 17.1875 11H9.96875C9.87758 11 9.79015 11.0362 9.72568 11.1007C9.66122 11.1651 9.625 11.2526 9.625 11.3438V12.375C9.625 12.7397 9.76987 13.0894 10.0277 13.3473C10.2856 13.6051 10.6353 13.75 11 13.75H11.3438C11.6173 13.75 11.8796 13.8586 12.073 14.052C12.2664 14.2454 12.375 14.5077 12.375 14.7812C12.375 15.0548 12.2664 15.3171 12.073 15.5105C11.8796 15.7038 11.6173 15.8125 11.3438 15.8125H8.70856C8.58694 15.8125 8.47031 15.7642 8.38431 15.6782C8.29831 15.5922 8.25 15.4756 8.25 15.3539V7.5625H8.9375C9.11984 7.5625 9.2947 7.49007 9.42364 7.36114C9.55257 7.2322 9.625 7.05734 9.625 6.875C9.625 6.69266 9.55257 6.5178 9.42364 6.38886C9.2947 6.25993 9.11984 6.1875 8.9375 6.1875Z" fill="currentColor"/>
              <path d="M10.7711 8.9375C10.1386 8.9375 9.625 9.45037 9.625 10.0836C9.625 10.2101 9.72813 10.3125 9.85394 10.3125H15.5836C15.7101 10.3125 15.8125 10.2094 15.8125 10.0836C15.8125 9.45106 15.2996 8.9375 14.6664 8.9375H10.7711ZM6.875 18.2188C6.87441 18.5489 6.80588 18.8754 6.67369 19.1779C6.54149 19.4804 6.34846 19.7525 6.1066 19.9772C5.86473 20.2019 5.57921 20.3745 5.2678 20.4841C4.95639 20.5938 4.62576 20.6381 4.29646 20.6145C3.96716 20.5909 3.64625 20.4997 3.3537 20.3467C3.06114 20.1937 2.80319 19.9822 2.59591 19.7252C2.38862 19.4682 2.23643 19.1714 2.14881 18.8531C2.06118 18.5348 2.03999 18.2018 2.08656 17.875H1.68781C1.60465 17.8741 1.5252 17.8405 1.46665 17.7814C1.4081 17.7223 1.37518 17.6426 1.375 17.5594C1.375 15.851 2.76031 14.4375 4.46875 14.4375C6.17719 14.4375 7.5625 15.851 7.5625 17.5594C7.56233 17.6425 7.52949 17.7221 7.47109 17.7812C7.41269 17.8402 7.33341 17.8739 7.25037 17.875H6.85094C6.86698 17.9873 6.875 18.1019 6.875 18.2188ZM3.49594 17.875C3.44124 18.0305 3.42461 18.1969 3.44745 18.3601C3.47029 18.5234 3.53193 18.6788 3.62721 18.8133C3.72249 18.9478 3.84862 19.0575 3.99504 19.1332C4.14147 19.209 4.30391 19.2485 4.46875 19.2485C4.63359 19.2485 4.79603 19.209 4.94246 19.1332C5.08888 19.0575 5.21501 18.9478 5.31029 18.8133C5.40557 18.6788 5.46721 18.5234 5.49005 18.3601C5.51289 18.1969 5.49626 18.0305 5.44156 17.875H3.49594ZM19.9134 18.5625C19.8302 19.1369 19.5422 19.6619 19.1025 20.0408C18.6628 20.4197 18.101 20.6269 17.5206 20.6243C16.9402 20.6217 16.3803 20.4095 15.944 20.0267C15.5077 19.6439 15.2244 19.1163 15.1463 18.5412C14.541 18.4601 13.9892 18.1519 13.6027 17.679C13.2162 17.2061 13.024 16.604 13.065 15.9947C13.106 15.3853 13.3772 14.8144 13.8235 14.3976C14.2699 13.9808 14.858 13.7493 15.4688 13.75H18.2779C18.9004 13.75 19.4974 13.9973 19.9375 14.4375C20.3777 14.8776 20.625 15.4746 20.625 16.0971V17.875C20.625 18.0573 20.5526 18.2322 20.4236 18.3611C20.2947 18.4901 20.1198 18.5625 19.9375 18.5625H19.9134ZM16.5584 18.5625C16.6293 18.7639 16.7609 18.9384 16.9352 19.0618C17.1094 19.1852 17.3177 19.2515 17.5312 19.2515C17.7448 19.2515 17.9531 19.1852 18.1273 19.0618C18.3016 18.9384 18.4332 18.7639 18.5041 18.5625H16.5584Z" fill="currentColor"/>
            </svg>
            <span>{{ 'CART.DELIVERY_TIME' | translate }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .breadcrumb-container {
      padding: 1rem 7rem;
      background-color: #ffffff;
      direction: rtl;
      display: flex;
      align-items: flex-start;
    }

    @media (max-width: 1200px) {
      .breadcrumb-container {
        padding: 1rem 3rem;
      }
    }

    @media (max-width: 992px) {
      .breadcrumb-container {
        padding: 1rem 2rem;
      }
    }

    .breadcrumb-nav {
      font-family: 'Almarai', sans-serif;
      font-size: 0.9rem;
      color: #666;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
    }

    .breadcrumb-nav a {
      color: #d32f2f;
      text-decoration: none;
    }

    .breadcrumb-nav span {
      margin: 0 0.5rem;
    }

    .checkout-content-wrapper {
      background-color: #ffffff;
      padding: 2rem 0;
      width: 100%;
    }

    .checkout-grid-container {
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: 2rem;
      width: 100%;
      align-items: start;
      padding: 0 2rem;
    }

    @media (max-width: 1200px) {
      .checkout-grid-container {
        gap: 1.5rem;
        padding: 0 1.5rem;
      }
    }

    @media (max-width: 992px) {
      .checkout-grid-container {
        grid-template-columns: 1fr;
        gap: 1.5rem;
        padding: 0 1rem;
      }
    }

    .sidebar-wrapper {
      width: 100%;
      background: #FFFFFF;
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
    }

    .sidebar-content {
      direction: rtl;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }

    .order-summary {
      width: 100%;
      background: white;
      border-radius: 10px;
      border: 1px solid #F1F1F1;
      padding: 20px 18px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      display: flex;
      flex-direction: column;
      gap: 10px;
      font-family: 'Alexandria', sans-serif;
      font-weight: 700;
      font-style: normal;
      font-size: 16px;
      line-height: 100%;
      letter-spacing: 0%;
      text-align: right;
    }

    .summary-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0;
      color: #333;
    }

    .summary-item-total {
      border-bottom: 1px solid #EBE9E9;
      padding-bottom: .5rem;
    }

    .discount-section {
      padding-top: .5rem;
      border-top: 1px solid #e0e0e0;
    }

    .discount-input-group {
      position: relative;
      width: 100%;
    }

    .discount-input {
      width: 100%;
      height: 47px;
      border-radius: 10px;
      background: #F3F2F2;
      padding: 0.75rem;
      padding-right: 15px;
      border: 1px solid #ddd;
      font-size: 0.9rem;
    }

    .discount-btn {
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 118px;
      height: 47px;
      padding: 9px 14px;
      background: #FDC55E;
      color: #343538;
      border: none;
      border-radius: 10px;
      font-family: 'Alexandria', sans-serif;
      font-weight: 600;
      font-size: 16px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      z-index: 1;
    }

    .discount-btn:hover {
      background: #E8B84D;
    }

    .summary-total {
      display: flex;
      justify-content: space-between;
      margin-bottom: .5rem;
      padding-top: 1rem;
      border-top: 1px solid #B3B3B3;
      font-size: 1.25rem;
      font-weight: bold;
      color: #d32f2f;
    }

    .total-amount {
      color: #d32f2f;
    }

    .terms-delivery-container {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      gap: 1rem;
      margin-top: 1rem;
    }

    .terms-section {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .terms-checked {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
    }

    .create-account-section {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .create-account-unchecked {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
    }

    .create-account-checked {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
    }

    .terms-checkmark {
      width: 24px;
      height: 24px;
    }

    .terms-label {
      color: #666;
      font-size: 0.9rem;
    }

    .terms-checkbox {
      font-size: 0.9rem;
      color: #666;
    }

    .delivery-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #666;
      font-size: 0.9rem;
    }

    .checkout-form-wrapper {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }

    .checkout-content {
      direction: rtl;
      width: 100%;
    }

    .checkout-title-section {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2rem;
      padding-bottom: 0.5rem;
      width: 100%;
    }

    .checkout-title {
      font-family: 'Almarai', sans-serif;
      font-weight: 700;
      font-size: 2rem;
      color: #d32f2f;
      margin: 0;
    }

    .checkout-form {
      width: 100%;
      background: white;
      border-radius: 15px;
      padding: 2rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .form-section {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .section-title {
      font-family: 'Almarai', sans-serif;
      font-weight: 700;
      font-size: 1.25rem;
      color: #333;
      margin: 0;
      display:flex;
    }

    .radio-group {
      display: flex;
    }

    .radio-group ::ng-deep mat-radio-group {
      display: flex;
      flex-direction: row;
      gap: 0.75rem;
      justify-content: flex-start;
      width: 100%;
    }

    .radio-option {
      font-family: 'Almarai', sans-serif;
      font-weight: 400;
      font-style: normal;
      font-size: 16px;
      line-height: 100%;
      letter-spacing: 0%;
      text-align: right;
      color: #333;
      display: flex;
      align-items: center;
      gap: 10px;
      background-color: #F9F9F9;
      width: 234px;
      min-height: 56px;
      border-radius: 10px;
      padding: 16px 24px;
      box-sizing: border-box;
      white-space: nowrap;
    }

    .radio-option-transparent {
      background-color: transparent !important;
    }

    .radio-option-disabled {
      opacity: 0.7;
      cursor: not-allowed;
      position: relative;
    }

    .radio-option-disabled ::ng-deep .mdc-radio {
      opacity: 0.5;
      pointer-events: none;
    }

    .visa-label {
      display: inline-flex;
      align-items: center;
    }

    .coming-soon-badge {
      font-family: 'Almarai', sans-serif;
      font-weight: 600;
      font-size: 11px;
      color: #FDC55E;
      background-color: rgba(253, 197, 94, 0.15);
      padding: 3px 8px;
      border-radius: 6px;
      margin-right: 8px;
      white-space: nowrap;
      border: 1px solid rgba(253, 197, 94, 0.3);
      display: inline-flex;
      align-items: center;
    }

    .radio-option svg {
      width: 24px;
      height: 24px;
      flex-shrink: 0;
    }

    .radio-option .pi {
      font-size: 24px;
      width: 24px;
      height: 24px;
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .radio-option ::ng-deep .mdc-radio__label {
      font-family: 'Almarai', sans-serif;
      font-weight: 400;
      font-style: normal;
      font-size: 16px;
      line-height: 100%;
      letter-spacing: 0%;
      text-align: right;
    }

    .radio-option-transparent ::ng-deep .mdc-radio-button {
      background-color: transparent !important;
    }

    .radio-option-transparent ::ng-deep .mat-mdc-radio-button {
      background-color: transparent !important;
    }

    /* Payment Method Specific Styling - More Prominent */
    .payment-method-section {
      margin-top: 2rem;
      margin-bottom: 1.5rem;
    }

    .payment-method-title {
      font-weight: 700 !important;
      font-size: 20px !important;
      color: #d32f2f !important;
      margin-bottom: 1.25rem !important;
    }

    .payment-method-group {
      gap: 1rem !important;
    }

    .payment-option {
      font-weight: 700 !important;
      font-size: 18px !important;
      background-color: #ffffff !important;
      border: 2px solid #e0e0e0 !important;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08) !important;
      transition: all 0.3s ease !important;
      min-height: 64px !important;
      padding: 18px 28px !important;
    }

    .payment-option:hover:not(.radio-option-disabled) {
      border-color: #d32f2f !important;
      box-shadow: 0 4px 12px rgba(211, 47, 47, 0.15) !important;
      transform: translateY(-2px);
    }

    .payment-option ::ng-deep .mdc-radio {
      width: 24px !important;
      height: 24px !important;
    }

    .payment-option ::ng-deep .mdc-radio__outer-circle,
    .payment-option ::ng-deep .mdc-radio__inner-circle {
      border-width: 2.5px !important;
    }

    .payment-option.mat-mdc-radio-checked {
      background-color: #fff5f5 !important;
      border-color: #d32f2f !important;
      box-shadow: 0 4px 16px rgba(211, 47, 47, 0.2) !important;
    }

    .payment-option.mat-mdc-radio-checked ::ng-deep .mdc-radio__outer-circle {
      border-color: #d32f2f !important;
    }

    .payment-option.mat-mdc-radio-checked ::ng-deep .mdc-radio__inner-circle {
      background-color: #d32f2f !important;
    }

    .payment-label {
      font-weight: 700 !important;
      font-size: 18px !important;
      color: #333 !important;
      padding-inline: 1rem;
    }

    .payment-option .pi {
      font-size: 28px !important;
      width: 28px !important;
      height: 28px !important;
      color: #d32f2f !important;
    }

    .payment-option svg {
      width: 28px !important;
      height: 28px !important;
      color: #666 !important;
    }

    .payment-option.radio-option-disabled {
      opacity: 0.6 !important;
      background-color: #f5f5f5 !important;
    }

    .calendar-icon {
      width: 24px;
      height: 24px;
      color: #666;
      background: transparent !important;
      background-color: transparent !important;
      flex-shrink: 0;
    }

    .calendar-icon,
    .calendar-icon svg {
      background: transparent !important;
      background-color: transparent !important;
    }

    .calendar-icon g,
    .calendar-icon rect,
    .calendar-icon clipPath rect {
      fill: transparent !important;
      background: transparent !important;
      background-color: transparent !important;
    }

    .date-input {
      width: 100%;
      height: 47px;
      border-radius: 10px;
      background: #F3F2F2;
      padding: 0.75rem;
      padding-right: 15px;
      border: 1px solid #ddd;
      font-size: 0.9rem;
      font-family: 'Alexandria', sans-serif;
      margin-top: 0.5rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-group.full-width {
      grid-column: 1 / -1;
    }

    .float-label-wrapper {
      position: relative;
      width: 100%;
    }

    .float-label-wrapper label {
      position: absolute;
      right: 15px;
      top: 50%;
      transform: translateY(-50%);
      font-family: 'Alexandria', sans-serif;
      font-weight: 600;
      font-size: 14px;
      color: #666;
      pointer-events: none;
      transition: all 0.3s ease;
      background: #F3F2F2;
      padding: 0 4px;
      opacity: 0;
      z-index: 1;
      white-space: nowrap;
    }

    .float-label-wrapper input:focus ~ label,
    .float-label-wrapper input:not(:placeholder-shown) ~ label {
      top: 0;
      transform: translateY(-50%);
      font-size: 12px;
      color: #333;
      opacity: 1;
    }

    .float-label-wrapper select:focus ~ label,
    .float-label-wrapper select.has-value ~ label {
      top: 0;
      transform: translateY(-50%);
      font-size: 12px;
      color: #333;
      opacity: 1;
    }

    .required-asterisk {
      color: #F00E0C;
      margin-right: 4px;
    }

    .form-input {
      width: 100%;
      height: 47px;
      border-radius: 10px;
      background: #F3F2F2;
      padding: 0.75rem;
      padding-right: 15px;
      border: 1px solid #ddd;
      font-size: 0.9rem;
      font-family: 'Alexandria', sans-serif;
      text-align: right;
      direction: rtl;
    }

    .form-input::placeholder {
      color: #999;
    }

    .form-input:focus::placeholder {
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    /* Style placeholder to show asterisk - we'll use a workaround */
    .float-label-wrapper input::placeholder {
      color: #999;
    }

    /* For selects, show label when value is selected */
    .float-label-wrapper select option[value=""] {
      color: #999;
    }

    .form-select {
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%23333' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: left 15px center;
      padding-left: 40px;
    }

    .validation-messages {
      margin-top: 1rem;
      margin-bottom: 0.5rem;
      padding: 1rem;
      background-color: #fff5f5;
      border: 1px solid #fecaca;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .validation-message {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #F00E0C;
      font-family: 'Almarai', sans-serif;
      font-size: 14px;
      font-weight: 500;
    }

    .validation-message svg {
      flex-shrink: 0;
    }

    .payment-btn {
      width: 100%;
      height: 50px;
      padding: 12px 10px;
      border-radius: 100px;
      border: 1px solid transparent;
      background: #F00E0C !important;
      background-color: #F00E0C !important;
      color: white !important;
      margin-top: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      font-family: 'Almarai', sans-serif;
      font-weight: 600;
      font-size: 18px;
    }

    .payment-btn:disabled {
      background-color: #ccc !important;
      color: #666 !important;
    }

    .order-summary-mobile {
      display: none;
    }

    @media (max-width: 767px) {
      /* Remove padding from checkout content wrapper */
      .checkout-content-wrapper {
        padding: 0;
      }

      /* Update checkout title section */
      .checkout-title-section {
        margin-bottom: 0;
        padding-inline: 0.5rem;
      }

      /* Update checkout form */
      .checkout-form {
        box-shadow: none;
      }

      /* Hide sidebar order summary on mobile */
      .sidebar-wrapper {
        display: none;
      }

      /* Show mobile order summary inside form */
      .order-summary-mobile {
        display: block;
        width: 100%;
        margin-top: 1rem;
        margin-bottom: 1rem;
      }
    }

    @media (max-width: 768px) {
      .breadcrumb-container {
        padding: 1rem;
      }

      .checkout-grid-container {
        gap: 1rem;
        padding: 0 0.5rem;
      }

      .checkout-form {
        padding: 1rem;
        gap: 1.5rem;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .checkout-title {
        font-size: 1.5rem;
      }

      /* Radio group stacks vertically on mobile */
      .radio-group ::ng-deep mat-radio-group {
        flex-direction: column;
        gap: 0.5rem;
      }

      .radio-option {
        width: 100%;
        box-sizing: border-box;
      }

      /* Terms & delivery stack on mobile */
      .terms-delivery-container {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.75rem;
      }

      /* Discount button stacks below input */
      .discount-input-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .discount-input {
        padding-right: 1rem;
        padding-left: 1rem;
      }

      .discount-btn {
        position: static;
        transform: none;
        width: 100%;
        height: 44px;
      }
    }

    @media (max-width: 480px) {
      .checkout-form {
        padding: 0.75rem;
        border-radius: 10px;
      }

      .checkout-title {
        font-size: 1.25rem;
      }

      .section-title {
        font-size: 1rem;
      }

      .payment-btn {
        font-size: 16px;
      }
    }

    .order-success-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      backdrop-filter: blur(4px);
    }
    .order-success-modal {
      position: relative;
      width: 493px;
      height: 693px;
      background-color: #FDC04033;
      border-radius: 20px;
      padding: 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
      direction: rtl;
      overflow-y: auto;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
      font-family: 'Almarai', sans-serif;
      font-weight: 700;
      font-style: normal;
      font-size: 14px;
      line-height: 100%;
      letter-spacing: 0%;
      text-align: right;
    }

    .order-success-modal::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: url('/assets/Bashwat-logo.png');
      background-size: 200px auto;
      background-position: center;
      background-repeat: no-repeat;
      opacity: 0.1;
      z-index: 0;
      pointer-events: none;
      border-radius: 20px;
    }

    .order-success-modal > * {
      position: relative;
      z-index: 1;
    }

    .close-modal-btn {
      position: absolute;
      top: 1rem;
      left: 1rem;
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
    }

    .success-icon {
      margin-top: 0rem;
    }

    .success-circle {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: #F00E0C;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
    }

    .success-title {
      font-family: 'Almarai', sans-serif;
      font-weight: 700;
      font-size: 1.5rem;
      color: #F00E0C;
      margin: 0;
      text-align: center;
    }

    .success-subtitle {
      font-family: 'Almarai', sans-serif;
      font-weight: 400;
      font-size: 1rem;
      color: #FDC55E;
      text-align: center;
      margin: 0;
    }

    .order-details {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-top: 1rem;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1rem;
      font-family: 'Almarai', sans-serif;
      font-weight: 700;
      font-size: 14px;
      line-height: 100%;
      letter-spacing: 0%;
      text-align: right;
      color: #000000 !important;
     font-weight: 600 !important;
    }

    .detail-label {
      font-weight: 700;
      color: #333;
      flex-shrink: 0;
    }

    .detail-value {
      font-weight: 700;
      color: #666;
      text-align: right;
      flex: 1;
    }

    .return-home-btn {
      width: 100%;
      padding: 1rem;
      background: #F00E0C;
      color: white;
      border: none;
      border-radius: 10px;
      font-family: 'Almarai', sans-serif;
      font-weight: 700;
      font-size: 1rem;
      cursor: pointer;
      margin-top: auto;
      transition: background-color 0.3s ease;
    }

    .return-home-btn:hover {
      background: #D00C0A;
    }

    .delivery-estimate {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #666;
      font-size: 0.9rem;
      font-family: 'Alexandria', sans-serif;
      margin-top: 0.5rem;
    }

    @media (max-width: 768px) {
      .order-success-modal {
        width: 90%;
        max-width: 493px;
        height: auto;
        max-height: 90vh;
        padding: 1.5rem;
      }
    }
    
  `]
})
export class CheckoutComponent implements OnInit, OnDestroy {
  cart$!: Observable<Cart>;
  discountCode: string = '';
  appliedDiscount: number = 0;
  termsAccepted: boolean = true;
  minDate: string = '';
  createAccount: boolean = false;
  showOrderSuccess: boolean = false;
  orderData: any = null;
  checkoutForm!: FormGroup;
  isAuthenticated: boolean = false;
  isSubmitting: boolean = false;
  currentUser: User | null = null;
  private authSubscription?: Subscription;
  private langChangeSubscription?: Subscription;

  // ─── Location data (loaded from API) ───────────────────────────────────────
  cities: CityWithDetails[] = [];
  filteredDistricts: District[] = [];
  filteredAreas: Area[] = [];
  deliveryFees: number = 0;
  citiesLoading: boolean = false;

  get isAr(): boolean {
    return (this.translate.currentLang || 'ar') === 'ar';
  }

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router,
    private fb: FormBuilder,
    private translate: TranslateService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private viewportScroller: ViewportScroller,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
  ) {
    // Set minimum date to today
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];

    // Initialize reactive form
    this.checkoutForm = this.fb.group({
      deliveryMethod: ['home', Validators.required],
      deliveryDateOption: ['today', Validators.required],
      selectedDate: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      city: ['', Validators.required],
      district: ['', Validators.required],
      area: [''],
      propertyStreet: [''],
      floor: [''],
      apartment: [''],
      paymentMethod: ['cash', Validators.required],
      password: ['']
    });
  }

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.updateFormValidation();

    // Subscribe to current user to get user data when authenticated
    this.authSubscription = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    // Subscribe to language changes to update nameEn/nameAr displays
    this.langChangeSubscription = this.translate.onLangChange.subscribe(() => {
      this.cdr.detectChanges();
    });

    this.cart$ = this.cartService.cart$;
    const cart = this.cartService.getCart();
    if (cart.items.length === 0) {
      this.router.navigate(['/cart']);
    }

    // ── Load cities from API ───────────────────────────────────────────────
    this.citiesLoading = true;
    this.orderService.getCitiesWithDetails().subscribe({
      next: (data) => {
        this.cities = data;
        this.citiesLoading = false;
        // Attempt geolocation after cities are available
        this.getLocationIfInQatar();
      },
      error: () => {
        this.citiesLoading = false;
        this.getLocationIfInQatar();
      },
    });

    // ── Conditional date validation ─────────────────────────────────────────
    this.checkoutForm.get('deliveryDateOption')?.valueChanges.subscribe(value => {
      const selectedDateControl = this.checkoutForm.get('selectedDate');
      if (value === 'choose') {
        selectedDateControl?.setValidators([Validators.required]);
      } else {
        selectedDateControl?.clearValidators();
        selectedDateControl?.setValue('');
      }
      selectedDateControl?.updateValueAndValidity();
    });

    // ── Cascade city → districts + delivery fee ─────────────────────────────
    this.checkoutForm.get('city')?.valueChanges.subscribe((cityId: number) => {
      this.checkoutForm.get('district')?.setValue('');
      this.checkoutForm.get('area')?.setValue('');
      this.filteredAreas = [];

      const selected = this.cities.find(c => c.id === Number(cityId));
      this.filteredDistricts = selected?.districts ?? [];

      // Only update delivery fees if delivery method is 'home' (not pickup)
      if (this.checkoutForm.get('deliveryMethod')?.value === 'home') {
        this.deliveryFees = selected?.deliveryFees ?? 0;
      }
    });

    // ── Cascade district → areas ────────────────────────────────────────────
    this.checkoutForm.get('district')?.valueChanges.subscribe((districtId: number) => {
      this.checkoutForm.get('area')?.setValue('');
      const selected = this.filteredDistricts.find(d => d.id === Number(districtId));
      this.filteredAreas = selected?.areas ?? [];
    });

    // ── Handle delivery method changes (pickup vs delivery) ───────────────────
    this.checkoutForm.get('deliveryMethod')?.valueChanges.subscribe((method: string) => {
      const cityControl = this.checkoutForm.get('city');
      const districtControl = this.checkoutForm.get('district');
      const areaControl = this.checkoutForm.get('area');
      const propertyStreetControl = this.checkoutForm.get('propertyStreet');
      const floorControl = this.checkoutForm.get('floor');
      const apartmentControl = this.checkoutForm.get('apartment');

      if (method === 'pickup') {
        // Set delivery fees to 0 for pickup
        this.deliveryFees = 0;

        // Remove required validators from all delivery address fields
        cityControl?.clearValidators();
        districtControl?.clearValidators();
        areaControl?.clearValidators();
        propertyStreetControl?.clearValidators();
        floorControl?.clearValidators();
        apartmentControl?.clearValidators();

        // Clear values
        cityControl?.setValue('');
        districtControl?.setValue('');
        areaControl?.setValue('');
        propertyStreetControl?.setValue('');
        floorControl?.setValue('');
        apartmentControl?.setValue('');
        this.filteredDistricts = [];
        this.filteredAreas = [];
      } else {
        // Restore required validators for delivery
        cityControl?.setValidators([Validators.required]);
        districtControl?.setValidators([Validators.required]);
        areaControl?.clearValidators(); // Area is optional
        propertyStreetControl?.clearValidators(); // Property street is optional
        floorControl?.clearValidators(); // Floor is optional
        apartmentControl?.clearValidators(); // Apartment is optional
      }

      cityControl?.updateValueAndValidity({ emitEvent: false });
      districtControl?.updateValueAndValidity({ emitEvent: false });
      areaControl?.updateValueAndValidity({ emitEvent: false });
      propertyStreetControl?.updateValueAndValidity({ emitEvent: false });
      floorControl?.updateValueAndValidity({ emitEvent: false });
      apartmentControl?.updateValueAndValidity({ emitEvent: false });
    });
  }

  toggleCreateAccount(): void {
    this.createAccount = !this.createAccount;
    this.updatePasswordValidation();
  }

  updateFormValidation(): void {
    const firstNameControl = this.checkoutForm.get('firstName');
    const lastNameControl = this.checkoutForm.get('lastName');
    const phoneControl = this.checkoutForm.get('phone');
    const emailControl = this.checkoutForm.get('email');

    if (this.isAuthenticated) {
      // Remove validators for logged-in users
      firstNameControl?.clearValidators();
      lastNameControl?.clearValidators();
      phoneControl?.clearValidators();
      emailControl?.clearValidators();
    } else {
      // Add validators for non-logged-in users
      firstNameControl?.setValidators([Validators.required]);
      lastNameControl?.setValidators([Validators.required]);
      phoneControl?.setValidators([Validators.required]);
      emailControl?.setValidators([Validators.required, Validators.email]);
    }

    firstNameControl?.updateValueAndValidity({ emitEvent: false });
    lastNameControl?.updateValueAndValidity({ emitEvent: false });
    phoneControl?.updateValueAndValidity({ emitEvent: false });
    emailControl?.updateValueAndValidity({ emitEvent: false });
  }

  updatePasswordValidation(): void {
    const passwordControl = this.checkoutForm.get('password');
    if (this.createAccount) {
      passwordControl?.setValidators([Validators.required]);
    } else {
      passwordControl?.clearValidators();
      passwordControl?.setValue('');
    }
    passwordControl?.updateValueAndValidity();
  }

  getLocationIfInQatar(): void {
    if (!navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        // Check if coordinates are within Qatar bounds
        // Qatar approximate bounds: lat 24.4707 to 26.1547, lng 50.7439 to 51.6067
        if (lat >= 24.4 && lat <= 26.2 && lng >= 50.7 && lng <= 51.7) {
          this.reverseGeocode(lat, lng);
        }
      },
      (error) => {
        console.log('Geolocation error:', error);
      },
      { timeout: 5000, enableHighAccuracy: false }
    );
  }

  reverseGeocode(lat: number, lng: number): void {
    // Use OpenStreetMap Nominatim API (free, no API key required)
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`;

    fetch(url, {
      headers: {
        'User-Agent': 'RestaurantApp/1.0'
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data && data.address) {
          const address = data.address;
          const country = address.country_code?.toUpperCase();

          // Only proceed if country is Qatar
          if (country === 'QA') {
            this.populateLocationFields(address);
          }
        }
      })
      .catch(error => {
        console.log('Reverse geocoding error:', error);
      });
  }

  /**
   * Try to auto-select city and district from a Nominatim reverse-geocode result.
   * Matches by nameEn (case-insensitive) against the cities loaded from the API.
   */
  populateLocationFields(address: any): void {
    if (!this.cities.length) { return; }

    const rawCity = (address.city || address.town || address.municipality || address.state_district || '').toLowerCase().trim();
    const rawDistrict = (address.suburb || address.neighbourhood || address.quarter || address.city_district || '').toLowerCase().trim();

    if (!rawCity || this.checkoutForm.get('city')?.value) { return; }

    // Match city by English name (partial match)
    const matchedCity = this.cities.find(c =>
      c.nameEn.toLowerCase().includes(rawCity) || rawCity.includes(c.nameEn.toLowerCase())
    );

    if (matchedCity) {
      this.checkoutForm.get('city')?.setValue(matchedCity.id);
      // city valueChanges will populate filteredDistricts automatically

      if (rawDistrict && matchedCity.districts.length) {
        const matchedDistrict = matchedCity.districts.find(d =>
          d.nameEn.toLowerCase().includes(rawDistrict) || rawDistrict.includes(d.nameEn.toLowerCase())
        );
        if (matchedDistrict && !this.checkoutForm.get('district')?.value) {
          this.checkoutForm.get('district')?.setValue(matchedDistrict.id);
        }
      }
    }
  }

  applyDiscount(): void {
    if (this.discountCode.trim()) {
      this.appliedDiscount = 50; // Mock discount
    }
  }

  formatCurrency(amount: number): string {
    if (amount == null || isNaN(amount)) {
      return '0';
    }
    // Always use English numerals (en-US locale)
    const formattedNumber = amount.toLocaleString('en-US');

    // Get current language and set currency symbol accordingly
    const currentLang = this.translate.currentLang || 'ar';
    const currencySymbol = currentLang === 'ar' ? 'ر.ق' : 'QAR';

    return `${formattedNumber} ${currencySymbol}`;
  }

  getPlaceholder(key: string): string {
    return `${key} *`;
  }

  getFinalTotal(cart: Cart): number {
    return cart.subtotal + this.deliveryFees - this.appliedDiscount;
  }

  submitOrder(): void {
    if (!this.checkoutForm.valid || !this.termsAccepted || this.isSubmitting) {
      return;
    }

    const formValue = this.checkoutForm.value;
    const cart = this.cartService.getCart();

    // ── Allow guest checkout - no authentication required ───────────
    // Removed authentication requirement to allow users to checkout without login

    // ── Convert date to ISO format ───────────────────────────────────────────
    let orderFutureDate: string | undefined;
    if (formValue.deliveryDateOption === 'choose' && formValue.selectedDate) {
      // Convert selected date to ISO format with time
      const selectedDate = new Date(formValue.selectedDate);
      // Set time to current time or default to 12:00 PM
      const now = new Date();
      selectedDate.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
      orderFutureDate = selectedDate.toISOString();
    } else if (formValue.deliveryDateOption === 'today') {
      // For "today", use current date/time
      orderFutureDate = new Date().toISOString();
    }

    // ── Helper function to submit order with token ──────────────────────────
    const submitOrderWithToken = (token?: string) => {
      this.isSubmitting = true;

      // Get customer information from form if user is not authenticated
      const customerName = !this.isAuthenticated && formValue.firstName && formValue.lastName
        ? `${formValue.firstName} ${formValue.lastName}`.trim()
        : undefined;
      const customerEmail = !this.isAuthenticated && formValue.email
        ? formValue.email
        : undefined;
      const customerPhone = !this.isAuthenticated && formValue.phone
        ? formValue.phone
        : undefined;

      this.orderService
        .createOrder(
          formValue.deliveryMethod,
          formValue.paymentMethod,
          Number(formValue.city),
          Number(formValue.district),
          Number(formValue.area) || 0,
          this.deliveryFees,
          cart,
          this.appliedDiscount,
          this.discountCode,
          orderFutureDate,
          token,
          customerName,
          customerEmail,
          customerPhone,
        )
        .subscribe({
          next: (response) => {
            this.isSubmitting = false;
            this.cartService.clearCart();
            this.buildOrderSuccessData(formValue, cart, response.data?.orderNumber);
            this.showOrderSuccess = true;
          },
          error: (error) => {
            this.isSubmitting = false;
            const msg =
              error?.error?.message ||
              error?.message ||
              this.translate.instant('CHECKOUT.ORDER_FAILED');
            this.snackBar.open(msg, this.translate.instant('COMMON.CLOSE'), {
              duration: 5000,
              panelClass: ['error-snackbar'],
            });
          },
        });
    };

    // ── Authenticated users → call the real API directly ────────────────────
    if (this.isAuthenticated) {
      submitOrderWithToken();
      return;
    }

    // ── Non-authenticated users with createAccount → register first ─────────
    if (this.createAccount) {
      this.isSubmitting = true;

      const registerData = {
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        email: formValue.email,
        phone: formValue.phone,
        password: formValue.password,
        confirmPassword: formValue.password, // Set confirmPassword same as password
      };

      this.authService.register(registerData).subscribe({
        next: (registerResponse) => {
          // Registration successful, now submit order with the token
          submitOrderWithToken(registerResponse.token);
        },
        error: (error) => {
          this.isSubmitting = false;
          const msg =
            error?.error?.message ||
            error?.message ||
            this.translate.instant('CHECKOUT.REGISTRATION_FAILED');
          this.snackBar.open(msg, this.translate.instant('COMMON.CLOSE'), {
            duration: 5000,
            panelClass: ['error-snackbar'],
          });
        },
      });
      return;
    }

    // ── Guest users without createAccount → call API without token ─────
    submitOrderWithToken();
  }

  /** Build the data object shown in the success modal. */
  private buildOrderSuccessData(
    formValue: any,
    cart: Cart,
    apiOrderNum: string | undefined,
  ): void {
    const currentLang = this.translate.currentLang || 'en';
    const now = new Date();

    const orderNumber = apiOrderNum
      ?? `${Math.floor(100000 + Math.random() * 900000)}-BRG`;

    const dateTime = now.toLocaleString(currentLang === 'ar' ? 'ar-QA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    const selectedCity = this.cities.find(c => c.id === Number(formValue.city));
    const selectedDistrict = this.filteredDistricts.find(d => d.id === Number(formValue.district));
    const lang = this.translate.currentLang || 'ar';
    const cityLabel = selectedCity
      ? (lang === 'ar' ? selectedCity.nameAr : selectedCity.nameEn) : '';
    const districtTranslated = selectedDistrict
      ? (lang === 'ar' ? selectedDistrict.nameAr : selectedDistrict.nameEn) : '';
    const transactionNumber = `${Math.floor(100000 + Math.random() * 900000)}-TXN`;
    const paymentMethodLabel = formValue.paymentMethod === 'cash'
      ? this.translate.instant('CHECKOUT.CASH')
      : this.translate.instant('CHECKOUT.VISA');

    // Use logged-in user data if authenticated, otherwise use form values
    const firstName = this.isAuthenticated && this.currentUser
      ? this.currentUser.firstName || ''
      : formValue.firstName || '';
    const lastName = this.isAuthenticated && this.currentUser
      ? this.currentUser.lastName || ''
      : formValue.lastName || '';

    this.orderData = {
      firstName,
      lastName,
      orderNumber,
      orderDateTime: dateTime,
      paymentMethodLabel,
      transactionNumber,
      amountPaid: this.formatCurrency(this.getFinalTotal(cart)),
      building: formValue.propertyStreet
        ? this.translate.instant('CHECKOUT.BUILDING') + ' ' + formValue.propertyStreet
        : '',
      street: '',
      zone: formValue.area
        ? this.translate.instant('CHECKOUT.ZONE') + ' ' + formValue.area
        : '',
      district: districtTranslated,
      city: cityLabel,
      country: 'Qatar',
      apartment: formValue.apartment
        ? this.translate.instant('CHECKOUT.APARTMENT') + ' ' + formValue.apartment
        : '',
    };

  }

  getValidationMessages(): string[] {
    const messages: string[] = [];
    const form = this.checkoutForm;

    // Check terms acceptance
    if (!this.termsAccepted) {
      messages.push(this.translate.instant('CHECKOUT.TERMS_REQUIRED'));
    }

    // Removed create account requirement - allow guest checkout
    // if (!this.isAuthenticated && !this.createAccount) {
    //   messages.push(this.translate.instant('CHECKOUT.CREATE_ACCOUNT_REQUIRED'));
    // }

    // Check delivery method
    if (!form.get('deliveryMethod')?.value) {
      messages.push(this.translate.instant('CHECKOUT.DELIVERY_METHOD_REQUIRED'));
    }

    // Check delivery date option
    if (!form.get('deliveryDateOption')?.value) {
      messages.push(this.translate.instant('CHECKOUT.DELIVERY_DATE_REQUIRED'));
    }

    // Check selected date if "choose" is selected
    if (form.get('deliveryDateOption')?.value === 'choose' && !form.get('selectedDate')?.value) {
      messages.push(this.translate.instant('CHECKOUT.SELECTED_DATE_REQUIRED'));
    }

    // Check customer details for non-authenticated users
    if (!this.isAuthenticated) {
      if (form.get('firstName')?.invalid) {
        messages.push(this.translate.instant('CHECKOUT.FIRST_NAME_REQUIRED'));
      }
      if (form.get('lastName')?.invalid) {
        messages.push(this.translate.instant('CHECKOUT.LAST_NAME_REQUIRED'));
      }
      if (form.get('phone')?.invalid) {
        messages.push(this.translate.instant('CHECKOUT.PHONE_REQUIRED'));
      }
      if (form.get('email')?.invalid) {
        if (form.get('email')?.errors?.['required']) {
          messages.push(this.translate.instant('CHECKOUT.EMAIL_REQUIRED'));
        } else if (form.get('email')?.errors?.['email']) {
          messages.push(this.translate.instant('CHECKOUT.EMAIL_INVALID'));
        }
      }
      if (this.createAccount && form.get('password')?.invalid) {
        messages.push(this.translate.instant('CHECKOUT.PASSWORD_REQUIRED'));
      }
    }

    // Check delivery address (only for home delivery)
    if (form.get('deliveryMethod')?.value === 'home') {
      if (form.get('city')?.invalid) {
        messages.push(this.translate.instant('CHECKOUT.CITY_REQUIRED'));
      }
      if (form.get('district')?.invalid) {
        messages.push(this.translate.instant('CHECKOUT.DISTRICT_REQUIRED'));
      }
    }

    // Check payment method
    if (!form.get('paymentMethod')?.value) {
      messages.push(this.translate.instant('CHECKOUT.PAYMENT_METHOD_REQUIRED'));
    }

    return messages;
  }

  closeOrderSuccess(): void {
    this.showOrderSuccess = false;
    this.orderData = null;
    this.router.navigate(['/']).then(() => {
      // Scroll to top using multiple methods to ensure it works
      window.scrollTo(0, 0);
      this.viewportScroller.scrollToPosition([0, 0]);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }
  }

  returnToHome(): void {
    this.closeOrderSuccess();
    this.router.navigate(['/']);
  }
}

