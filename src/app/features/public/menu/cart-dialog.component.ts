import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { SharedModule } from '../../../shared/shared.module';
import { CartService } from '../../../core/services/cart.service';
import { Cart, CartItem, MenuItem } from '../../../models/menu-item.model';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart-dialog',
  standalone: true,
  imports: [CommonModule, SharedModule, MatDialogModule, FormsModule],
  template: `
    <div class="cart-dialog-container" style="min-width: 100%;border-radius: 0px;">
      <!-- Header -->
      <div class="dialog-header row">

        <div class="header-content col-10 co-sm-10 col-md-10 col-lg-10 col-xl-10 col-xxl-10" style="display: flex;align-items: flex-start;justify-content: flex-start;flex-direction: column;">
          <h2 class="dialog-title">سله التسوق</h2>
          <span class="item-count">{{ (cart$ | async)?.items?.length || 0 }} صنف</span>
        </div>

        <button class="col-2 co-sm-2 col-md-2 col-lg-2 col-xl-2 col-xxl-2" mat-icon-button class="close-btn" (click)="close()" >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>

      </div>

      <!-- Scrollable Content -->
      <div class="dialog-scrollable-content">

      <!-- Pending Item to Add -->
      <div class="pending-item-section" *ngIf="pendingItem">
        <h3 class="pending-section-title" style="display: flex;">{{ "CART_DIALOG.ADD_NEW_ITEM" | translate }}</h3>
        <div class="pending-item-card" style="display: flex;flex-direction: column;">

<span style="width: 100%;display: flex;">
          <button class="delete-pending-btn" (click)="removePendingItem()">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.16651 24.5C7.52484 24.5 6.97573 24.2717 6.51917 23.8152C6.06262 23.3586 5.83395 22.8091 5.83317 22.1667V7C5.50262 7 5.22573 6.888 5.00251 6.664C4.77929 6.44 4.66729 6.16311 4.66651 5.83333C4.66573 5.50356 4.77773 5.22667 5.00251 5.00267C5.22729 4.77867 5.50417 4.66667 5.83317 4.66667H10.4998C10.4998 4.33611 10.6118 4.05922 10.8358 3.836C11.0598 3.61278 11.3367 3.50078 11.6665 3.5H16.3332C16.6637 3.5 16.941 3.612 17.165 3.836C17.389 4.06 17.5006 4.33689 17.4998 4.66667H22.1665C22.4971 4.66667 22.7743 4.77867 22.9983 5.00267C23.2223 5.22667 23.334 5.50356 23.3332 5.83333C23.3324 6.16311 23.2204 6.44039 22.9972 6.66517C22.774 6.88994 22.4971 7.00156 22.1665 7V22.1667C22.1665 22.8083 21.9382 23.3578 21.4817 23.8152C21.0251 24.2725 20.4756 24.5008 19.8332 24.5H8.16651ZM11.6665 19.8333C11.9971 19.8333 12.2743 19.7213 12.4983 19.4973C12.7223 19.2733 12.834 18.9964 12.8332 18.6667V10.5C12.8332 10.1694 12.7212 9.89256 12.4972 9.66933C12.2732 9.44611 11.9963 9.33411 11.6665 9.33333C11.3367 9.33256 11.0598 9.44456 10.8358 9.66933C10.6118 9.89411 10.4998 10.171 10.4998 10.5V18.6667C10.4998 18.9972 10.6118 19.2745 10.8358 19.4985C11.0598 19.7225 11.3367 19.8341 11.6665 19.8333ZM16.3332 19.8333C16.6637 19.8333 16.941 19.7213 17.165 19.4973C17.389 19.2733 17.5006 18.9964 17.4998 18.6667V10.5C17.4998 10.1694 17.3878 9.89256 17.1638 9.66933C16.9398 9.44611 16.663 9.33411 16.3332 9.33333C16.0034 9.33256 15.7265 9.44456 15.5025 9.66933C15.2785 9.89411 15.1665 10.171 15.1665 10.5V18.6667C15.1665 18.9972 15.2785 19.2745 15.5025 19.4985C15.7265 19.7225 16.0034 19.8341 16.3332 19.8333Z" fill="#F00E0C"/>
            </svg>
          </button>
            <h4 class="item-name">{{ pendingItem.name }}</h4>
</span>




<div class="item-details" style="width: 100%;display: flex;flex-direction: row;justify-content: space-between;">
  <div class="item-image-wrapper">
    <img [src]="pendingItem.imageUrl" [alt]="pendingItem.name" class="item-image" />
  </div>



            <div class="item-controls" style="display: flex;align-items: flex-end;">
              <div class="quantity-control">
                <button class="qty-btn minus" (click)="decreasePendingQuantity()" [disabled]="pendingQuantity <= 1">-</button>
                <span class="qty-value">{{ pendingQuantity }}</span>
                <button class="qty-btn plus" (click)="increasePendingQuantity()">+</button>
              </div>
            </div>


          </div>
          <div class="price-add-section" style="width: 100%;">
            <span class="item-price">{{ formatCurrency(pendingItem.price * pendingQuantity) }}</span>


            <button class="add-pending-btn" (click)="addPendingItem()">
              {{ "CART_DIALOG.ADD_TO_CART" | translate }}
            </button>
          </div>
        </div>
      </div>

      <!-- Existing Cart Items Section -->
      <div class="existing-items-section" *ngIf="cart$ | async as cart">
        <h3 class="existing-section-title" *ngIf="cart.items.length > 0" style="display: flex ;">{{ "CART_DIALOG.EXISTING_ITEMS" | translate }}</h3>

        <!-- Cart Items -->
        <div class="cart-items-container">
          <div class="cart-item-card" *ngFor="let item of cart.items" style="
    display: flex;
    flex-direction: column;
">

<span style="width: 100%;display: flex;">
            <button class="delete-item-btn" (click)="removeItem(item.menuItem.id)">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.16651 24.5C7.52484 24.5 6.97573 24.2717 6.51917 23.8152C6.06262 23.3586 5.83395 22.8091 5.83317 22.1667V7C5.50262 7 5.22573 6.888 5.00251 6.664C4.77929 6.44 4.66729 6.16311 4.66651 5.83333C4.66573 5.50356 4.77773 5.22667 5.00251 5.00267C5.22729 4.77867 5.50417 4.66667 5.83317 4.66667H10.4998C10.4998 4.33611 10.6118 4.05922 10.8358 3.836C11.0598 3.61278 11.3367 3.50078 11.6665 3.5H16.3332C16.6637 3.5 16.941 3.612 17.165 3.836C17.389 4.06 17.5006 4.33689 17.4998 4.66667H22.1665C22.4971 4.66667 22.7743 4.77867 22.9983 5.00267C23.2223 5.22667 23.334 5.50356 23.3332 5.83333C23.3324 6.16311 23.2204 6.44039 22.9972 6.66517C22.774 6.88994 22.4971 7.00156 22.1665 7V22.1667C22.1665 22.8083 21.9382 23.3578 21.4817 23.8152C21.0251 24.2725 20.4756 24.5008 19.8332 24.5H8.16651ZM11.6665 19.8333C11.9971 19.8333 12.2743 19.7213 12.4983 19.4973C12.7223 19.2733 12.834 18.9964 12.8332 18.6667V10.5C12.8332 10.1694 12.7212 9.89256 12.4972 9.66933C12.2732 9.44611 11.9963 9.33411 11.6665 9.33333C11.3367 9.33256 11.0598 9.44456 10.8358 9.66933C10.6118 9.89411 10.4998 10.171 10.4998 10.5V18.6667C10.4998 18.9972 10.6118 19.2745 10.8358 19.4985C11.0598 19.7225 11.3367 19.8341 11.6665 19.8333ZM16.3332 19.8333C16.6637 19.8333 16.941 19.7213 17.165 19.4973C17.389 19.2733 17.5006 18.9964 17.4998 18.6667V10.5C17.4998 10.1694 17.3878 9.89256 17.1638 9.66933C16.9398 9.44611 16.663 9.33411 16.3332 9.33333C16.0034 9.33256 15.7265 9.44456 15.5025 9.66933C15.2785 9.89411 15.1665 10.171 15.1665 10.5V18.6667C15.1665 18.9972 15.2785 19.2745 15.5025 19.4985C15.7265 19.7225 16.0034 19.8341 16.3332 19.8333Z" fill="#F00E0C"/>
              </svg>
            </button>
              <h4 class="item-name">{{ item.menuItem.name }}</h4>
</span>

            <div class="item-image-wrapper">
              <img [src]="item.menuItem.imageUrl" [alt]="item.menuItem.name" class="item-image" />
            </div>

            
            <div class="item-details" style="display: flex;">

              <div class="item-controls">
                <div class="quantity-control">
                  <button class="qty-btn minus" (click)="decreaseQuantity(item.menuItem.id, item.quantity)" [disabled]="item.quantity <= 1">-</button>
                  <span class="qty-value">{{ item.quantity }}</span>
                  <button class="qty-btn plus" (click)="increaseQuantity(item.menuItem.id)">+</button>
                </div>
                <span class="item-price">{{ formatCurrency(item.menuItem.price * item.quantity) }}</span>
              </div>
            </div>
          </div>

          <!-- Empty Cart Message -->
          <div class="empty-cart-message" *ngIf="cart.items.length === 0">
            <p>{{ "CART_DIALOG.EMPTY_CART" | translate }}</p>
          </div>
        </div>
      </div>

      <!-- Discount Code Section -->
      <div class="discount-section">
        <div class="discount-input-group">
          <input 
            type="text" 
            class="discount-input" 
            [placeholder]="'CART.DISCOUNT_PLACEHOLDER' | translate"
            [(ngModel)]="discountCode"
            (keyup.enter)="applyDiscount()" />
          <button class="discount-btn" (click)="applyDiscount()">
            {{ "CART.ACTIVATE" | translate }}
            <svg width="24" height="19" viewBox="0 0 24 19" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M0 16.2857C0 17.7051 1.14857 18.8571 2.568 18.8571H21.432C22.8514 18.8571 24 17.7051 24 16.2857V12.7989C24.0002 12.6105 23.9383 12.4274 23.824 12.2777C23.7096 12.128 23.5492 12.0202 23.3674 11.9709C22.8096 11.8189 22.3171 11.4877 21.9661 11.0283C21.615 10.5689 21.4249 10.0068 21.4249 9.42857C21.4249 8.85038 21.615 8.28824 21.9661 7.82882C22.3171 7.3694 22.8096 7.0382 23.3674 6.88629C23.5492 6.83694 23.7096 6.7291 23.824 6.57944C23.9383 6.42978 24.0002 6.24663 24 6.05829V2.57143C24 1.152 22.8514 0 21.432 0H2.568C1.14857 0 0 1.152 0 2.57143V6.05143C0.000227924 6.24067 0.0630764 6.42452 0.178744 6.57429C0.294411 6.72407 0.456393 6.83136 0.639429 6.87943C1.20321 7.02686 1.70222 7.35703 2.05836 7.81828C2.41451 8.27953 2.6077 8.84583 2.6077 9.42857C2.6077 10.0113 2.41451 10.5776 2.05836 11.0389C1.70222 11.5001 1.20321 11.8303 0.639429 11.9777C0.456393 12.0258 0.294411 12.1331 0.178744 12.2828C0.0630764 12.4326 0.000227924 12.6165 0 12.8057L0 16.2857ZM8.50629 14.472L17.0777 5.90057C17.269 5.69789 17.3738 5.42865 17.3699 5.14998C17.3659 4.87131 17.2535 4.60515 17.0566 4.40797C16.8596 4.21079 16.5936 4.09811 16.3149 4.09385C16.0363 4.08959 15.7669 4.19408 15.564 4.38514L6.99257 12.9566C6.88821 13.0549 6.80462 13.1731 6.74678 13.3042C6.68893 13.4354 6.65799 13.5769 6.6558 13.7202C6.65361 13.8635 6.68021 14.0059 6.73401 14.1387C6.78782 14.2716 6.86775 14.3923 6.96906 14.4938C7.07037 14.5952 7.19101 14.6753 7.32383 14.7292C7.45664 14.7832 7.59893 14.8099 7.74228 14.8079C7.88562 14.8059 8.0271 14.7751 8.15833 14.7174C8.28957 14.6597 8.40789 14.5763 8.50629 14.472ZM6.89314 6C6.89314 5.54534 7.07375 5.10931 7.39525 4.78782C7.71674 4.46633 8.15277 4.28571 8.60743 4.28571C9.06209 4.28571 9.49812 4.46633 9.81961 4.78782C10.1411 5.10931 10.3217 5.54534 10.3217 6C10.3217 6.45466 10.1411 6.89069 9.81961 7.21218C9.49812 7.53367 9.06209 7.71429 8.60743 7.71429C8.15277 7.71429 7.71674 7.53367 7.39525 7.21218C7.07375 6.89069 6.89314 6.45466 6.89314 6ZM13.7503 12.8571C13.7503 12.4025 13.9309 11.9665 14.2524 11.645C14.5739 11.3235 15.0099 11.1429 15.4646 11.1429C15.9192 11.1429 16.3553 11.3235 16.6768 11.645C16.9982 11.9665 17.1789 12.4025 17.1789 12.8571C17.1789 13.3118 16.9982 13.7478 16.6768 14.0693C16.3553 14.3908 15.9192 14.5714 15.4646 14.5714C15.0099 14.5714 14.5739 14.3908 14.2524 14.0693C13.9309 13.7478 13.7503 13.3118 13.7503 12.8571Z" fill="#343538"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Total Section -->
      <div class="total-section" *ngIf="cart$ | async as cart">
        <div class="total-row">
          <span class="total-label">{{ "CART_DIALOG.TOTAL" | translate }}</span>
          <span class="total-amount">{{ formatCurrency(getTotal(cart)) }}</span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons" *ngIf="cart$ | async as cart">
        <button class="order-now-btn" (click)="orderNow()" [disabled]="cart.items.length === 0">
          {{ "CART_DIALOG.ORDER_NOW" | translate }}
        </button>
      </div>
      </div>
    </div>
  `,
  styles: [`
    .cart-dialog-container {
      width: 100%;
      max-width: 500px;
      max-height: 90vh;
      background: white;
      border-radius: 15px;
      display: flex;
      flex-direction: column;
      direction: rtl;
      overflow: hidden;
    }

    .dialog-scrollable-content {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      display: flex;
      flex-direction: column;
    }

    .dialog-scrollable-content::-webkit-scrollbar {
      width: 8px;
    }

    .dialog-scrollable-content::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 10px;
    }

    .dialog-scrollable-content::-webkit-scrollbar-thumb {
      background: #F00E0C;
      border-radius: 10px;
    }

    .dialog-scrollable-content::-webkit-scrollbar-thumb:hover {
      background: #D00C0A;
    }

    .dialog-header {
      background: #F00E0C;
      padding: 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: white;
    }

    .header-content {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .dialog-title {
      font-family: 'Almarai', sans-serif;
      font-weight: 700;
      font-size: 1.5rem;
      color: white;
      margin: 0;
    }

    .item-count {
      font-family: 'Almarai', sans-serif;
      font-weight: 400;
      font-size: 1rem;
      color: white;
    }

    .close-btn {
      color: white !important;
      padding: 0;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .pending-item-section {
      padding: 1rem;
      border-bottom: 2px solid #F00E0C;
      background: #FFF5F5;
    }

    .pending-section-title {
      font-family: 'Almarai', sans-serif;
      font-weight: 700;
      font-size: 1.1rem;
      color: #F00E0C;
      margin: 0 0 1rem 0;
    }

    .pending-item-card {
      background: white;
      border: 2px solid #F00E0C;
      border-radius: 10px;
      padding: 1rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      position: relative;
    }

    .delete-pending-btn {
      position: absolute;
      top: 0.5rem;
      left: 0.5rem;
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 0.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1;
    }

    .item-controls {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .price-add-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
    }

    .add-pending-btn {
      background: #F00E0C;
      color: white;
      border: none;
      border-radius: 8px;
      padding: 0.5rem 1.5rem;
      font-family: 'Almarai', sans-serif;
      font-weight: 700;
      font-size: 0.9rem;
      cursor: pointer;
      transition: background-color 0.3s ease;
      white-space: nowrap;
    }

    .add-pending-btn:hover {
      background: #D00C0A;
    }

    .existing-items-section {
      padding: 1rem;
      border-top: 1px solid #E0E0E0;
    }

    .existing-section-title {
      font-family: 'Almarai', sans-serif;
      font-weight: 700;
      font-size: 1.1rem;
      color: #333;
      margin: 0 0 1rem 0;
    }

    .cart-items-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .cart-item-card {
      background: white;
      border: 1px solid #E0E0E0;
      border-radius: 10px;
      padding: 1rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      position: relative;
    }

    .delete-item-btn {
      position: absolute;
      top: 0.5rem;
      left: 0.5rem;
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 0.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1;
    }

    .item-image-wrapper {
      width: 80px;
      height: 80px;
      flex-shrink: 0;
      border-radius: 8px;
      overflow: hidden;
    }

    .item-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .item-details {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .item-name {
      font-family: 'Almarai', sans-serif;
      font-weight: 700;
      font-size: 1rem;
      color: #000;
      margin: 0;
    }

    .item-controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .quantity-control {
      display: flex;
      align-items: center;
      gap: 0.5rem;
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

    .item-price {
      font-family: 'Aref_Menna', serif;
      font-weight: 700;
      font-size: 1.25rem;
      color: #F00E0C;
    }

    .empty-cart-message {
      text-align: center;
      padding: 2rem;
      color: #666;
    }

    .discount-section {
      padding: 1rem;
      border-top: 1px solid #E0E0E0;
      border-bottom: 1px solid #E0E0E0;
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
      padding-right: 120px;
      border: 1px solid #ddd;
      font-family: 'Almarai', sans-serif;
      font-size: 0.9rem;
      direction: rtl;
    }

    .discount-input::placeholder {
      color: #999;
    }

    .discount-btn {
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 110px;
      height: 46px;
      background: #FDC55E;
      color: #343538;
      border: none;
      border-radius: 8px;
      font-family: 'Almarai', sans-serif;
      font-weight: 600;
      font-size: 0.9rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .discount-btn:hover {
      background: #E8B84D;
    }

    .total-section {
      padding: 1rem;
      border-bottom: 1px solid #E0E0E0;
    }

    .total-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .total-label {
      font-family: 'Almarai', sans-serif;
      font-weight: 600;
      font-size: 1rem;
      color: #000;
    }

    .total-amount {
      font-family: 'Aref_Menna', serif;
      font-weight: 700;
      font-size: 1.5rem;
      color: #F00E0C;
    }

    .action-buttons {
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .order-now-btn {
      width: 100%;
      height: 48px;
      border-radius: 8px;
      font-family: 'Almarai', sans-serif;
      font-weight: 700;
      font-size: 1rem;
      cursor: pointer;
      border: none;
      transition: all 0.3s ease;
      background: #F00E0C;
      color: white;
    }

    .order-now-btn:hover:not(:disabled) {
      background: #D00C0A;
    }

    .order-now-btn:disabled {
      background: #CCC;
      color: #666;
      cursor: not-allowed;
    }

    @media (max-width: 576px) {
      .cart-dialog-container {
        max-width: 100%;
        max-height: 100vh;
        border-radius: 0;
      }

      .dialog-header {
        padding: 1rem;
      }

      .dialog-title {
        font-size: 1.25rem;
      }

      .cart-items-container {
        padding: 0.75rem;
      }

      .cart-item-card {
        padding: 0.75rem;
      }

      .item-image-wrapper {
        width: 60px;
        height: 60px;
      }
    }
  `]
})
export class CartDialogComponent implements OnInit {
  cart$!: Observable<Cart>;
  discountCode: string = '';
  appliedDiscount: number = 0;
  pendingItem: MenuItem | null = null;
  pendingQuantity: number = 1;

  constructor(
    private dialogRef: MatDialogRef<CartDialogComponent>,
    private cartService: CartService,
    private router: Router,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: { item?: MenuItem }
  ) {
    this.pendingItem = data?.item || null;
    this.pendingQuantity = 1;
  }

  ngOnInit(): void {
    this.cart$ = this.cartService.cart$;
  }

  increasePendingQuantity(): void {
    this.pendingQuantity++;
  }

  decreasePendingQuantity(): void {
    if (this.pendingQuantity > 1) {
      this.pendingQuantity--;
    }
  }

  removePendingItem(): void {
    this.pendingItem = null;
    this.pendingQuantity = 1;
  }

  addPendingItem(): void {
    if (this.pendingItem) {
      this.cartService.addItem(this.pendingItem, this.pendingQuantity);
      this.pendingItem = null; // Remove from pending after adding
      this.pendingQuantity = 1; // Reset quantity
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  increaseQuantity(itemId: string): void {
    const cart = this.cartService.getCart();
    const item = cart.items.find(i => i.menuItem.id === itemId);
    if (item) {
      this.cartService.updateQuantity(itemId, item.quantity + 1);
    }
  }

  decreaseQuantity(itemId: string, currentQuantity: number): void {
    if (currentQuantity > 1) {
      this.cartService.updateQuantity(itemId, currentQuantity - 1);
    }
    // Don't remove item if quantity is 1, just keep it at 1
  }

  removeItem(itemId: string): void {
    this.cartService.removeItem(itemId);
  }

  applyDiscount(): void {
    // TODO: Implement discount code validation with backend
    if (this.discountCode.trim()) {
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

  getTotal(cart: Cart): number {
    return cart.subtotal + cart.deliveryFee - this.appliedDiscount;
  }

  orderNow(): void {
    this.close();
    this.router.navigate(['/cart']);
  }
}

