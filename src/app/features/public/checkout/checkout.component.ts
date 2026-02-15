import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatRadioModule } from '@angular/material/radio';
import { SharedModule } from '../../../shared/shared.module';
import { CartService } from '../../../core/services/cart.service';
import { Cart } from '../../../models/menu-item.model';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, SharedModule, TranslateModule, ReactiveFormsModule, MatRadioModule],
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
                      <span>{{ formatCurrency(cart.deliveryFee) }}</span>
                    </div>
                    
                    <!-- Discount Code -->
                    <div class="discount-section">
                      <div class="discount-input-group">
                        <input 
                          type="text" 
                          class="discount-input" 
                          [placeholder]="'CART.DISCOUNT_PLACEHOLDER' | translate"
                          [(ngModel)]="discountCode"
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
                          <mat-radio-button value="today" class="radio-option">
                            {{ 'CHECKOUT.TODAY_90_MINUTES' | translate }}
                          </mat-radio-button>
                          <mat-radio-button value="choose" class="radio-option">
                            {{ 'CHECKOUT.CHOOSE_DATE' | translate }}
                            <svg *ngIf="checkoutForm.get('deliveryDateOption')?.value === 'choose'" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="calendar-icon">
                              <path d="M15 2V4M5 2V4M2.5 8.5H17.5M3.75 4.5H16.25C16.913 4.5 17.5489 4.76339 18.0178 5.23223C18.4866 5.70107 18.75 6.33696 18.75 7V15.5C18.75 16.163 18.4866 16.7989 18.0178 17.2678C17.5489 17.7366 16.913 18 16.25 18H3.75C3.08696 18 2.45107 17.7366 1.98223 17.2678C1.51339 16.7989 1.25 16.163 1.25 15.5V7C1.25 6.33696 1.51339 5.70107 1.98223 5.23223C2.45107 4.76339 3.08696 4.5 3.75 4.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
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
                    <div class="form-section">
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

                    <!-- Delivery Address -->
                    <div class="form-section">
                      <h3 class="section-title">{{ 'CHECKOUT.DELIVERY_ADDRESS' | translate }}</h3>
                      <div class="form-row">
                        <div class="form-group full-width">
                          <div class="float-label-wrapper">
                            <select formControlName="city" class="form-input form-select" id="city" [class.has-value]="checkoutForm.get('city')?.value">
                              <option value="">{{ 'CHECKOUT.SELECT_CITY' | translate }}</option>
                              <option value="doha">{{ 'CHECKOUT.DOHA' | translate }}</option>
                              <option value="al-rayyan">{{ 'CHECKOUT.AL_RAYYAN' | translate }}</option>
                              <option value="al-wakrah">{{ 'CHECKOUT.AL_WAKRAH' | translate }}</option>
                            </select>
                            <label for="city">{{ 'CHECKOUT.CITY' | translate }}<span class="required-asterisk">*</span></label>
                          </div>
                        </div>
                      </div>
                      <div class="form-row">
                        <div class="form-group full-width">
                          <div class="float-label-wrapper">
                            <select formControlName="district" class="form-input form-select" id="district" [class.has-value]="checkoutForm.get('district')?.value">
                              <option value="">{{ 'CHECKOUT.SELECT_DISTRICT' | translate }}</option>
                            </select>
                            <label for="district">{{ 'CHECKOUT.DISTRICT' | translate }}<span class="required-asterisk">*</span></label>
                          </div>
                        </div>
                      </div>
                      <div class="form-row">
                        <div class="form-group full-width">
                          <div class="float-label-wrapper">
                            <select formControlName="area" class="form-input form-select" id="area" [class.has-value]="checkoutForm.get('area')?.value">
                              <option value="">{{ 'CHECKOUT.SELECT_AREA' | translate }}</option>
                            </select>
                            <label for="area">{{ 'CHECKOUT.AREA' | translate }}<span class="required-asterisk">*</span></label>
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

                    <!-- Payment Button -->
                    <button 
                      type="submit"
                      class="payment-btn" 
                      mat-raised-button
                      [disabled]="!checkoutForm.valid">
                      {{ 'CHECKOUT.PAYMENT' | translate }}
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 4H3C1.89543 4 1 4.89543 1 6V18C1 19.1046 1.89543 20 3 20H21C22.1046 20 23 19.1046 23 18V6C23 4.89543 22.1046 4 21 4Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M1 10H23" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </ng-container>
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
      right: 315px;
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
      height: 56px;
      border-radius: 10px;
      padding: 16px 24px;
      box-sizing: border-box;
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

    .calendar-icon {
      width: 20px;
      height: 20px;
      color: #666;
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

    @media (max-width: 768px) {
      .checkout-grid-container {
        gap: 1rem;
        padding: 0 0.5rem;
      }

      .checkout-form {
        padding: 1.5rem;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .checkout-title {
        font-size: 1.5rem;
      }
    }
  `]
})
export class CheckoutComponent implements OnInit {
  cart$!: Observable<Cart>;
  discountCode: string = '';
  appliedDiscount: number = 0;
  termsAccepted: boolean = true;
  minDate: string = '';
  checkoutForm!: FormGroup;

  constructor(
    private cartService: CartService,
    private router: Router,
    private fb: FormBuilder
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
      area: ['', Validators.required],
      propertyStreet: [''],
      floor: [''],
      apartment: ['']
    });
  }

  ngOnInit(): void {
    this.cart$ = this.cartService.cart$;
    const cart = this.cartService.getCart();
    if (cart.items.length === 0) {
      this.router.navigate(['/cart']);
    }

    // Add conditional validation for selectedDate
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
  }

  applyDiscount(): void {
    if (this.discountCode.trim()) {
      this.appliedDiscount = 50; // Mock discount
    }
  }

  formatCurrency(amount: number): string {
    return `${amount.toLocaleString('ar-QA')} ر.ق`;
  }

  getPlaceholder(key: string): string {
    return `${key} *`;
  }

  getFinalTotal(cart: Cart): number {
    return cart.subtotal + cart.deliveryFee - this.appliedDiscount;
  }

  submitOrder(): void {
    if (this.checkoutForm.valid && this.termsAccepted) {
      const formValue = this.checkoutForm.value;
      // TODO: Implement order submission
      console.log('Order submitted:', {
        customerDetails: {
          firstName: formValue.firstName,
          lastName: formValue.lastName,
          phone: formValue.phone,
          email: formValue.email
        },
        deliveryAddress: {
          city: formValue.city,
          district: formValue.district,
          area: formValue.area,
          propertyStreet: formValue.propertyStreet,
          floor: formValue.floor,
          apartment: formValue.apartment
        },
        deliveryMethod: formValue.deliveryMethod,
        deliveryDate: formValue.deliveryDateOption === 'today' ? 'today' : formValue.selectedDate
      });
      // Navigate to order confirmation or success page
    }
  }
}

