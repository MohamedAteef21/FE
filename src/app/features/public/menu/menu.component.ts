import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule, ViewportScroller } from '@angular/common';
import { Observable, of, Subscription } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SharedModule } from '../../../shared/shared.module';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { Category, MenuItem, Cart } from '../../../models/menu-item.model';
import { Router, ActivatedRoute } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { TranslationService } from '../../../core/services/translation.service';
import { CategoryService } from '../../../core/services/category.service';
import { CategoryWithProducts } from '../../../models/category.model';
import { addLanguageProperty, getDisplayName, getDisplayDescription } from '../../../core/utils/item-translation.util';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, SharedModule, TranslateModule, LoadingSpinnerComponent],
  template: `
    <div class="container-fluid px-0" [class.panel-open]="isShow">
      <!-- Breadcrumb Navigation -->
      <div class="breadcrumb-container">
        <nav class="breadcrumb-nav">
          <a routerLink="/">{{ 'NAV.HOME' | translate }}</a>
          <span> > </span>
          <span>{{ 'NAV.MENU' | translate }}</span>
        </nav>
      </div>


      <div *ngIf="isShow" [class.panel-open]="isShow">
        <!-- Dark Layer -->
        <div
          id="darkLayer"
          (click)="isShow = false"
          style="position: fixed;width: 100%;height: 100%;background: rgba(0, 0, 0, 0.4);top: 0;left: 0;z-index: 0;"
        ></div>

        <!-- Side Panel -->
        <div id="mainPanel" style="height: 100%;width: 385px;position: fixed;top: 0;left: 0;background-color: #ffffff;overflow-x: hidden;padding-top: 30px;z-index: 1;">
          <div class="row" style="display: flex;flex-direction: row-reverse;width: 100%;border-bottom: 2px solid #E5E5E5;padding-bottom: .5rem;align-items: center;">
            <div class="col-auto col-md-auto col-sm-auto col-lg-auto col-xl-auto col-xxl-auto" style="padding-left: 0 !important;padding-right: 0 !important;">
              <div style="color: #F00E0C;font-size: 24px;font-weight: 600;">{{ 'CART_DIALOG.SHOPPING_CART' | translate }}</div>
            </div>
            <div
              class="col-auto col-md-auto col-sm-auto col-lg-auto col-xl-auto col-xxl-auto"
            >
              <div style="color:#303030 ;font-size: 20px;font-weight: 600;" *ngIf="cart$ | async as cart">{{ cart.items.length }} {{ (cart.items.length === 1 ? 'CART_DIALOG.ITEM_COUNT' : 'CART_DIALOG.ITEMS_COUNT') | translate }}</div>
            </div>
          </div>

 
 
          <div class="row" style="display: flex;flex-direction: row-reverse;width: 100%;padding-bottom: .5rem;align-items: center;height: 90%;align-content: space-between;">
          <div class="col-12 col-md-12 col-sm-12 col-lg-12 col-xl-12 col-xxl-12">
          <span *ngIf="cart$ | async as cart">
          <!-- <div style="display: flex;justify-content: flex-end;color: #F00E0C;font-weight: 500;padding-top: 10px;padding-bottom: 10px;" *ngIf="cart.items.length > 0">{{ 'CART_DIALOG.EXISTING_ITEMS' | translate }}</div> -->
          <div class="col-12 col-md-12 col-sm-12 col-lg-12 col-xl-12 col-xxl-12" style="overflow: scroll;">
          <div class="col-12 col-md-12 col-sm-12 col-lg-12 col-xl-12 col-xxl-12" style="display: flex;flex-direction: row-reverse;width: 100%;align-items: center;padding: 1rem;" *ngFor="let cartItem of cart.items">
          <div class="col-4 col-md-4 col-sm-4 col-lg-4 col-xl-4 col-xxl-4" style="min-height: 80px;">
            <img [src]="getItemImageUrl(cartItem.menuItem)" [alt]="cartItem.menuItem.name" style="width: 100%;height: 100%;min-height: 80px;object-fit: cover;border-radius: 8px;" />
          </div>

                <div class="col-8 col-md-8 col-sm-8 col-lg-8 col-xl-8 col-xxl-8 row" style="gap: 7px;">
                <div class="col-12 col-md-12 col-sm-12 col-lg-12 col-xl-12 col-xxl-12" style="display: flex;flex-direction: row-reverse;align-items: flex-start;justify-content: space-between;">
                <span>{{ currentLang === 'ar' ? cartItem.menuItem.name : (cartItem.menuItem.nameEn || cartItem.menuItem.name) }}</span>
                <button (click)="removeCartItem(cartItem.menuItem.id)" style="background: transparent;border: 0px solid;cursor: pointer;"> <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.29175 21.875C6.71884 21.875 6.22856 21.6712 5.82092 21.2635C5.41328 20.8559 5.20911 20.3653 5.20842 19.7917V6.25C4.91328 6.25 4.66606 6.15 4.46675 5.95C4.26745 5.75 4.16745 5.50278 4.16675 5.20833C4.16606 4.91389 4.26606 4.66667 4.46675 4.46667C4.66745 4.26667 4.91467 4.16667 5.20842 4.16667H9.37509C9.37509 3.87153 9.47509 3.62431 9.67509 3.425C9.87509 3.22569 10.1223 3.12569 10.4168 3.125H14.5834C14.8786 3.125 15.1261 3.225 15.3261 3.425C15.5261 3.625 15.6258 3.87222 15.6251 4.16667H19.7918C20.0869 4.16667 20.3345 4.26667 20.5345 4.46667C20.7345 4.66667 20.8341 4.91389 20.8334 5.20833C20.8327 5.50278 20.7327 5.75035 20.5334 5.95104C20.3341 6.15174 20.0869 6.25139 19.7918 6.25V19.7917C19.7918 20.3646 19.5879 20.8552 19.1803 21.2635C18.7727 21.6719 18.282 21.8757 17.7084 21.875H7.29175ZM10.4168 17.7083C10.7119 17.7083 10.9595 17.6083 11.1595 17.4083C11.3595 17.2083 11.4591 16.9611 11.4584 16.6667V9.375C11.4584 9.07986 11.3584 8.83264 11.1584 8.63333C10.9584 8.43403 10.7112 8.33403 10.4168 8.33333C10.1223 8.33264 9.87509 8.43264 9.67509 8.63333C9.47509 8.83403 9.37509 9.08125 9.37509 9.375V16.6667C9.37509 16.9618 9.47509 17.2094 9.67509 17.4094C9.87509 17.6094 10.1223 17.709 10.4168 17.7083ZM14.5834 17.7083C14.8786 17.7083 15.1261 17.6083 15.3261 17.4083C15.5261 17.2083 15.6258 16.9611 15.6251 16.6667V9.375C15.6251 9.07986 15.5251 8.83264 15.3251 8.63333C15.1251 8.43403 14.8779 8.33403 14.5834 8.33333C14.289 8.33264 14.0418 8.43264 13.8418 8.63333C13.6418 8.83403 13.5418 9.08125 13.5418 9.375V16.6667C13.5418 16.9618 13.6418 17.2094 13.8418 17.4094C14.0418 17.6094 14.289 17.709 14.5834 17.7083Z" fill="#F00E0C"/>
                </svg>
                </button>
                </div>

                <div class="col-12 col-md-12 col-sm-12 col-lg-12 col-xl-12 col-xxl-12" style="display: flex;flex-direction: row-reverse;align-items: flex-start;justify-content: space-between;">
                <span style="color:#971008;font-weight: 700;font-size: 16px;">{{ formatCurrency(cartItem.subtotal) }}</span>
                <div style="position: relative;display: inline-block;">
                <svg width="94" height="37" viewBox="0 0 94 37" fill="none" xmlns="http://www.w3.org/2000/svg" style="pointer-events: none;">
                <rect x="0.19" y="0.19" width="93.62" height="36.62" rx="18.31" stroke="#BEBEBE" stroke-width="0.38"/>
                </svg>
                <button (click)="decreaseQuantity(cartItem.menuItem.id)" [disabled]="cartItem.quantity <= 1" style="background: transparent;border: 0px solid;cursor: pointer;padding: 0;position: absolute;left: 12px;top: 50%;transform: translateY(-50%);width: 20px;height: 20px;display: flex;align-items: center;justify-content: center;" [style.opacity]="cartItem.quantity <= 1 ? '0.5' : '1'">
                <svg width="8" height="2" viewBox="0 0 8 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 1H8" stroke="#909090" stroke-width="1.52" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                </button>
                <span style="color: #343538;font-weight: 600;font-size: 14px;position: absolute;left: 50%;top: 50%;transform: translate(-50%, -50%);pointer-events: none;">{{ cartItem.quantity }}</span>
                <button (click)="increaseQuantity(cartItem.menuItem.id)" style="background: transparent;border: 0px solid;cursor: pointer;padding: 0;position: absolute;right: 12px;top: 50%;transform: translateY(-50%);width: 20px;height: 20px;display: flex;align-items: center;justify-content: center;">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 2V8M2 5H8" stroke="#343538" stroke-width="1.52" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                </button>
                </div>
                </div>
                </div>
                </div>
</div>

</span>

<span *ngIf="pendingItem">
<div style="
    display: flex;
    justify-content: flex-end;
    color: #F00E0C;
    font-weight: 500;
    padding-top: 10px;
    padding-bottom: 10px;
">{{ 'CART_DIALOG.ADD_NEW_ITEM' | translate }}
</div>
<div class="col-12 col-md-12 col-sm-12 col-lg-12 col-xl-12 col-xxl-12" style="height: 26rem;overflow: scroll;">
      <div class="col-12 col-md-12 col-sm-12 col-lg-12 col-xl-12 col-xxl-12" style="display: flex;flex-direction: row-reverse;width: 100%;align-items: center;padding: 1rem;">
          <div class="col-4 col-md-4 col-sm-4 col-lg-4 col-xl-4 col-xxl-4" style="min-height: 80px;">
            <img [src]="getItemImageUrl(pendingItem)" [alt]="pendingItem.name" style="width: 100%;height: 100%;min-height: 80px;object-fit: cover;border-radius: 8px;" />
          </div>

                <div class="col-8 col-md-8 col-sm-8 col-lg-8 col-xl-8 col-xxl-8 row" style="gap: 7px;">
                <div class="col-12 col-md-12 col-sm-12 col-lg-12 col-xl-12 col-xxl-12" style="display: flex;flex-direction: row-reverse;align-items: flex-start;justify-content: space-between;">
                <span>{{ currentLang === 'ar' ? pendingItem.name : (pendingItem.nameEn || pendingItem.name) }}</span>
                <button (click)="removePendingItem()" style="background: transparent;border: 0px solid;cursor: pointer;"> <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.29175 21.875C6.71884 21.875 6.22856 21.6712 5.82092 21.2635C5.41328 20.8559 5.20911 20.3653 5.20842 19.7917V6.25C4.91328 6.25 4.66606 6.15 4.46675 5.95C4.26745 5.75 4.16745 5.50278 4.16675 5.20833C4.16606 4.91389 4.26606 4.66667 4.46675 4.46667C4.66745 4.26667 4.91467 4.16667 5.20842 4.16667H9.37509C9.37509 3.87153 9.47509 3.62431 9.67509 3.425C9.87509 3.22569 10.1223 3.12569 10.4168 3.125H14.5834C14.8786 3.125 15.1261 3.225 15.3261 3.425C15.5261 3.625 15.6258 3.87222 15.6251 4.16667H19.7918C20.0869 4.16667 20.3345 4.26667 20.5345 4.46667C20.7345 4.66667 20.8341 4.91389 20.8334 5.20833C20.8327 5.50278 20.7327 5.75035 20.5334 5.95104C20.3341 6.15174 20.0869 6.25139 19.7918 6.25V19.7917C19.7918 20.3646 19.5879 20.8552 19.1803 21.2635C18.7727 21.6719 18.282 21.8757 17.7084 21.875H7.29175ZM10.4168 17.7083C10.7119 17.7083 10.9595 17.6083 11.1595 17.4083C11.3595 17.2083 11.4591 16.9611 11.4584 16.6667V9.375C11.4584 9.07986 11.3584 8.83264 11.1584 8.63333C10.9584 8.43403 10.7112 8.33403 10.4168 8.33333C10.1223 8.33264 9.87509 8.43264 9.67509 8.63333C9.47509 8.83403 9.37509 9.08125 9.37509 9.375V16.6667C9.37509 16.9618 9.47509 17.2094 9.67509 17.4094C9.87509 17.6094 10.1223 17.709 10.4168 17.7083ZM14.5834 17.7083C14.8786 17.7083 15.1261 17.6083 15.3261 17.4083C15.5261 17.2083 15.6258 16.9611 15.6251 16.6667V9.375C15.6251 9.07986 15.5251 8.83264 15.3251 8.63333C15.1251 8.43403 14.8779 8.33403 14.5834 8.33333C14.289 8.33264 14.0418 8.43264 13.8418 8.63333C13.6418 8.83403 13.5418 9.08125 13.5418 9.375V16.6667C13.5418 16.9618 13.6418 17.2094 13.8418 17.4094C14.0418 17.6094 14.289 17.709 14.5834 17.7083Z" fill="#F00E0C"/>
                </svg>
                </button>
                </div>

                <div class="col-12 col-md-12 col-sm-12 col-lg-12 col-xl-12 col-xxl-12" style="display: flex;flex-direction: row-reverse;align-items: flex-start;justify-content: space-between;">
                <span style="color:#971008;font-weight: 700;font-size: 16px;">{{ formatCurrency(pendingItem.price * pendingQuantity) }}</span>
                <div style="position: relative;display: inline-block;">
                <svg width="94" height="37" viewBox="0 0 94 37" fill="none" xmlns="http://www.w3.org/2000/svg" style="pointer-events: none;">
                <rect x="0.19" y="0.19" width="93.62" height="36.62" rx="18.31" stroke="#BEBEBE" stroke-width="0.38"/>
                </svg>
                <button (click)="decreasePendingQuantity()" [disabled]="pendingQuantity <= 1" style="background: transparent;border: 0px solid;cursor: pointer;padding: 0;position: absolute;left: 12px;top: 50%;transform: translateY(-50%);width: 20px;height: 20px;display: flex;align-items: center;justify-content: center;" [style.opacity]="pendingQuantity <= 1 ? '0.5' : '1'">
                <svg width="8" height="2" viewBox="0 0 8 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 1H8" stroke="#909090" stroke-width="1.52" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                </button>
                <span style="color: #343538;font-weight: 600;font-size: 14px;position: absolute;left: 50%;top: 50%;transform: translate(-50%, -50%);pointer-events: none;">{{ pendingQuantity }}</span>
                <button (click)="increasePendingQuantity()" style="background: transparent;border: 0px solid;cursor: pointer;padding: 0;position: absolute;right: 12px;top: 50%;transform: translateY(-50%);width: 20px;height: 20px;display: flex;align-items: center;justify-content: center;">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 2V8M2 5H8" stroke="#343538" stroke-width="1.52" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                </button>
                </div>
                </div>

                <div class="col-12 col-md-12 col-sm-12 col-lg-12 col-xl-12 col-xxl-12" style="display: flex;align-items: center;justify-content: center;margin-top: 10px;">
                <button (click)="addPendingItemToCart()" style="color:#F00E0C;background: transparent;border:1px solid #F00E0C;border-radius: 100px;width: 200px;padding: 5px;cursor: pointer;">{{ 'CART_DIALOG.ADD_TO_CART' | translate }}</button>
                </div>
                </div>
                </div>
      </div>
        </span>
        </div>
      </div>



<div class="col-12 col-md-12 col-sm-12 col-lg-12 col-xl-12 col-xxl-12" style="display: flex;flex-direction: column;width: 100%;align-items: center;padding: 1rem;border-top: 1.5px solid #E5E5E5;" *ngIf="cart$ | async as cart">
  <div style="width: 100%;display: flex;align-items: center;flex-direction: row-reverse;justify-content: space-between;background: #F3F2F2;padding: .5rem;border-radius: 9px;padding: 0;">
  <span style="
    padding: .5rem;
">
  {{ 'CART.DISCOUNT_PLACEHOLDER' | translate }}
</span>
<span style="
    background: #F5EAD4;
    padding: .5rem;
">
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_90_1443)">
<path fill-rule="evenodd" clip-rule="evenodd" d="M0 18.8571C0 20.2766 1.14857 21.4286 2.568 21.4286H21.432C22.8514 21.4286 24 20.2766 24 18.8571V15.3703C24.0002 15.1819 23.9383 14.9988 23.824 14.8491C23.7096 14.6994 23.5492 14.5916 23.3674 14.5423C22.8096 14.3904 22.3171 14.0592 21.9661 13.5997C21.615 13.1403 21.4249 12.5782 21.4249 12C21.4249 11.4218 21.615 10.8597 21.9661 10.4002C22.3171 9.94081 22.8096 9.60961 23.3674 9.4577C23.5492 9.40835 23.7096 9.30052 23.824 9.15085C23.9383 9.00119 24.0002 8.81804 24 8.6297V5.14284C24 3.72341 22.8514 2.57141 21.432 2.57141H2.568C1.14857 2.57141 0 3.72341 0 5.14284V8.62284C0.000227924 8.81208 0.0630764 8.99593 0.178744 9.14571C0.294411 9.29548 0.456393 9.40277 0.639429 9.45084C1.20321 9.59827 1.70222 9.92844 2.05836 10.3897C2.41451 10.8509 2.6077 11.4172 2.6077 12C2.6077 12.5827 2.41451 13.149 2.05836 13.6103C1.70222 14.0715 1.20321 14.4017 0.639429 14.5491C0.456393 14.5972 0.294411 14.7045 0.178744 14.8543C0.0630764 15.004 0.000227924 15.1879 0 15.3771L0 18.8571ZM8.50629 17.0434L17.0777 8.47198C17.269 8.2693 17.3738 8.00006 17.3699 7.72139C17.3659 7.44273 17.2535 7.17656 17.0566 6.97938C16.8596 6.7822 16.5936 6.66952 16.3149 6.66526C16.0363 6.661 15.7669 6.76549 15.564 6.95655L6.99257 15.528C6.88821 15.6263 6.80462 15.7445 6.74678 15.8757C6.68893 16.0068 6.65799 16.1483 6.6558 16.2916C6.65361 16.435 6.68021 16.5773 6.73401 16.7102C6.78782 16.843 6.86775 16.9638 6.96906 17.0652C7.07037 17.1666 7.19101 17.2467 7.32383 17.3006C7.45664 17.3546 7.59893 17.3813 7.74228 17.3793C7.88562 17.3773 8.0271 17.3465 8.15833 17.2888C8.28957 17.2311 8.40789 17.1477 8.50629 17.0434ZM6.89314 8.57141C6.89314 8.11675 7.07375 7.68072 7.39525 7.35923C7.71674 7.03774 8.15277 6.85713 8.60743 6.85713C9.06209 6.85713 9.49812 7.03774 9.81961 7.35923C10.1411 7.68072 10.3217 8.11675 10.3217 8.57141C10.3217 9.02607 10.1411 9.4621 9.81961 9.78359C9.49812 10.1051 9.06209 10.2857 8.60743 10.2857C8.15277 10.2857 7.71674 10.1051 7.39525 9.78359C7.07375 9.4621 6.89314 9.02607 6.89314 8.57141ZM13.7503 15.4286C13.7503 14.9739 13.9309 14.5379 14.2524 14.2164C14.5739 13.8949 15.0099 13.7143 15.4646 13.7143C15.9192 13.7143 16.3553 13.8949 16.6768 14.2164C16.9982 14.5379 17.1789 14.9739 17.1789 15.4286C17.1789 15.8832 16.9982 16.3192 16.6768 16.6407C16.3553 16.9622 15.9192 17.1428 15.4646 17.1428C15.0099 17.1428 14.5739 16.9622 14.2524 16.6407C13.9309 16.3192 13.7503 15.8832 13.7503 15.4286Z" fill="#A8A8A8"/>
</g>
<defs>
<clipPath id="clip0_90_1443">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>
</svg>
{{ 'CART.ACTIVATE' | translate }}</span>
  </div>

<div class="row">
<div class="col-12 col-md-12 col-sm-12 col-lg-12 col-xl-12 col-xxl-12" style="display: flex;align-items: center;justify-content: space-between;flex-direction: row-reverse;margin-top: 4px;margin-bottom: 5px;">
<span style="color: #000000;font-weight: 700;font-size: 16px;">{{ 'CART.TOTAL' | translate }}</span>
<span style="color: #000000;font-weight: 700;font-size: 16px;">{{ formatCurrency(getTotal(cart)) }}</span>

</div>
<div class="col-12 col-md-12 col-sm-12 col-lg-12 col-xl-12 col-xxl-12" style="
    display: flex;
    align-items: center;
    justify-content: center;
">

<button
  style="color:#F00E0C;background: transparent;border:1px solid #F00E0C;border-radius: 100px;width: 260px;padding: 5px;margin-top: 4px;margin-bottom: 5px;cursor: pointer;"
  [disabled]="cart.items.length === 0"
  (click)="goToCheckout()"
>
  {{ 'CART_DIALOG.ORDER_NOW' | translate }}
</button>
</div>
</div>

</div>

          <span (click)="isShow = false" style="position: absolute;top: 10px;right: 20px;font-size: 30px;cursor: pointer;color: #000000;"></span>
        </div>
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
                    <div class="banner-discount">{{ 'MENU.BANNER_DISCOUNT' | translate }}</div>
                    <div class="banner-text">{{ 'MENU.BANNER_TEXT' | translate }}</div>
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
                      <img [src]="getItemImageUrl(item)" [alt]="item.name" class="item-image" />
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
    /* Remove hover effect when mainPanel is open */
    .panel-open .item-card:hover {
      transform: none;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .item-image-wrapper {
      width: 100%;
      height: 200px;
      overflow: hidden;
    }
    .item-image {
      width: 100%;
      height: 100% !important;
      object-fit: cover;
      border-radius: 0 !important;
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
  cart$!: Observable<Cart>;
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
  pendingItem: MenuItem | null = null;
  pendingQuantity: number = 1;
  private langChangeSubscription?: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cartService: CartService,
    private translationService: TranslationService,
    private categoryService: CategoryService,
    private translate: TranslateService,
    private viewportScroller: ViewportScroller,
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

  goToCheckout(): void {
    // Optional: close the side cart popup if it's open
    this.isShow = false;
    this.router.navigate(['/checkout']);
  }

  ngOnInit(): void {
    // Initialize cart observable
    this.cart$ = this.cartService.cart$;

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
                isAvailable: product.isActive,
                images: product.images || [] // Store images array
              } as any);
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

    // Add item directly to cart
    this.cartService.addItem(item, 1);

    // Open the side panel automatically to show the cart
    this.isShow = true;
  }

  addPendingItemToCart(): void {
    if (this.pendingItem) {
      this.cartService.addItem(this.pendingItem, this.pendingQuantity);
      this.pendingItem = null;
      this.pendingQuantity = 1;
    }
  }

  removePendingItem(): void {
    this.pendingItem = null;
    this.pendingQuantity = 1;
  }

  increasePendingQuantity(): void {
    this.pendingQuantity++;
  }

  decreasePendingQuantity(): void {
    if (this.pendingQuantity > 1) {
      this.pendingQuantity--;
    }
  }

  navigateToItem(itemId: string): void {
    this.router.navigate(['/item', itemId]);
  }

  removeCartItem(itemId: string): void {
    this.cartService.removeItem(itemId);
  }

  increaseQuantity(itemId: string): void {
    const cart = this.cartService.getCart();
    const item = cart.items.find(i => i.menuItem.id === itemId);
    if (item) {
      this.cartService.updateQuantity(itemId, item.quantity + 1);
    }
  }

  decreaseQuantity(itemId: string): void {
    const cart = this.cartService.getCart();
    const item = cart.items.find(i => i.menuItem.id === itemId);
    if (item && item.quantity > 1) {
      this.cartService.updateQuantity(itemId, item.quantity - 1);
    }
  }

  formatCurrency(amount: number): string {
    return `${amount.toFixed(2)} ر.ق`;
  }

  getTotal(cart: Cart): number {
    return cart.subtotal || 0;
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

  ngOnDestroy(): void {
    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }
  }
}

