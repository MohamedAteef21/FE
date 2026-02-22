import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { SharedModule } from '../../../shared/shared.module';
import { ProductService, CreateProductRequest } from '../../../core/services/product.service';

// Custom validator for positive numbers (including decimals)
function positiveNumberValidator(control: AbstractControl): ValidationErrors | null {
  if (control.value === null || control.value === undefined || control.value === '') {
    return null; // Let required validator handle empty values
  }
  const value = typeof control.value === 'string' ? parseFloat(control.value) : control.value;
  if (isNaN(value) || value < 0) {
    return { positiveNumber: true };
  }
  return null;
}

@Component({
  selector: 'app-add-product-dialog',
  standalone: true,
  imports: [CommonModule, SharedModule, MatDialogModule, ReactiveFormsModule],
  template: `
    <div class="add-product-dialog-container">
      <!-- Header -->
      <div class="dialog-header">
        <div class="header-content">
          <svg class="header-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.6371 18.9679L21.0433 17.904C22.4089 17.6003 22.7637 19.2362 21.6568 19.6363C20.8959 19.9023 17.4726 21.3642 15.1159 22.2478C13.4206 22.8834 12.908 22.9684 11.1227 22.8832L8.40874 22.7538L7.9196 23.5312M1.6875 23.5312L3.26437 20.7158C5.73045 16.1911 9.99179 18.409 12.0849 18.2156C12.5328 18.1742 15.2492 17.865 15.6972 17.8236C16.1646 17.7804 16.5814 18.1406 16.6232 18.6242C16.6651 19.1077 16.2823 19.3944 15.8494 19.5818C14.7143 20.0732 13.4796 20.5019 12.4438 20.7451" stroke="currentColor" stroke-width="0.781247" stroke-miterlimit="2.6131" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M1.40789 12.9248C1.50876 7.14704 6.22132 2.51599 12 2.51599C17.7787 2.51599 22.4912 7.14704 22.5921 12.9248M23.5313 13.1097C23.5313 14.2699 22.582 15.2191 21.4219 15.2191H2.57812C1.41797 15.2191 0.46875 14.2699 0.46875 13.1097H23.5313Z" stroke="currentColor" stroke-miterlimit="22.9256" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M4.65234 8.86753C5.39699 7.57772 6.46805 6.50667 7.75786 5.76202M12 2.51597C12.5638 2.51597 13.0236 2.05617 13.0236 1.49236C13.0236 0.928594 12.5638 0.46875 12 0.46875C11.4363 0.46875 10.9764 0.928547 10.9764 1.49236C10.9764 2.05613 11.4363 2.51597 12 2.51597Z" stroke="currentColor" stroke-miterlimit="22.9256" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="header-text">{{ isEditMode ? 'تعديل منتج' : 'اضافة منتج' }}</span>
          <svg *ngIf="!isEditMode" class="plus-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <button mat-icon-button class="close-btn" (click)="close()">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
      <div class="divider-line"></div>

      <!-- Content -->
      <div class="dialog-content">
        <form [formGroup]="productForm" (ngSubmit)="save()">
          <!-- Product Name -->
          <div class="form-group">
            <div class="float-label-wrapper" [class.has-value]="productForm.get('name')?.value">
              <input 
                type="text" 
                class="form-input" 
                [class.error]="productForm.get('name')?.invalid && productForm.get('name')?.touched"
                formControlName="name"
                [placeholder]="getPlaceholder('اسم المنتج')"
                id="name" />
              <label for="name">اسم المنتج<span class="required-asterisk">*</span></label>
            </div>
            <span class="error-message" *ngIf="productForm.get('name')?.hasError('required') && productForm.get('name')?.touched">
              اسم المنتج مطلوب
            </span>
          </div>

          <!-- Product Name English -->
          <div class="form-group">
            <div class="float-label-wrapper" [class.has-value]="productForm.get('nameEn')?.value">
              <input 
                type="text" 
                class="form-input" 
                [class.error]="productForm.get('nameEn')?.invalid && productForm.get('nameEn')?.touched"
                formControlName="nameEn"
                [placeholder]="getPlaceholder('Product Name')"
                id="nameEn" />
              <label for="nameEn">اسم المنتج (إنجليزي)<span class="required-asterisk">*</span></label>
            </div>
            <span class="error-message" *ngIf="productForm.get('nameEn')?.hasError('required') && productForm.get('nameEn')?.touched">
              اسم المنتج بالإنجليزية مطلوب
            </span>
          </div>

          <!-- Description -->
          <div class="form-group">
            <div class="float-label-wrapper" [class.has-value]="productForm.get('description')?.value">
              <textarea 
                class="form-input form-textarea" 
                [class.error]="productForm.get('description')?.invalid && productForm.get('description')?.touched"
                formControlName="description"
                [placeholder]="getPlaceholder('الوصف')"
                id="description"
                rows="3"></textarea>
              <label for="description">الوصف<span class="required-asterisk">*</span></label>
            </div>
            <span class="error-message" *ngIf="productForm.get('description')?.hasError('required') && productForm.get('description')?.touched">
              الوصف مطلوب
            </span>
          </div>

          <!-- Description English -->
          <div class="form-group">
            <div class="float-label-wrapper" [class.has-value]="productForm.get('descriptionEn')?.value">
              <textarea 
                class="form-input form-textarea" 
                [class.error]="productForm.get('descriptionEn')?.invalid && productForm.get('descriptionEn')?.touched"
                formControlName="descriptionEn"
                [placeholder]="getPlaceholder('Description')"
                id="descriptionEn"
                rows="3"></textarea>
              <label for="descriptionEn">الوصف (إنجليزي)<span class="required-asterisk">*</span></label>
            </div>
            <span class="error-message" *ngIf="productForm.get('descriptionEn')?.hasError('required') && productForm.get('descriptionEn')?.touched">
              الوصف بالإنجليزية مطلوب
            </span>
          </div>

          <!-- Quantity Determination Method -->
          <div class="form-group">
            <label class="section-label">طريقة تحديد الكمية<span class="required-asterisk">*</span></label>
            <div class="radio-group">
              <label class="radio-option">
                <input type="radio" formControlName="quantityMethod" value="piece" />
                <span class="radio-label">بقطعه</span>
              </label>
              <label class="radio-option">
                <input type="radio" formControlName="quantityMethod" value="quantity" />
                <span class="radio-label">بالكميه او الحجم</span>
              </label>
            </div>
          </div>

          <!-- Variants Section (shown when quantity method is selected) -->
          <div class="form-group" *ngIf="productForm.get('quantityMethod')?.value === 'quantity'">
            <label class="section-label">الكميات أو الأحجام</label>
            <div formArrayName="variants" class="variants-container">
              <div *ngFor="let variant of getVariantsArray().controls; let i = index; trackBy: trackByVariantIndex" [formGroupName]="i" class="variant-item">
                <div class="variant-inputs">
                  <div class="float-label-wrapper variant-input" [class.has-value]="variant.get('nameAr')?.value">
                    <input 
                      type="text" 
                      class="form-input" 
                      formControlName="nameAr"
                      [placeholder]="getPlaceholder('الاسم بالعربي')"
                      [id]="'variant-nameAr-' + i" />
                    <label [for]="'variant-nameAr-' + i">الاسم بالعربي</label>
                  </div>
                  <div class="float-label-wrapper variant-input" [class.has-value]="variant.get('nameEn')?.value">
                    <input 
                      type="text" 
                      class="form-input" 
                      formControlName="nameEn"
                      [placeholder]="getPlaceholder('الاسم بالإنجليزي')"
                      [id]="'variant-nameEn-' + i" />
                    <label [for]="'variant-nameEn-' + i">الاسم بالإنجليزي</label>
                  </div>
                  <div class="float-label-wrapper variant-input" [class.has-value]="variant.get('price')?.value">
                    <input 
                      type="number" 
                      class="form-input" 
                      formControlName="price"
                      [placeholder]="getPlaceholder('السعر')"
                      [id]="'variant-price-' + i"
                      min="0"
                      step="0.01"
                      (keydown)="onPriceKeyDown($event)"
                      (input)="onPriceInput($event)" />
                    <label [for]="'variant-price-' + i">السعر</label>
                  </div>
                  <span class="error-message" *ngIf="variant.get('price')?.hasError('positiveNumber') && variant.get('price')?.touched">
                    يجب أن يكون السعر رقم موجب
                  </span>
                  <span class="error-message" *ngIf="variant.get('price')?.hasError('min') && variant.get('price')?.touched">
                    السعر يجب أن يكون أكبر من صفر
                  </span>
                </div>
                <button type="button" class="remove-variant-btn" (click)="removeVariant(i, $event)" *ngIf="getVariantsArray().length > 1">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 10H15" stroke="#F00E0C" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </button>
              </div>
            </div>
            <button type="button" class="add-variant-btn" (click)="addVariant()">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 5V15M5 10H15" stroke="#F00E0C" stroke-width="2" stroke-linecap="round"/>
              </svg>
              <span>إضافة حجم/كمية</span>
            </button>
          </div>

          <!-- Product Price (shown when piece method is selected) -->
          <div class="form-group" *ngIf="productForm.get('quantityMethod')?.value === 'piece'">
            <div class="float-label-wrapper" [class.has-value]="productForm.get('price')?.value">
              <input 
                type="number" 
                class="form-input" 
                [class.error]="productForm.get('price')?.invalid && productForm.get('price')?.touched"
                formControlName="price"
                [placeholder]="getPlaceholder('سعر المنتج')"
                id="price"
                min="0"
                step="0.01"
                (keydown)="onPriceKeyDown($event)"
                (input)="onPriceInput($event)" />
              <label for="price">سعر المنتج<span class="required-asterisk">*</span></label>
            </div>
            <span class="error-message" *ngIf="productForm.get('price')?.hasError('required') && productForm.get('price')?.touched">
              سعر المنتج مطلوب
            </span>
            <span class="error-message" *ngIf="productForm.get('price')?.hasError('positiveNumber') && productForm.get('price')?.touched">
              يجب أن يكون السعر رقم موجب
            </span>
            <span class="error-message" *ngIf="productForm.get('price')?.hasError('min') && productForm.get('price')?.touched">
              السعر يجب أن يكون أكبر من صفر
            </span>
          </div>

          <!-- Status Selection -->
          <div class="form-group status-section">
            <label class="status-label">الحالة<span class="required-asterisk">*</span></label>
            <div class="radio-group">
              <label class="radio-option">
                <input type="radio" formControlName="status" [value]="true" />
                <span class="radio-label">مفعل</span>
              </label>
              <label class="radio-option">
                <input type="radio" formControlName="status" [value]="false" />
                <span class="radio-label">غير مفعل</span>
              </label>
            </div>
          </div>

          <!-- Product Image Upload -->
          <div class="image-upload-area" (click)="triggerFileInput()">
            <input 
              type="file" 
              #fileInput
              accept="image/*" 
              (change)="onFileSelected($event)"
              style="display: none;" />
            <div class="upload-content" *ngIf="!selectedImage">
              <svg class="camera-icon" width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 18C20.6863 18 18 20.6863 18 24C18 27.3137 20.6863 30 24 30C27.3137 30 30 27.3137 30 24C30 20.6863 27.3137 18 24 18ZM24 28C21.7909 28 20 26.2091 20 24C20 21.7909 21.7909 20 24 20C26.2091 20 28 21.7909 28 24C28 26.2091 26.2091 28 24 28Z" fill="#ADB5BD"/>
                <path d="M16 10H14C12.8954 10 12 10.8954 12 12V14H8C5.79086 14 4 15.7909 4 18V36C4 38.2091 5.79086 40 8 40H40C42.2091 40 44 38.2091 44 36V18C44 15.7909 42.2091 14 40 14H36V12C36 10.8954 35.1046 10 34 10H32C30.8954 10 30 10.8954 30 12V14H18V12C18 10.8954 17.1046 10 16 10ZM40 36H8V18H40V36ZM24 16C28.4183 16 32 19.5817 32 24C32 28.4183 28.4183 32 24 32C19.5817 32 16 28.4183 16 24C16 19.5817 19.5817 16 24 16Z" fill="#ADB5BD"/>
              </svg>
              <svg class="plus-overlay" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 3V13M3 8H13" stroke="#ADB5BD" stroke-width="2" stroke-linecap="round"/>
              </svg>
              <span class="upload-text">صورة المنتج</span>
            </div>
            <img *ngIf="selectedImage" [src]="selectedImage" alt="Product" class="preview-image" />
          </div>
          <!-- Save Button -->
          <div class="save-btn-container">
            <button type="submit" class="save-btn" [disabled]="!isFormValid() || isLoading">
              <span *ngIf="isLoading">جاري الحفظ...</span>
              <span *ngIf="!isLoading">{{ isEditMode ? 'تحديث' : 'حفظ' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .add-product-dialog-container {
      width: 100%;
      max-width: 500px;
      max-height: 90vh;
      background: #F5F5F5;
      border-radius: 0;
      display: flex;
      flex-direction: column;
      direction: rtl;
      overflow: hidden;
    }

    .dialog-header {
      padding: 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: white;
    }

    .header-content {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .header-icon {
      width: 24px;
      height: 24px;
      flex-shrink: 0;
    }

    .header-text {
      font-family: Alexandria;
      font-weight: 500;
      font-size: 18px;
      color: #000;
    }

    .plus-icon {
      width: 24px;
      height: 24px;
      color: #000;
    }

    .close-btn {
      color: #000;
      padding: 0;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .divider-line {
      height: 1px;
      background: #E0E0E0;
      width: 100%;
    }

    .dialog-content {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      overflow-y: auto;
      flex: 1;
      min-height: 0;
    }

    .dialog-content::-webkit-scrollbar {
      width: 8px;
    }

    .dialog-content::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 10px;
    }

    .dialog-content::-webkit-scrollbar-thumb {
      background: #ADB5BD;
      border-radius: 10px;
    }

    .dialog-content::-webkit-scrollbar-thumb:hover {
      background: #8a9399;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .section-label {
      font-family: Alexandria;
      font-weight: 500;
      font-size: 14px;
      color: #000;
      margin-bottom: 0.5rem;
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
      font-family: Alexandria;
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

    .float-label-wrapper textarea ~ label {
      top: 1.5rem;
      transform: none;
    }

    .float-label-wrapper input:focus ~ label,
    .float-label-wrapper input:not(:placeholder-shown) ~ label,
    .float-label-wrapper.has-value input ~ label {
      top: 0;
      transform: translateY(-50%);
      font-size: 12px;
      color: #333;
      opacity: 1;
    }

    .float-label-wrapper textarea:focus ~ label,
    .float-label-wrapper textarea:not(:placeholder-shown) ~ label,
    .float-label-wrapper.has-value textarea ~ label {
      top: 0;
      transform: translateY(-50%);
      font-size: 12px;
      color: #333;
      opacity: 1;
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
      font-family: Alexandria;
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

    .form-input:focus {
      outline: none;
      background: white;
      border-color: #ddd;
    }

    .form-input.error {
      border-color: #F00E0C;
    }

    .form-textarea {
      resize: vertical;
      min-height: 80px;
      height: auto;
      padding-top: 1rem;
      font-family: Alexandria;
    }

    .required-asterisk {
      color: #F00E0C;
      margin-right: 4px;
    }

    .error-message {
      display: block;
      color: #F00E0C;
      font-size: 12px;
      margin-top: 0.25rem;
      text-align: right;
      font-family: Alexandria;
    }

    .radio-group {
      display: flex;
      gap: 1.5rem;
      direction: rtl;
    }

    .radio-option {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
    }

    .radio-option input[type="radio"] {
      width: 18px;
      height: 18px;
      cursor: pointer;
      accent-color: #F00E0C;
    }

    .radio-label {
      font-family: Alexandria;
      font-weight: 400;
      font-size: 14px;
      color: #000;
    }

    .checkbox-group {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      direction: rtl;
    }

    .checkbox-option {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
    }

    .checkbox-option input[type="checkbox"] {
      width: 18px;
      height: 18px;
      cursor: pointer;
      accent-color: #F00E0C;
    }

    .checkbox-label {
      font-family: Alexandria;
      font-weight: 400;
      font-size: 14px;
      color: #000;
    }

    .image-upload-area {
      width: 100%;
      min-height: 200px;
      border: 2px dashed #ADB5BD;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      position: relative;
      background: white;
      transition: border-color 0.3s;
    }

    .image-upload-area:hover {
      border-color: #F00E0C;
    }

    .upload-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
      position: relative;
    }

    .camera-icon {
      width: 48px;
      height: 48px;
    }

    .plus-overlay {
      position: absolute;
      top: -8px;
      right: calc(50% - 8px);
      background: white;
      border-radius: 50%;
      padding: 2px;
    }

    .upload-text {
      font-family: Alexandria;
      font-size: 14px;
      color: #ADB5BD;
    }

    .preview-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 6px;
      position: absolute;
      top: 0;
      left: 0;
    }

    .status-section {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 1rem;
      justify-content: space-between;
    }

    .status-label {
      width: auto;
      height: 17px;
      display: flex;
      align-items: center;
      padding-right: 20px;
      font-family: Alexandria;
      font-size: 14px;
      color: #000;
      font-weight: 500;
      white-space: nowrap;
    }

    .save-btn-container {
      display: flex;
      align-items: center;
      margin-top: 0.5rem;
    }

    .save-btn {
      width: 183px;
      height: 42px;
      background: #F00E0C;
      color: white;
      border: 1px solid #F00E0C;
      border-radius: 100px;
      padding: 12px 10px;
      gap: 10px;
      font-family: Alexandria;
      font-weight: 700;
      font-size: 16px;
      cursor: pointer;
      transition: background-color 0.3s;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .save-btn:hover:not(:disabled) {
      background: #D00C0A;
    }

    .save-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .variants-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .variant-item {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 1rem;
      background: white;
      border-radius: 8px;
      border: 1px solid #E7EAEB;
    }

    .variant-inputs {
      display: flex;
      flex-direction: row;
      gap: 1rem;
      flex: 1;
    }

    .variant-input {
      flex: 1;
    }

    .remove-variant-btn {
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      transition: background 0.3s;
      flex-shrink: 0;
    }

    .remove-variant-btn:hover {
      background: #FFF6F6;
    }

    .add-variant-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      background: white;
      border: 1px solid #F00E0C;
      border-radius: 8px;
      color: #F00E0C;
      font-family: Alexandria;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s;
    }

    .add-variant-btn:hover {
      background: #FFF6F6;
    }
  `]
})
export class AddProductDialogComponent {
  productForm: FormGroup;
  selectedImage: string | null = null;
  isEditMode: boolean = false;
  productId: number | null = null;
  categoryId: number | null = null;
  isLoading: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<AddProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private productService: ProductService,
    private messageService: MessageService
  ) {
    this.isEditMode = data?.isEdit || false;
    this.categoryId = data?.categoryId || null;
    const product = data?.product;

    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      nameEn: ['', [Validators.required]],
      description: ['', [Validators.required]],
      descriptionEn: ['', [Validators.required]],
      price: [0, [Validators.min(0.01), positiveNumberValidator]],
      quantityMethod: ['piece', Validators.required],
      variants: this.fb.array([]),
      status: [true, Validators.required]
    });

    // If editing, populate the form with existing product data
    if (this.isEditMode && product) {
      this.productId = product.id;
      this.productForm.patchValue({
        name: product.nameAr || '',
        nameEn: product.nameEn || '',
        description: product.descriptionAr || '',
        descriptionEn: product.descriptionEn || '',
        price: product.basePrice || 0,
        status: product.isActive
      });
      this.selectedImage = product.imageUrl || null;

      // Load variants if they exist
      if (product.variants && product.variants.length > 0) {
        // Clear any existing variants first
        const variantsArray = this.getVariantsArray();
        while (variantsArray.length > 0) {
          variantsArray.removeAt(0);
        }
        // Set quantity method after clearing variants to avoid triggering unwanted side effects
        this.productForm.patchValue({ quantityMethod: 'quantity' }, { emitEvent: false });
        // Add variants from product (pass the id so the backend can match existing ones)
        product.variants.forEach((variant: any) => {
          this.addVariant(variant.nameAr, variant.nameEn, variant.price, variant.id ?? null);
        });
        // Update validity after loading
        variantsArray.updateValueAndValidity();
      }
    } else {
      // Add initial variant when quantity method is selected
      this.productForm.get('quantityMethod')?.valueChanges.subscribe(value => {
        const variantsArray = this.getVariantsArray();
        if (value === 'quantity') {
          // When switching to quantity, add one variant if empty
          if (variantsArray.length === 0) {
            this.addVariant();
          }
          // Clear price validators
          const priceControl = this.productForm.get('price');
          priceControl?.clearValidators();
          priceControl?.updateValueAndValidity();
        } else if (value === 'piece') {
          // When switching to piece, clear variants
          while (variantsArray.length > 0) {
            variantsArray.removeAt(0);
          }
          // Set price validators
          const priceControl = this.productForm.get('price');
          priceControl?.setValidators([Validators.required, Validators.min(0.01)]);
          priceControl?.updateValueAndValidity();
        }
      });
    }
  }

  triggerFileInput(): void {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fileInput?.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImage = e.target.result;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  getVariantsArray(): FormArray {
    return this.productForm.get('variants') as FormArray;
  }

  trackByVariantIndex(index: number): number {
    return index;
  }

  addVariant(nameAr: string = '', nameEn: string = '', price: number = 0, id: number | null = null): void {
    const variantGroup = this.fb.group({
      id: [id],
      nameAr: [nameAr, Validators.required],
      nameEn: [nameEn, Validators.required],
      price: [price, [Validators.required, Validators.min(0.01), positiveNumberValidator]]
    });
    this.getVariantsArray().push(variantGroup);
  }

  removeVariant(index: number, event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const variantsArray = this.getVariantsArray();
    const currentLength = variantsArray.length;

    if (index >= 0 && index < currentLength) {
      console.log(`Removing variant at index ${index}. Current length: ${currentLength}`);
      variantsArray.removeAt(index);
      variantsArray.updateValueAndValidity();
      this.productForm.updateValueAndValidity();
      console.log(`After removal. New length: ${variantsArray.length}`);
    } else {
      console.warn(`Invalid index ${index} for variants array of length ${currentLength}`);
    }
  }

  isFormValid(): boolean {
    const baseValid = (this.productForm.get('name')?.valid ?? false) &&
      (this.productForm.get('nameEn')?.valid ?? false) &&
      (this.productForm.get('description')?.valid ?? false) &&
      (this.productForm.get('descriptionEn')?.valid ?? false);

    const quantityMethod = this.productForm.get('quantityMethod')?.value;

    if (quantityMethod === 'piece') {
      // For piece method, price is required
      return baseValid && (this.productForm.get('price')?.valid ?? false);
    } else if (quantityMethod === 'quantity') {
      // For quantity method, variants are required
      const variants = this.getVariantsArray();
      return baseValid && variants.length > 0 && (variants.valid ?? false);
    }

    return baseValid;
  }

  save(): void {
    if (this.isFormValid() && !this.isLoading) {
      this.isLoading = true;
      const formValue = this.productForm.value;
      const quantityMethod = formValue.quantityMethod;

      // Prepare variants array - only include current variants from form
      let variants: any[] = [];
      if (quantityMethod === 'quantity') {
        const variantsArray = this.getVariantsArray();
        // Ensure FormArray is up to date
        variantsArray.updateValueAndValidity();

        // Get only the current variants from the form array
        // Use a Set to track unique variants and prevent duplicates
        const uniqueVariants = new Map<string, any>();

        variantsArray.controls.forEach((control: AbstractControl) => {
          const variantValue = control.value;
          const id: number | null = variantValue.id ?? null;
          const nameAr = (variantValue.nameAr || '').trim();
          const nameEn = (variantValue.nameEn || '').trim();
          const price = variantValue.price || 0;

          // Only include valid variants
          if (nameAr && nameEn && price > 0) {
            // Use id (if present) or name combo as unique key to prevent duplicates
            const uniqueKey = id != null ? `id-${id}` : `${nameAr}|${nameEn}`;
            if (!uniqueVariants.has(uniqueKey)) {
              const variant: any = { nameAr, nameEn, price };
              // Include id for existing variants so the backend replaces instead of appending
              if (id != null) {
                variant.id = id;
              }
              uniqueVariants.set(uniqueKey, variant);
            }
          }
        });

        // Convert Map values to array
        variants = Array.from(uniqueVariants.values());

        // Debug: Log the variants being sent
        console.log('Variants being sent:', variants.length, variants);
        console.log('FormArray length:', variantsArray.length);
      }

      // Prepare base price - use price for piece method, or 0 for quantity method
      const basePrice = quantityMethod === 'piece' ? formValue.price : 0;

      // Prepare product data
      const productData: CreateProductRequest = {
        nameAr: formValue.name,
        nameEn: formValue.nameEn,
        descriptionAr: formValue.description,
        descriptionEn: formValue.descriptionEn,
        basePrice: basePrice,
        categoryId: this.categoryId || 0,
        imageUrl: this.selectedImage || '',
        isActive: formValue.status === true || formValue.status === 'true',
        preparationTime: 30, // Default value
        variants: variants
      };

      const apiCall = this.isEditMode && this.productId
        ? this.productService.updateProduct(this.productId, productData)
        : this.productService.createProduct(productData);

      apiCall.subscribe({
        next: (product) => {
          this.isLoading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'نجح',
            detail: this.isEditMode ? 'تم تحديث المنتج بنجاح' : 'تم إضافة المنتج بنجاح',
            life: 3000
          });
          this.dialogRef.close({ success: true, product });
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error saving product:', error);
          const errorMessage = error?.error?.message || error?.message || 'حدث خطأ أثناء حفظ المنتج';
          this.messageService.add({
            severity: 'error',
            summary: 'خطأ',
            detail: errorMessage,
            life: 5000
          });
        }
      });
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  getPlaceholder(text: string): string {
    return `${text} *`;
  }

  onPriceKeyDown(event: KeyboardEvent): void {
    // Allow: backspace, delete, tab, escape, enter, decimal point, and numbers
    const allowedKeys = [
      'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
      'Home', 'End'
    ];

    // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
    if (event.ctrlKey || event.metaKey) {
      if (['a', 'c', 'v', 'x'].includes(event.key.toLowerCase())) {
        return;
      }
    }

    // Allow numbers
    if (event.key >= '0' && event.key <= '9') {
      return;
    }

    // Allow decimal point (only one)
    if (event.key === '.' || event.key === ',') {
      const input = event.target as HTMLInputElement;
      if (input.value.includes('.') || input.value.includes(',')) {
        event.preventDefault();
        return;
      }
      return;
    }

    // Block minus sign
    if (event.key === '-' || event.key === '+') {
      event.preventDefault();
      return;
    }

    // Block other keys if not in allowed list
    if (!allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  onPriceInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Remove minus signs
    value = value.replace(/-/g, '');

    // Replace comma with dot for decimal
    value = value.replace(/,/g, '.');

    // Ensure only one decimal point
    const parts = value.split('.');
    if (parts.length > 2) {
      value = parts[0] + '.' + parts.slice(1).join('');
    }

    // Update the input value if it changed
    if (input.value !== value) {
      input.value = value;
    }

    // Update form control
    const controlName = input.getAttribute('formControlName');
    if (controlName === 'price') {
      // Main price field
      const formControl = this.productForm.get('price');
      if (formControl) {
        const numValue = value === '' ? 0 : (parseFloat(value) || 0);
        formControl.setValue(numValue < 0 ? 0 : numValue, { emitEvent: true });
        if (numValue < 0) {
          input.value = '0';
        }
      }
    } else if (input.id.startsWith('variant-price-')) {
      // Variant price field
      const variantIndex = parseInt(input.id.split('-').pop() || '0');
      const variantsArray = this.getVariantsArray();
      if (variantsArray.at(variantIndex)) {
        const variantControl = variantsArray.at(variantIndex).get('price');
        if (variantControl) {
          const numValue = value === '' ? 0 : (parseFloat(value) || 0);
          variantControl.setValue(numValue < 0 ? 0 : numValue, { emitEvent: true });
          if (numValue < 0) {
            input.value = '0';
          }
        }
      }
    }
  }
}

