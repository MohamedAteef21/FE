import { Color } from './../../../../../node_modules/@kurkle/color/dist/color.d';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SharedModule } from '../../../shared/shared.module';
import { CartService } from '../../../core/services/cart.service';
import { Cart, CartItem, MenuItem, ProductVariant } from '../../../models/menu-item.model';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CategoryService } from '../../../core/services/category.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, SharedModule, TranslateModule, FormsModule],
  template: `
    <div class="container-fluid px-0">
      <!-- Breadcrumb Navigation -->
      <div class="breadcrumb-container">
        <nav class="breadcrumb-nav">
          <a routerLink="/">{{ 'NAV.HOME' | translate }}</a>
          <span> > </span>
          <a routerLink="/menu">{{ 'NAV.MENU' | translate }}</a>
          <span> > </span>
          <span>{{ 'NAV.CART' | translate }}</span>
        </nav>
      </div>

      <!-- Main Content -->
      <div class="cart-content-wrapper">
        <div class="container-fluid px-0">
          <ng-container *ngIf="cart$ | async as cart">
            <div class="cart-grid-container">
              <!-- Order Summary Sidebar -->
              <div class="sidebar-wrapper">
                <div class="sidebar-content">
                <div class="order-summary">
                  <div class="summary-item summary-item-total">
                    <span>{{ 'CART.ITEMS_TOTAL' | translate }}:</span>
                    <span>{{ formatCurrency(cart.subtotal) }}</span>
                  </div>
                  <div class="summary-item">
                    <span>{{ 'CART.SHIPPING' | translate }}:</span>
                    <span>{{ formatCurrency(0) }}</span>
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
<span style="display: flex;align-items: center;justify-content: center;"> 
                  <!-- Complete Order Button -->
                  <button 
                    class="complete-order-btn" 
                    mat-raised-button  
                    (click)="checkout()"
                    [disabled]="cart.items.length === 0">
                    {{ 'CART.COMPLETE_ORDER' | translate }}
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12.0001 18C9.31606 18 6.86606 18.378 5.00006 19M18.0001 13C18.6247 12.9998 19.2406 12.8533 19.7984 12.5722C20.3562 12.2912 20.8404 11.8834 21.2123 11.3816C21.5842 10.8798 21.8335 10.2978 21.94 9.68237C22.0466 9.06691 22.0075 8.43506 21.826 7.83741C21.6444 7.23976 21.3255 6.69292 20.8946 6.24071C20.4637 5.7885 19.9329 5.44348 19.3448 5.23328C18.7566 5.02308 18.1274 4.95354 17.5075 5.03025C16.8876 5.10695 16.2943 5.32775 15.7751 5.67497C15.5 4.89341 14.9891 4.2165 14.3129 3.73766C13.6367 3.25882 12.8286 3.00165 12.0001 3.00165C11.1715 3.00165 10.3634 3.25882 9.6872 3.73766C9.01102 4.2165 8.50014 4.89341 8.22506 5.67497C7.70585 5.32775 7.11254 5.10695 6.49265 5.03025C5.87277 4.95354 5.24353 5.02308 4.65535 5.23328C4.06717 5.44348 3.53639 5.7885 3.10552 6.24071C2.67465 6.69292 2.35568 7.23976 2.17414 7.83741C1.9926 8.43506 1.95354 9.06691 2.0601 9.68237C2.16666 10.2978 2.41587 10.8798 2.78777 11.3816C3.15967 11.8834 3.64393 12.2912 4.20175 12.5722C4.75956 12.8533 5.37545 12.9998 6.00006 13V18.5M21.0001 18.5H15.0001M21.0001 18.5C21.0001 19.2 19.0061 20.509 18.5001 21M21.0001 18.5C21.0001 17.8 19.0061 16.491 18.5001 16" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
</span>
 
                </div>
                                 <!-- Terms and Delivery Container -->
                  <div class="terms-delivery-container">
                    <!-- Terms and Conditions -->
                    <div class="terms-section">
                      <div class="terms-unchecked" >
                        <!-- <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="terms-checkmark">
                          <path d="M20 12V18C20 18.5304 19.7893 19.0391 19.4142 19.4142C19.0391 19.7893 18.5304 20 18 20H6C5.46957 20 4.96086 19.7893 4.58579 19.4142C4.21071 19.0391 4 18.5304 4 18V6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4H15" stroke="#808080" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg> -->
                        <span class="terms-label">{{ 'CART.TERMS_AGREEMENT' | translate }}</span>
                      </div>
                      <!-- <div *ngIf="termsAccepted" class="terms-checked" (click)="termsAccepted = false">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="terms-checkmark">
                          <path d="M9 11L12 14L20 6" stroke="#0AAD0A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M20 12V18C20 18.5304 19.7893 19.0391 19.4142 19.4142C19.0391 19.7893 18.5304 20 18 20H6C5.46957 20 4.96086 19.7893 4.58579 19.4142C4.21071 19.0391 4 18.5304 4 18V6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4H15" stroke="#0AAD0A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span class="terms-label">{{ 'CART.TERMS_AGREEMENT' | translate }}</span>
                      </div> -->
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
              
              <!-- Cart Items Section -->
              <div class="cart-items-wrapper">
                <div class="cart-content">
                  <!-- Page Title -->
                  <div class="cart-title-section">
                    <h2 class="cart-title">{{ 'CART.TITLE' | translate }}</h2>
<svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M13.2915 22C13.2915 21.6353 13.4364 21.2856 13.6942 21.0277C13.9521 20.7699 14.3018 20.625 14.6665 20.625H29.3332C29.6978 20.625 30.0476 20.7699 30.3054 21.0277C30.5633 21.2856 30.7082 21.6353 30.7082 22C30.7082 22.3647 30.5633 22.7144 30.3054 22.9723C30.0476 23.2301 29.6978 23.375 29.3332 23.375H14.6665C14.3018 23.375 13.9521 23.2301 13.6942 22.9723C13.4364 22.7144 13.2915 22.3647 13.2915 22ZM18.3332 26.125C17.9685 26.125 17.6188 26.2699 17.3609 26.5277C17.103 26.7856 16.9582 27.1353 16.9582 27.5C16.9582 27.8647 17.103 28.2144 17.3609 28.4723C17.6188 28.7301 17.9685 28.875 18.3332 28.875H25.6665C26.0312 28.875 26.3809 28.7301 26.6388 28.4723C26.8966 28.2144 27.0415 27.8647 27.0415 27.5C27.0415 27.1353 26.8966 26.7856 26.6388 26.5277C26.3809 26.2699 26.0312 26.125 25.6665 26.125H18.3332Z" fill="black"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M26.8886 4.27195C27.2147 4.10894 27.5921 4.08207 27.9379 4.19723C28.2838 4.3124 28.5697 4.56018 28.733 4.88611L32.0568 11.5338C32.8402 11.5717 33.5552 11.6364 34.2018 11.7281C36.1378 12.0049 37.7401 12.6026 38.8786 14.0106C40.0171 15.4186 40.2665 17.1108 40.1326 19.0614C40.0043 20.9516 39.491 23.3368 38.853 26.3159L38.0261 30.1788C37.5953 32.1899 37.2451 33.8198 36.8051 35.0921C36.3468 36.4213 35.7418 37.5121 34.7115 38.3463C33.6811 39.1804 32.4858 39.5416 31.0925 39.7121C29.7541 39.8753 28.0858 39.8753 26.0325 39.8753H17.9731C15.9161 39.8753 14.2496 39.8753 12.9113 39.7121C11.518 39.5416 10.3226 39.1804 9.29229 38.3463C8.26196 37.5121 7.65696 36.4213 7.19862 35.0939C6.75862 33.8198 6.41029 32.1899 5.97762 30.1806L5.15079 26.3178C4.51279 23.3368 4.00129 20.9516 3.87112 19.0614C3.73729 17.1108 3.98662 15.4204 5.12512 14.0106C6.26179 12.6026 7.86412 12.0049 9.80012 11.7281C10.4479 11.6377 11.1629 11.5729 11.9451 11.5338L15.2745 4.88611C15.439 4.56277 15.7248 4.31758 16.0693 4.20398C16.4139 4.09038 16.7894 4.11757 17.114 4.27964C17.4386 4.4417 17.6861 4.7255 17.8023 5.06919C17.9186 5.41287 17.8943 5.78858 17.7348 6.11445L15.0581 11.4623C15.7255 11.4586 16.4276 11.4574 17.1646 11.4586H26.841C27.578 11.4586 28.2801 11.4598 28.9475 11.4623L26.2726 6.11445C26.1096 5.78841 26.0827 5.41098 26.1979 5.06514C26.3131 4.7193 26.5609 4.43333 26.8868 4.27011M10.5115 14.4066L9.77262 15.8843C9.69031 16.046 9.64082 16.2224 9.627 16.4034C9.61319 16.5843 9.63533 16.7662 9.69215 16.9385C9.74897 17.1109 9.83934 17.2703 9.95805 17.4075C10.0768 17.5448 10.2215 17.6572 10.3838 17.7382C10.5462 17.8193 10.723 17.8674 10.904 17.8798C11.0851 17.8922 11.2668 17.8686 11.4387 17.8105C11.6106 17.7523 11.7693 17.6607 11.9056 17.5409C12.0419 17.4212 12.1532 17.2756 12.233 17.1126L13.6758 14.2269C14.7208 14.2086 15.9125 14.2068 17.2765 14.2068H26.7291C28.0931 14.2068 29.2848 14.2068 30.3298 14.2251L31.7726 17.1126C31.9372 17.436 32.2229 17.6811 32.5675 17.7947C32.9121 17.9083 33.2876 17.8812 33.6122 17.7191C33.9368 17.557 34.1842 17.2732 34.3005 16.9295C34.4168 16.5859 34.3925 16.2101 34.233 15.8843L33.4941 14.4066L33.8131 14.4488C35.4338 14.6816 36.2276 15.1051 36.741 15.7376C37.2543 16.3719 37.5 17.2391 37.3881 18.8726C37.2745 20.5409 36.8088 22.7336 36.1415 25.8484L35.3531 29.5151C34.9003 31.6326 34.5831 33.0974 34.2055 34.1938C33.8388 35.2571 33.4648 35.8181 32.9826 36.2068C32.5023 36.5954 31.8735 36.8448 30.7606 36.9804C29.6075 37.1216 28.1078 37.1234 25.9426 37.1234H18.0611C15.8978 37.1234 14.3981 37.1216 13.245 36.9804C12.1303 36.8448 11.5033 36.5954 11.023 36.2068C10.5408 35.8181 10.165 35.2553 9.80012 34.1938C9.42062 33.0974 9.10346 31.6326 8.65062 29.5151L7.86412 25.8484C7.19679 22.7318 6.73112 20.5428 6.61746 18.8726C6.50562 17.2391 6.75312 16.3719 7.26462 15.7376C7.77796 15.1051 8.57179 14.6816 10.1925 14.4488L10.5115 14.4066Z" fill="black"/>
</svg>

                  </div>

                  <div class="cart-items-section">
                    <!-- Table Headers -->
                    <div class="cart-table-header" style="display: flex;justify-content: space-between;padding-left: 5rem;">
                      <span style="width: fit-content;">
                      <div class="header-item">{{ 'CART.ITEM' | translate }}</div>
                      </span>
                      <span style="display: flex;width: 60%;justify-content: space-between;" id="G-02">
                      <div class="header-price">{{ 'CART.PRICE' | translate }}</div>
                      <div class="header-quantity">{{ 'CART.QUANTITY' | translate }}</div>
                      <div class="header-total">{{ 'CART.TOTAL' | translate }}</div>
                      </span>
                    </div>

                    <!-- Cart Items -->
                    <div *ngIf="cart.items.length > 0">
                      <div class="cart-item-row" *ngFor="let item of cart.items" style="display: flex;">

                        <div class="col-1 col-md-1 col-sm-1 col-lg-1 col-xl-1 col-xxl-1">
                          <img [src]="getItemImageUrl(item.menuItem)" [alt]="item.menuItem.name" class="item-image" />
                        </div>
                        <div class="col-3 col-md-3 col-sm-3 col-lg-3 col-xl-3 col-xxl-3">
                        <div style="display: flex;flex-direction: column;gap: 0.25rem;">
                          <span class="item-name">
                            {{ item.menuItem.name }}
                            <span *ngIf="item.selectedVariant" style="color: #F00E0C;font-weight: 600;margin-right: 0.5rem;">
                              - {{ getVariantName(item.selectedVariant) }}
                            </span>
                          </span>
                        </div>
                        </div>

                        <div class="col-2 col-md-2 col-sm-2 col-lg-2 col-xl-2 col-xxl-2">


                        <div style="
    display: flex;
    align-items: center;
    justify-content: center;
">{{ formatCurrency(item.selectedVariant ? item.selectedVariant.price : item.menuItem.price) }}</div>
                        </div>

<div class="col-2 col-md-2 col-sm-2 col-lg-2 col-xl-2 col-xxl-2">

                        <div style="
    display: flex;
    align-items: center;
    justify-content: center;
">
                          <!-- <span class="qty-value">{{ item.quantity }}</span> -->
                                           <div class="quantity-control">
                  <button class="qty-btn minus" (click)="decreaseQuantity(item.menuItem.id, item.quantity, item.selectedVariant?.id)" [disabled]="item.quantity <= 1">-</button>
                  <span class="qty-value">{{ item.quantity }}</span>
                  <button class="qty-btn plus" (click)="increaseQuantity(item.menuItem.id, item.selectedVariant?.id)">+</button>
                </div>
                        </div>
                        </div>

                        <div class="col-2 col-md-2 col-sm-2 col-lg-2 col-xl-2 col-xxl-2">

                        <div >{{ formatCurrency(item.subtotal) }}</div>
                      </div>

                        <div class="col-2 col-md-2 col-sm-2 col-lg-2 col-xl-2 col-xxl-2">

                        <button class="delete-btn" (click)="removeItem(item.menuItem.id, item.selectedVariant?.id)" mat-icon-button>
                          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.16651 24.5C7.52484 24.5 6.97573 24.2717 6.51917 23.8152C6.06262 23.3586 5.83395 22.8091 5.83317 22.1667V7C5.50262 7 5.22573 6.888 5.00251 6.664C4.77929 6.44 4.66729 6.16311 4.66651 5.83333C4.66573 5.50356 4.77773 5.22667 5.00251 5.00267C5.22729 4.77867 5.50417 4.66667 5.83317 4.66667H10.4998C10.4998 4.33611 10.6118 4.05922 10.8358 3.836C11.0598 3.61278 11.3367 3.50078 11.6665 3.5H16.3332C16.6637 3.5 16.941 3.612 17.165 3.836C17.389 4.06 17.5006 4.33689 17.4998 4.66667H22.1665C22.4971 4.66667 22.7743 4.77867 22.9983 5.00267C23.2223 5.22667 23.334 5.50356 23.3332 5.83333C23.3324 6.16311 23.2204 6.44039 22.9972 6.66517C22.774 6.88994 22.4971 7.00156 22.1665 7V22.1667C22.1665 22.8083 21.9382 23.3578 21.4817 23.8152C21.0251 24.2725 20.4756 24.5008 19.8332 24.5H8.16651ZM11.6665 19.8333C11.9971 19.8333 12.2743 19.7213 12.4983 19.4973C12.7223 19.2733 12.834 18.9964 12.8332 18.6667V10.5C12.8332 10.1694 12.7212 9.89256 12.4972 9.66933C12.2732 9.44611 11.9963 9.33411 11.6665 9.33333C11.3367 9.33256 11.0598 9.44456 10.8358 9.66933C10.6118 9.89411 10.4998 10.171 10.4998 10.5V18.6667C10.4998 18.9972 10.6118 19.2745 10.8358 19.4985C11.0598 19.7225 11.3367 19.8341 11.6665 19.8333ZM16.3332 19.8333C16.6637 19.8333 16.941 19.7213 17.165 19.4973C17.389 19.2733 17.5006 18.9964 17.4998 18.6667V10.5C17.4998 10.1694 17.3878 9.89256 17.1638 9.66933C16.9398 9.44611 16.663 9.33411 16.3332 9.33333C16.0034 9.33256 15.7265 9.44456 15.5025 9.66933C15.2785 9.89411 15.1665 10.171 15.1665 10.5V18.6667C15.1665 18.9972 15.2785 19.2745 15.5025 19.4985C15.7265 19.7225 16.0034 19.8341 16.3332 19.8333Z" fill="#F00E0C"/>
</svg>
                        </button>
                      </div>


                      </div>

                      <!-- Add More Button -->
                      <button class="add-more-btn" (click)="goToMenu()" mat-stroked-button>
                        {{ 'CART.ADD_MORE' | translate }}
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8 3.33333V12.6667M3.33333 8H12.6667" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </button>


                    </div>



                    <!-- Empty Cart Message -->
                    <div *ngIf="cart.items.length === 0" class="empty-cart-message">
                      <mat-icon class="empty-cart-icon">shopping_cart</mat-icon>
                      <p>{{ 'CART.EMPTY_CART' | translate }}</p>
                      <button class="add-more-btn" (click)="goToMenu()" mat-stroked-button>
                        {{ 'CART.BROWSE_MENU' | translate }}
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8 3.33333V12.6667M3.33333 8H12.6667" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>
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

    @media (max-width: 576px) {
      .breadcrumb-nav {
        font-size: 0.75rem;
      }

      .breadcrumb-nav span {
        margin: 0 0.25rem;
      }
    }

    .breadcrumb-nav a {
      color: #d32f2f;
      text-decoration: none;
    }

    .breadcrumb-nav span {
      margin: 0 0.5rem;
    }

    .cart-content-wrapper {
      background-color: #ffffff;
      padding: 2rem 0;
      width: 100%;
    }

    .cart-grid-container {
      display: grid;
      grid-template-columns: 1fr 3fr;
      gap: 2rem;
      width: 100%;
      align-items: start;
      padding: 0 2rem;
    }

    @media (max-width: 1200px) {
      .cart-grid-container {
        gap: 1.5rem;
        padding: 0 1.5rem;
      }
    }

    @media (max-width: 992px) {
      .cart-grid-container {
        grid-template-columns: 1fr;
        gap: 1.5rem;
        padding: 0 1rem;
      }

      .cart-items-wrapper {
        order: 1;
      }

      .sidebar-wrapper {
        order: 2;
      }
    }

    @media (max-width: 768px) {
      .cart-grid-container {
        gap: 1rem;
        padding: 0 0.5rem;
      }
    }

    .cart-items-wrapper {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }

    .cart-content {
      direction: rtl;
      width: 100%;
    }

    .cart-title-section {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2rem;
      padding-bottom: 0.5rem;
      width: 100%;
    }

    .cart-icon {
      font-size: 2.5rem;
      width: 2.5rem;
      height: 2.5rem;
      color: #d32f2f;
    }

    .cart-title {
      font-family: 'Almarai', sans-serif;
      font-weight: 700;
      font-size: 2rem;
      color: #d32f2f;
      margin: 0;
    }

    @media (max-width: 768px) {
      .cart-title {
        font-size: 1.5rem;
      }

      .cart-icon {
        font-size: 2rem;
        width: 2rem;
        height: 2rem;
      }
    }

    @media (max-width: 576px) {
      .cart-title {
        font-size: 1.25rem;
      }

      .cart-icon {
        font-size: 1.75rem;
        width: 1.75rem;
        height: 1.75rem;
      }
    }

    .cart-items-section {
      width: 100%;
      height: 303px;
      background: white;
      border-radius: 15px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      display: flex;
      flex-direction: column;
      gap: 24px;
      overflow-y: auto;
      flex-shrink: 0;
    }

    @media (max-width: 992px) {
      .cart-items-section {
        height: auto;
        min-height: 303px;
        max-height: 500px;
      }
    }

    .cart-table-header {
      display: grid;
      grid-template-columns: 1fr 120px 120px 120px 50px;
      gap: 1rem;
      padding: 1rem;
      border-bottom: 1px solid #FF8B8B;
      background: white;
      font-family: 'Alexandria', sans-serif;
      font-weight: 600;
      font-style: normal;
      font-size: 16px;
      line-height: 100%;
      letter-spacing: 0%;
      text-align: right;
      color: #F00E0C;
    }

    @media (max-width: 992px) {
      .cart-table-header {
        grid-template-columns: 1fr 100px 100px 100px 50px;
        gap: 0.75rem;
      }
    }

    .header-item {
      grid-column: 1;
      display:flex;
    }

    .header-price {
      grid-column: 2;
      text-align: right;
    }

    .header-quantity {
      grid-column: 3;
      text-align: right;
    }

    .header-total {
      grid-column: 4;
      text-align: right;
    }

    .cart-item-row {
      display: grid;
      grid-template-columns: 1fr 120px 120px 120px 50px;
      gap: 1rem;
      padding: 1.5rem 0;
      border-bottom: 1px solid #e0e0e0;
      align-items: center;
      font-family: 'Alexandria', sans-serif;
      font-weight: 600;
      font-style: normal;
      font-size: 16px;
      line-height: 100%;
      letter-spacing: 0%;
      text-align: right;
      color: #000000;
    }

    @media (max-width: 992px) {
      .cart-item-row {
        grid-template-columns: 1fr 100px 100px 100px 50px;
        gap: 0.75rem;
        padding: 1rem 0;
      }
    }

    .item-info {
      grid-column: 1;
      display: flex;
      align-items: center;
      gap: 1rem;
      min-width: 0;
    }

    @media (max-width: 576px) {
      .item-info {
        gap: 0.75rem;
      }
    }

    .item-image {
      width: 80px;
      height: 80px;
      object-fit: cover;
      border-radius: 8px;
      flex-shrink: 0;
    }

    @media (max-width: 576px) {
      .item-image {
        width: 60px;
        height: 60px;
      }
    }

    .item-name {
      font-family: 'Alexandria', sans-serif;
      font-weight: 600;
      font-style: normal;
      font-size: 16px;
      line-height: 100%;
      letter-spacing: 0%;
      text-align: right;
      color: #000000;
    }

    .item-price {
      grid-column: 2;
      font-family: 'Alexandria', sans-serif;
      font-weight: 600;
      font-style: normal;
      font-size: 16px;
      line-height: 100%;
      letter-spacing: 0%;
      text-align: right;
      color: #000000;
    }

    .item-quantity {
      grid-column: 3;
      text-align: right;
      width: 100%;
      font-family: 'Alexandria', sans-serif;
      font-weight: 600;
      font-style: normal;
      font-size: 16px;
      line-height: 100%;
      letter-spacing: 0%;
      color: #000000;
    }

    .qty-value {
      font-family: 'Alexandria', sans-serif;
      font-weight: 600;
      font-style: normal;
      font-size: 16px;
      line-height: 100%;
      letter-spacing: 0%;
      text-align: right;
      color: #000000;
      display: inline-block;
    }

    .item-total {
      grid-column: 4;
      font-family: 'Alexandria', sans-serif;
      font-weight: 600;
      font-style: normal;
      font-size: 16px;
      line-height: 100%;
      letter-spacing: 0%;
      text-align: right;
      color: #000000;
    }

    .delete-btn {
      color: #d32f2f !important;
      grid-column: 5;
    }

    .add-more-btn {
      margin-top: 1.5rem;
      width: 171px !important;
      height: 40px !important;
      padding: 12px 10px !important;
      border: 1px solid #F00E0C !important;
      border-width: 1px !important;
      border-radius: 100px !important;
      background: white !important;
      color: #000000 !important;
      opacity: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      font-family: 'Almarai', sans-serif;
      font-weight: 400;
      font-style: normal;
      font-size: 16px;
      line-height: 100%;
      letter-spacing: 0px;
      text-transform: capitalize;
    }

    .add-more-btn.mat-stroked-button {
      border: 1px solid #F00E0C !important;
      border-width: 1px !important;
    }

    .add-more-btn:hover {
      background-color: #F00E0C !important;
      color: white !important;
    }

    .add-more-btn svg {
      flex-shrink: 0;
      width: 16px;
      height: 16px;
    }

    @media (max-width: 576px) {
      .add-more-btn {
        margin-top: 1rem;
        width: 171px;
        height: 40px;
        padding: 12px 10px;
        border-radius: 100px;
        gap: 10px;
        font-family: 'Almarai', sans-serif;
        font-weight: 400;
        font-size: 16px;
        line-height: 100%;
        letter-spacing: 0px;
        text-transform: capitalize;
      }
    }

    .empty-cart {
      text-align: center;
      padding: 4rem 2rem;
      background: white;
      border-radius: 15px;
      direction: rtl;
    }

    .empty-cart-message {
      text-align: center;
      padding: 3rem 2rem;
      direction: rtl;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
    }

    .empty-cart-message p {
      color: #666;
      font-size: 1rem;
      margin: 0;
    }

    @media (max-width: 768px) {
      .empty-cart {
        padding: 3rem 1.5rem;
      }
    }

    @media (max-width: 576px) {
      .empty-cart {
        padding: 2rem 1rem;
      }

      .empty-cart-icon {
        font-size: 60px;
        width: 60px;
        height: 60px;
      }
    }

    .empty-cart-icon {
      font-size: 80px;
      width: 80px;
      height: 80px;
      color: #ccc;
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
      height: auto;
      background: white;
      border-radius: 10px;
      border: 1px solid #F1F1F1;
      padding: 20px 18px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      display: flex;
      flex-direction: column;
      gap: 10px;
      overflow-y: auto;
      flex-shrink: 0;
      font-family: 'Alexandria', sans-serif;
      font-weight: 700;
      font-style: normal;
      font-size: 16px;
      line-height: 100%;
      letter-spacing: 0%;
      text-align: right;
    }

    @media (max-width: 992px) {
      .order-summary {
        height: auto;
        min-height: 350px;
      }
    }

    .summary-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0;
      color: #333;
      flex-shrink: 0;
    }

    .summary-item-total {
      border-bottom: 1px solid #EBE9E9;
      padding-bottom: .5rem;
    }

    .discount-section {
      padding-top: .5rem;
      border-top: 1px solid #e0e0e0;
      flex-shrink: 0;
    }

    .discount-input-group {
      position: relative;
      width: 100%;
    }


        .quantity-control {
      display: flex;
      align-items: center;
      border: 1px solid #E0E0E0;
      border-radius: 8px;
      padding: 0.25rem;
    }

    .qty-btn {
      background: transparent;
      border: none;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 1.25rem;
      font-weight: 600;
      color: #000;
      padding: 0;
    }

    .qty-btn:hover:not(:disabled) {
      background: #F5F5F5;
      border-radius: 4px;
    }

    .qty-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .qty-value {
      font-family: 'Almarai', sans-serif;
      font-weight: 600;
      font-size: 1rem;
      color: #000;
      min-width: 30px;
      text-align: center;
    }
        .item-controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    

    @media (max-width: 576px) {
      .discount-input {
        padding: 1rem;
        padding-right: 15px;
        font-size: 1rem;
      }

      .discount-btn {
        width: 118px;
        height: 47px;
        padding: 9px 14px;
        font-family: 'Alexandria', sans-serif;
        font-weight: 600;
        font-style: normal;
        font-size: 16px;
        line-height: 100%;
        letter-spacing: 0%;
        text-align: right;
        background: #FDC55E;
        border-radius: 10px;

      }
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
      opacity: 1;
    }

    .discount-input::placeholder {
      font-family: 'Alexandria', sans-serif;
      font-weight: 600;
      font-style: normal;
      font-size: 14px;
      line-height: 100%;
      letter-spacing: 0%;
      text-align: right;
    }

    .discount-input::-webkit-input-placeholder {
      font-family: 'Alexandria', sans-serif;
      font-weight: 600;
      font-style: normal;
      font-size: 14px;
      line-height: 100%;
      letter-spacing: 0%;
      text-align: right;
    }

    .discount-input::-moz-placeholder {
      font-family: 'Alexandria', sans-serif;
      font-weight: 600;
      font-style: normal;
      font-size: 14px;
      line-height: 100%;
      letter-spacing: 0%;
      text-align: right;
    }

    .discount-input:-ms-input-placeholder {
      font-family: 'Alexandria', sans-serif;
      font-weight: 600;
      font-style: normal;
      font-size: 14px;
      line-height: 100%;
      letter-spacing: 0%;
      text-align: right;
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
      font-style: normal;
      font-size: 16px;
      line-height: 100%;
      letter-spacing: 0%;
      text-align: right;
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

    .discount-btn:hover {
      background: #E8B84D;
    }

    .discount-btn:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }

    .summary-total {
      display: flex;
      justify-content: space-between;
      margin-bottom: .5rem;
      padding-top: 1rem;
      border-top: 1px solid #B3B3B3;
      font-size: 1.25rem;
      font-weight: bold;
      flex-shrink: 0;
      color: #d32f2f;
    }

    .total-amount {
      color: #d32f2f;
    }

    .complete-order-btn {
      width: 100%;
      max-width: 433px;
      height: 40px;
      padding: 12px 10px;
      border-radius: 100px;
      border-width: 1px;
      border: 1px solid transparent;
      background: #F00E0C !important;
      background-color: #F00E0C !important;
      color: white !important;
      margin: 0;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      opacity: 1;
      font-family: 'Almarai', sans-serif;
      font-weight: 700;
      font-size: 1rem;
      cursor: pointer;
    }

    .complete-order-btn.mat-raised-button {
      background: #F00E0C !important;
      background-color: #F00E0C !important;
    }

    .complete-order-btn.mat-raised-button:hover:not(:disabled) {
      background: #F00E0C !important;
      background-color: #F00E0C !important;
    }

    .complete-order-btn.mat-raised-button:focus:not(:disabled) {
      background: #F00E0C !important;
      background-color: #F00E0C !important;
    }

    .complete-order-btn:disabled {
      background-color: #ccc !important;
      color: #666 !important;
    }

    .complete-order-btn svg {
      flex-shrink: 0;
    }

    .terms-delivery-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      gap: .5rem;
      margin-top: 1rem;
    }

    .terms-section {
      margin: 0;
      flex-shrink: 0;
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

    .terms-unchecked {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
    }

    .terms-checkmark {
      flex-shrink: 0;
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

    .terms-checkbox ::ng-deep .mat-checkbox-frame {
      border-color: #666;
      background-color: #E8F5E9;
      border-radius: 4px;
    }

    .terms-checkbox ::ng-deep .mat-checkbox-background {
      background-color: #E8F5E9;
      border-radius: 4px;
    }

    .terms-checkbox ::ng-deep .mat-checkbox-checked .mat-checkbox-background {
      background-color: #E8F5E9 !important;
    }

    .terms-checkbox ::ng-deep .mat-checkbox-checkmark-path {
      stroke: #4CAF50 !important;
      stroke-width: 2px;
    }

    .terms-checkbox ::ng-deep .mat-checkbox-label {
      color: #666;
    }

    .delivery-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #666;
      font-size: 0.9rem;
      margin: 0;
      flex-shrink: 0;
    }

    .delivery-info mat-icon {
      color: #666;
    }

    @media (max-width: 768px) {
      .breadcrumb-container {
        padding: 1rem 1.5rem;
      }

      .cart-content-wrapper {
        padding: 1rem 0;
      }

      .cart-items-section {
        width: 100%;
        height: auto;
        min-height: 303px;
        padding: 1rem;
        overflow-x: auto;
      }

      .order-summary {
        width: 100%;
        height: auto;
        min-height: 350px;
        position: relative;
        top: 0;
      }

      .terms-delivery-container {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }

      .cart-table-header,
      .cart-item-row {
        min-width: 580px;
      }

      .cart-title-section {
        margin-bottom: 1rem;
        padding-inline: .5rem;
      }

      .cart-items-wrapper {
        min-width: 0;
        width: 100%;
      }
    }

    @media (max-width: 576px) {
      .breadcrumb-container {
        padding: 0.75rem 1rem;
        font-size: 0.8rem;
      }

      .cart-content-wrapper {
        padding: 0.5rem 0;
      }

      .cart-items-section {
        padding: 0.75rem;
        gap: 16px;
      }

      .order-summary {
        padding: 15px 12px;
      }

      .summary-item,
      .summary-total {
        font-size: 0.9rem;
      }

      .summary-total {
        font-size: 1.1rem;
      }

      .complete-order-btn {
        width: 100%;
        max-width: 100%;
        height: 40px;
        padding: 12px 10px;
        border-radius: 100px;
        border-width: 1px;
        border: 1px solid transparent;
        gap: 10px;
      }

      .item-name {
        font-size: 0.9rem;
      }
    }
  `]
})
export class CartComponent implements OnInit {
  cart$!: Observable<Cart>;
  discountCode: string = '';
  appliedDiscount: number = 0;
  termsAccepted: boolean = false;

  constructor(
    private cartService: CartService,
    private router: Router,
    private categoryService: CategoryService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.cart$ = this.cartService.cart$;
  }

  updateQuantity(itemId: string, quantity: number): void {
    this.cartService.updateQuantity(itemId, quantity);
  }

  removeItem(itemId: string, variantId?: number): void {
    this.cartService.removeItem(itemId, variantId);
  }

  getVariantName(variant: ProductVariant): string {
    const currentLang = this.translate.currentLang || 'ar';
    return currentLang === 'ar' ? variant.nameAr : (variant.nameEn || variant.nameAr);
  }

  applyDiscount(): void {
    // TODO: Implement discount code validation with backend
    if (this.discountCode.trim()) {
      // Mock discount application - replace with actual API call
      this.appliedDiscount = 50; // Example: 50 QAR discount
    }
  }

  formatCurrency(amount: number): string {
    if (amount == null || isNaN(amount)) {
      return '0.00';
    }
    const currentLang = this.translate.currentLang || 'ar';
    const formattedNumber = amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const currencySymbol = currentLang === 'ar' ? 'ر.ق' : 'QAR';
    return `${formattedNumber} ${currencySymbol}`;
  }

  getFinalTotal(cart: Cart): number {
    return cart.subtotal - this.appliedDiscount;
  }

  checkout(): void {
    this.router.navigate(['/checkout']);

  }

  goToMenu(): void {
    // Get the first active category and navigate to menu with it selected
    this.categoryService.getCategoriesWithProducts().pipe(
      take(1)
    ).subscribe({
      next: (categories) => {
        // Filter active categories and get the first one
        const activeCategories = categories.filter(cat => cat.isActive);
        if (activeCategories.length > 0) {
          const firstCategory = activeCategories[0];
          // Navigate to menu with first category selected
          this.router.navigate(['/menu'], { queryParams: { category: firstCategory.id } });
        } else {
          // If no categories, just navigate to menu
          this.router.navigate(['/menu']);
        }
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        // On error, just navigate to menu without category selection
        this.router.navigate(['/menu']);
      }
    });
  }

  getItemImageUrl(item: MenuItem & { images?: any[] }): string {
    let imageUrl: string | null = null;

    // If imageUrl is empty/null and images.length >= 1, use first image from images array
    if ((!item.imageUrl || item.imageUrl.trim() === '') && item.images && item.images.length >= 1) {
      // Sort images by sortOrder and get the first one
      const sortedImages = [...item.images].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
      const firstImage = sortedImages[0];
      if (firstImage && firstImage.imageUrl) {
        imageUrl = firstImage.imageUrl;
      }
    } else if (item.imageUrl && item.imageUrl.trim() !== '') {
      // Otherwise, use imageUrl if available
      imageUrl = item.imageUrl;
    }

    // Clean the image URL to handle malformed URLs from backend (e.g., "https://localhost:44359/data:image/jpeg;base64,...")
    const cleanedUrl = this.cleanImageUrl(imageUrl);
    return cleanedUrl || 'https://via.placeholder.com/300';
  }

  private cleanImageUrl(url: string | null | undefined): string | null {
    if (!url || url.trim() === '') return null;

    // Check if URL contains base64 data URL pattern
    const dataUrlMatch = url.match(/data:image\/[^;]+;base64,[^"]+/);
    if (dataUrlMatch) {
      // Extract just the base64 data URL part
      return dataUrlMatch[0];
    }

    // If it's a proper HTTP URL, return as is
    return url;
  }


  increaseQuantity(itemId: string, variantId?: number): void {
    const cart = this.cartService.getCart();
    const item = cart.items.find(i => {
      const sameMenuItem = i.menuItem.id === itemId;
      const sameVariant = variantId !== undefined
        ? (i.selectedVariant?.id === variantId)
        : (!i.selectedVariant);
      return sameMenuItem && sameVariant;
    });
    if (item) {
      this.cartService.updateQuantity(itemId, item.quantity + 1, variantId);
    }
  }

  decreaseQuantity(itemId: string, currentQuantity: number, variantId?: number): void {
    if (currentQuantity > 1) {
      const cart = this.cartService.getCart();
      const item = cart.items.find(i => {
        const sameMenuItem = i.menuItem.id === itemId;
        const sameVariant = variantId !== undefined
          ? (i.selectedVariant?.id === variantId)
          : (!i.selectedVariant);
        return sameMenuItem && sameVariant;
      });
      if (item) {
        this.cartService.updateQuantity(itemId, currentQuantity - 1, variantId);
      }
    }
    // Don't remove item if quantity is 1, just keep it at 1
  }

}

