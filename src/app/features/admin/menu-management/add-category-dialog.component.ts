import { Component, Inject, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedModule } from '../../../shared/shared.module';
import { CategoryService } from '../../../core/services/category.service';
import { CategoryImage, AddImageRequest, CreateCategoryRequest } from '../../../models/category.model';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-add-category-dialog',
  standalone: true,
  imports: [CommonModule, SharedModule, MatDialogModule, ReactiveFormsModule, TranslateModule],
  template: `
    <div class="add-category-dialog-container">
      <!-- Header -->
      <div class="dialog-header">
        <div class="header-content">
          <svg class="header-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.007 2.9417C2.2425 2.0432 3.0615 1.5002 3.9225 1.5002C4.4535 1.5002 4.9365 1.6997 5.304 2.0252C5.70918 1.68532 6.22114 1.49902 6.75 1.49902C7.27886 1.49902 7.79082 1.68532 8.196 2.0252C8.57621 1.68617 9.06809 1.49924 9.5775 1.5002C10.4385 1.5002 11.2575 2.0432 11.493 2.9417C11.718 3.7997 12 5.1827 12 6.7502C12 7.62553 11.7811 8.48696 11.3632 9.25612C10.9454 10.0253 10.3418 10.6778 9.6075 11.1542C9.201 11.4197 9 11.7617 9 12.0542V12.6482C9 12.6822 9.002 12.7152 9.006 12.7472C9.057 13.1192 9.2415 14.5007 9.414 15.9332C9.5835 17.3387 9.75 18.8717 9.75 19.5002C9.75 20.2958 9.43393 21.0589 8.87132 21.6215C8.30871 22.1841 7.54565 22.5002 6.75 22.5002C5.95435 22.5002 5.19129 22.1841 4.62868 21.6215C4.06607 21.0589 3.75 20.2958 3.75 19.5002C3.75 18.8702 3.9165 17.3402 4.086 15.9332C4.2585 14.5007 4.443 13.1192 4.494 12.7472L4.5 12.6482V12.0542C4.5 11.7617 4.299 11.4197 3.8925 11.1542C3.15818 10.6778 2.55464 10.0253 2.13679 9.25612C1.71894 8.48696 1.50004 7.62553 1.5 6.7502C1.5 5.1827 1.782 3.7997 2.007 2.9417ZM9 7.5002C9 7.69911 8.92098 7.88987 8.78033 8.03052C8.63968 8.17118 8.44891 8.2502 8.25 8.2502C8.05109 8.2502 7.86032 8.17118 7.71967 8.03052C7.57902 7.88987 7.5 7.69911 7.5 7.5002V3.7502C7.5 3.55128 7.42098 3.36052 7.28033 3.21987C7.13968 3.07921 6.94891 3.0002 6.75 3.0002C6.55109 3.0002 6.36032 3.07921 6.21967 3.21987C6.07902 3.36052 6 3.55128 6 3.7502V7.5002C6 7.69911 5.92098 7.88987 5.78033 8.03052C5.63968 8.17118 5.44891 8.2502 5.25 8.2502C5.05109 8.2502 4.86032 8.17118 4.71967 8.03052C4.57902 7.88987 4.5 7.69911 4.5 7.5002V3.5777C4.5 3.42453 4.43916 3.27764 4.33085 3.16934C4.22255 3.06104 4.07566 3.0002 3.9225 3.0002C3.6735 3.0002 3.5025 3.14869 3.4575 3.32269C3.1619 4.44149 3.00819 5.59303 3 6.7502C2.99993 7.37575 3.15635 7.99138 3.45501 8.54104C3.75368 9.09069 4.18511 9.55689 4.71 9.8972C5.3685 10.3247 6 11.0762 6 12.0542V12.6482C6 12.7482 5.9935 12.8482 5.9805 12.9482C5.9295 13.3172 5.7465 14.6897 5.5755 16.1132C5.4015 17.5607 5.25 18.9842 5.25 19.5002C5.25 19.898 5.40804 20.2796 5.68934 20.5609C5.97064 20.8422 6.35218 21.0002 6.75 21.0002C7.14782 21.0002 7.52936 20.8422 7.81066 20.5609C8.09196 20.2796 8.25 19.898 8.25 19.5002C8.25 18.9842 8.1 17.5607 7.9245 16.1117C7.7535 14.6897 7.5705 13.3172 7.5195 12.9467C7.50809 12.8481 7.50158 12.749 7.5 12.6497V12.0557C7.5 11.0777 8.1315 10.3262 8.79 9.89869C9.31511 9.55826 9.74667 9.09181 10.0453 8.54188C10.344 7.99194 10.5003 7.376 10.5 6.7502C10.5 5.3522 10.248 4.10419 10.0425 3.32269C9.9975 3.15019 9.825 3.0002 9.5775 3.0002C9.42434 3.0002 9.27745 3.06104 9.16915 3.16934C9.06084 3.27764 9 3.42453 9 3.5777V7.5002ZM13.5 8.2502C13.5 6.45998 14.2112 4.74309 15.477 3.47722C16.7429 2.21135 18.4598 1.5002 20.25 1.5002C20.4489 1.5002 20.6397 1.57921 20.7803 1.71986C20.921 1.86052 21 2.05128 21 2.2502V11.2097L21.0285 11.4752C21.1478 12.5947 21.2623 13.7147 21.372 14.8352C21.5565 16.7192 21.75 18.8312 21.75 19.5002C21.75 20.2958 21.4339 21.0589 20.8713 21.6215C20.3087 22.1841 19.5456 22.5002 18.75 22.5002C17.9544 22.5002 17.1913 22.1841 16.6287 21.6215C16.0661 21.0589 15.75 20.2958 15.75 19.5002C15.75 18.8312 15.9435 16.7192 16.128 14.8352C16.2225 13.8797 16.317 12.9647 16.3875 12.2867L16.4175 12.0002H15C14.6022 12.0002 14.2206 11.8422 13.9393 11.5609C13.658 11.2796 13.5 10.898 13.5 10.5002V8.2502ZM17.9955 11.3297L17.964 11.6327C17.8468 12.7489 17.7328 13.8654 17.622 14.9822C17.4315 16.9127 17.25 18.9272 17.25 19.5002C17.25 19.898 17.408 20.2796 17.6893 20.5609C17.9706 20.8422 18.3522 21.0002 18.75 21.0002C19.1478 21.0002 19.5294 20.8422 19.8107 20.5609C20.092 20.2796 20.25 19.898 20.25 19.5002C20.25 18.9257 20.0685 16.9127 19.878 14.9822C19.768 13.8653 19.654 12.7488 19.536 11.6327L19.5045 11.3312L19.5 11.2502V3.0527C18.2503 3.23308 17.1074 3.85783 16.2809 4.81242C15.4544 5.76702 14.9997 6.98752 15 8.2502V10.5002H17.25C17.3552 10.5002 17.4592 10.5224 17.5552 10.5652C17.6513 10.6081 17.7372 10.6706 17.8075 10.7489C17.8779 10.8271 17.9309 10.9192 17.9633 11.0193C17.9957 11.1194 18.0066 11.2251 17.9955 11.3297Z" fill="black"/>
          </svg>
          <span class="header-text">{{ isEditMode ? ('ADMIN.MENU_MANAGEMENT.EDIT_CATEGORY_TITLE' | translate) : ('ADMIN.MENU_MANAGEMENT.ADD_CATEGORY_TITLE' | translate) }}</span>
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
        <form [formGroup]="categoryForm" (ngSubmit)="save(); $event.preventDefault()">
          <!-- Category Name in Arabic -->
          <div class="form-group">
            <div class="float-label-wrapper" [class.has-value]="categoryForm.get('name')?.value">
              <input 
                type="text" 
                class="form-input" 
                [class.error]="categoryForm.get('name')?.invalid && categoryForm.get('name')?.touched"
                formControlName="name"
                [placeholder]="getPlaceholder('ADMIN.MENU_MANAGEMENT.CATEGORY_NAME_AR' | translate)"
                id="name" />
              <label for="name">{{ 'ADMIN.MENU_MANAGEMENT.CATEGORY_NAME_AR' | translate }}<span class="required-asterisk">*</span></label>
            </div>
            <span class="error-message" *ngIf="categoryForm.get('name')?.hasError('required') && categoryForm.get('name')?.touched">
              {{ 'ADMIN.MENU_MANAGEMENT.CATEGORY_NAME_AR_REQUIRED' | translate }}
            </span>
            <span class="error-message" *ngIf="categoryForm.get('name')?.hasError('arabicOnly') && categoryForm.get('name')?.touched">
              {{ 'ADMIN.MENU_MANAGEMENT.ARABIC_ONLY' | translate }}
            </span>
          </div>

          <!-- Category Name in English -->
          <div class="form-group">
            <div class="float-label-wrapper" [class.has-value]="categoryForm.get('nameEn')?.value">
              <input 
                type="text" 
                class="form-input" 
                [class.error]="categoryForm.get('nameEn')?.invalid && categoryForm.get('nameEn')?.touched"
                formControlName="nameEn"
                [placeholder]="getPlaceholder('ADMIN.MENU_MANAGEMENT.CATEGORY_NAME_EN' | translate)"
                id="nameEn" />
              <label for="nameEn">{{ 'ADMIN.MENU_MANAGEMENT.CATEGORY_NAME_EN' | translate }}<span class="required-asterisk">*</span></label>
            </div>
            <span class="error-message" *ngIf="categoryForm.get('nameEn')?.hasError('required') && categoryForm.get('nameEn')?.touched">
              {{ 'ADMIN.MENU_MANAGEMENT.CATEGORY_NAME_EN_REQUIRED' | translate }}
            </span>
            <span class="error-message" *ngIf="categoryForm.get('nameEn')?.hasError('arabicOrEnglish') && categoryForm.get('nameEn')?.touched">
              {{ 'ADMIN.MENU_MANAGEMENT.ARABIC_OR_ENGLISH' | translate }}
            </span>
          </div>

          <!-- Description in Arabic -->
          <div class="form-group">
            <div class="float-label-wrapper" [class.has-value]="categoryForm.get('description')?.value">
              <textarea 
                class="form-input form-textarea" 
                [class.error]="categoryForm.get('description')?.invalid && categoryForm.get('description')?.touched"
                formControlName="description"
                [placeholder]="getPlaceholder('ADMIN.MENU_MANAGEMENT.DESCRIPTION_AR' | translate)"
                id="description"
                rows="3"></textarea>
              <label for="description">{{ 'ADMIN.MENU_MANAGEMENT.DESCRIPTION_AR' | translate }}</label>
            </div>
            <span class="error-message" *ngIf="categoryForm.get('description')?.hasError('arabicOnly') && categoryForm.get('description')?.touched">
              {{ 'ADMIN.MENU_MANAGEMENT.ARABIC_ONLY' | translate }}
            </span>
          </div>

          <!-- Description in English -->
          <div class="form-group">
            <div class="float-label-wrapper" [class.has-value]="categoryForm.get('descriptionEn')?.value">
              <textarea 
                class="form-input form-textarea" 
                [class.error]="categoryForm.get('descriptionEn')?.invalid && categoryForm.get('descriptionEn')?.touched"
                formControlName="descriptionEn"
                [placeholder]="getPlaceholder('ADMIN.MENU_MANAGEMENT.DESCRIPTION_EN' | translate)"
                id="descriptionEn"
                rows="3"></textarea>
              <label for="descriptionEn">{{ 'ADMIN.MENU_MANAGEMENT.DESCRIPTION_EN' | translate }}</label>
            </div>
            <span class="error-message" *ngIf="categoryForm.get('descriptionEn')?.hasError('arabicOrEnglish') && categoryForm.get('descriptionEn')?.touched">
              {{ 'ADMIN.MENU_MANAGEMENT.ARABIC_OR_ENGLISH' | translate }}
            </span>
          </div>


          <!-- Status Selection -->
          <div class="form-group status-section">
            <label class="status-label">{{ 'ADMIN.MENU_MANAGEMENT.STATUS' | translate }}<span class="required-asterisk">*</span></label>
            <div class="radio-group">
              <label class="radio-option">
                <input type="radio" formControlName="status" [value]="true" />
                <span class="radio-label">{{ 'ADMIN.MENU_MANAGEMENT.ACTIVE' | translate }}</span>
              </label>
              <label class="radio-option">
                <input type="radio" formControlName="status" [value]="false" />
                <span class="radio-label">{{ 'ADMIN.MENU_MANAGEMENT.INACTIVE' | translate }}</span>
              </label>
            </div>
          </div>

        <!-- Main Category Image Upload -->
        <div class="form-group">
          <label class="section-label">{{ 'ADMIN.MENU_MANAGEMENT.MAIN_IMAGE' | translate }}<span class="required-asterisk">*</span></label>
          <div class="image-upload-area" (click)="triggerMainFileInput()">
            <input 
              type="file" 
              #mainFileInput
              id="mainFileInput"
              accept="image/*" 
              (change)="onMainFileSelected($event)"
              style="display: none;" />
            <div class="upload-content" *ngIf="!selectedImage">
              <svg class="camera-icon" width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 18C20.6863 18 18 20.6863 18 24C18 27.3137 20.6863 30 24 30C27.3137 30 30 27.3137 30 24C30 20.6863 27.3137 18 24 18ZM24 28C21.7909 28 20 26.2091 20 24C20 21.7909 21.7909 20 24 20C26.2091 20 28 21.7909 28 24C28 26.2091 26.2091 28 24 28Z" fill="#ADB5BD"/>
                <path d="M16 10H14C12.8954 10 12 10.8954 12 12V14H8C5.79086 14 4 15.7909 4 18V36C4 38.2091 5.79086 40 8 40H40C42.2091 40 44 38.2091 44 36V18C44 15.7909 42.2091 14 40 14H36V12C36 10.8954 35.1046 10 34 10H32C30.8954 10 30 10.8954 30 12V14H18V12C18 10.8954 17.1046 10 16 10ZM40 36H8V18H40V36ZM24 16C28.4183 16 32 19.5817 32 24C32 28.4183 28.4183 32 24 32C19.5817 32 16 28.4183 16 24C16 19.5817 19.5817 16 24 16Z" fill="#ADB5BD"/>
              </svg>
              <svg class="plus-overlay" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 3V13M3 8H13" stroke="#ADB5BD" stroke-width="2" stroke-linecap="round"/>
              </svg>
              <span class="upload-text">{{ 'ADMIN.MENU_MANAGEMENT.CATEGORY_IMAGE' | translate }}</span>
            </div>
            <img *ngIf="selectedImage" [src]="selectedImage" alt="Category" class="preview-image" />
          </div>
        </div>

        <!-- Additional Images Section -->
        <div class="form-group">
          <label class="section-label">{{ 'ADMIN.MENU_MANAGEMENT.ADDITIONAL_IMAGES' | translate }}</label>
          <div class="additional-images-container">
            <!-- Existing Images (Edit Mode) -->
            <div *ngFor="let image of additionalImages" class="image-thumbnail">
              <img [src]="image.imageUrl" [alt]="'Image ' + image.id" />
              <button type="button" class="delete-image-btn" (click)="deleteAdditionalImage(image.id)" [disabled]="isDeletingImage === image.id">
                <svg *ngIf="isDeletingImage !== image.id" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 10H15" stroke="#F00E0C" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <span *ngIf="isDeletingImage === image.id" class="spinner"></span>
              </button>
            </div>
            <!-- Uploading Images -->
            <div *ngFor="let upload of uploadingImages" class="image-thumbnail uploading">
              <img [src]="upload.preview" alt="Uploading" />
              <div class="upload-overlay">
                <span class="spinner"></span>
              </div>
            </div>
          </div>
          <button type="button" class="add-image-btn" (click)="triggerAdditionalFileInput()" [disabled]="isLoading">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 5V15M5 10H15" stroke="#F00E0C" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span>{{ 'ADMIN.MENU_MANAGEMENT.ADD_IMAGE' | translate }}</span>
          </button>
          <input 
            type="file" 
            #additionalFileInput
            id="additionalFileInput"
            accept="image/*" 
            multiple
            (change)="onAdditionalFilesSelected($event)"
            style="display: none;" />
        </div>

          <!-- Save Button -->
          <div class="save-btn-container">
            <button type="submit" class="save-btn" [disabled]="!isFormValid() || isLoading">
              <span *ngIf="isLoading">{{ 'ADMIN.MENU_MANAGEMENT.SAVING' | translate }}</span>
              <span *ngIf="!isLoading">{{ isEditMode ? ('ADMIN.MENU_MANAGEMENT.UPDATE' | translate) : ('ADMIN.MENU_MANAGEMENT.SAVE' | translate) }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
    
  `,
  styles: [`
    .add-category-dialog-container {
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
    }

    .radio-label {
      font-family: Alexandria;
      font-weight: 400;
      font-style: normal;
      font-size: 14px;
      line-height: 100%;
      letter-spacing: 0%;
      text-align: right;
      color: #000;
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

    .additional-images-container {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .image-thumbnail {
      position: relative;
      width: 120px;
      height: 120px;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid #E7EAEB;
      background: white;
    }

    .image-thumbnail img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .image-thumbnail.uploading {
      opacity: 0.7;
    }

    .delete-image-btn {
      position: absolute;
      top: 4px;
      left: 4px;
      width: 28px;
      height: 28px;
      background: white;
      border: 1px solid #F00E0C;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background 0.3s;
    }

    .delete-image-btn:hover:not(:disabled) {
      background: #FFF6F6;
    }

    .delete-image-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .upload-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .spinner {
      width: 20px;
      height: 20px;
      border: 2px solid #F00E0C;
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .add-image-btn {
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

    .add-image-btn:hover:not(:disabled) {
      background: #FFF6F6;
    }

    .add-image-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
})
export class AddCategoryDialogComponent implements OnDestroy {
  categoryForm: FormGroup;
  selectedImage: string | null = null;
  isEditMode: boolean = false;
  categoryId: number | null = null;
  additionalImages: CategoryImage[] = [];
  uploadingImages: Array<{ preview: string; file: File }> = [];
  queuedImages: Array<{ preview: string; file: File }> = [];
  isDeletingImage: number | null = null;
  isLoading: boolean = false;
  private saveSubscription?: Subscription;

  @ViewChild('mainFileInput') mainFileInputRef!: any;
  @ViewChild('additionalFileInput') additionalFileInputRef!: any;

  constructor(
    private dialogRef: MatDialogRef<AddCategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private messageService: MessageService,
    private translate: TranslateService
  ) {
    this.isEditMode = data?.isEdit || false;
    const category = data?.category;

    console.log(category);

    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, this.arabicOnlyValidator.bind(this)]],
      nameEn: ['', [Validators.required, this.arabicOrEnglishValidator.bind(this)]],
      description: ['', [this.arabicOnlyValidator.bind(this)]],
      descriptionEn: ['', [this.arabicOrEnglishValidator.bind(this)]],
      status: [true, Validators.required]
    });

    // If editing, populate the form with existing category data
    if (this.isEditMode && category) {
      this.categoryId = typeof category.id === 'string' ? parseInt(category.id) : category.id;
      // Handle both BackendCategory (with nameAr) and Category (with name) formats
      const nameAr = (category as any).nameAr || (category as any).name || '';
      const nameEn = (category as any).nameEn || '';
      const descriptionAr = (category as any).descriptionAr || (category as any).description || '';
      const descriptionEn = (category as any).descriptionEn || '';
      const isActive = (category as any).isActive !== undefined ? (category as any).isActive : true;

      console.log('Editing category - received data:', category);
      console.log('Mapped values:', { nameAr, nameEn, descriptionAr, descriptionEn, isActive, imageUrl: category.imageUrl });

      this.categoryForm.patchValue({
        name: nameAr,
        nameEn: nameEn,
        description: descriptionAr,
        descriptionEn: descriptionEn,
        status: isActive
      });
      this.selectedImage = category.imageUrl || null;

      // Mark form as touched to show validation errors if any
      this.categoryForm.markAllAsTouched();

      // Load additional images if they exist
      if (category.images && category.images.length > 0) {
        // Filter out the main image (if isMain is true, it's already shown in selectedImage)
        this.additionalImages = category.images.filter((img: CategoryImage) => !img.isMain);
        // Sort by sortOrder
        this.additionalImages.sort((a, b) => a.sortOrder - b.sortOrder);
      }
    }
  }

  triggerMainFileInput(): void {
    if (this.mainFileInputRef?.nativeElement) {
      this.mainFileInputRef.nativeElement.click();
    }
  }

  onMainFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (!file.type.startsWith('image/')) {
        this.messageService.add({
          severity: 'error',
          summary: this.translate.instant('ADMIN.MENU_MANAGEMENT.ERROR_SAVING'),
          detail: this.translate.instant('ADMIN.MENU_MANAGEMENT.INVALID_IMAGE'),
          life: 3000
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImage = e.target.result;
      };
      reader.readAsDataURL(file);
      // Reset input to allow selecting the same file again
      input.value = '';
    }
  }

  triggerAdditionalFileInput(): void {
    if (this.additionalFileInputRef?.nativeElement) {
      this.additionalFileInputRef.nativeElement.click();
    }
  }

  onAdditionalFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const files = Array.from(input.files);
      const invalidFiles = files.filter(file => !file.type.startsWith('image/'));

      if (invalidFiles.length > 0) {
        this.messageService.add({
          severity: 'error',
          summary: this.translate.instant('ADMIN.MENU_MANAGEMENT.ERROR_SAVING'),
          detail: this.translate.instant('ADMIN.MENU_MANAGEMENT.INVALID_IMAGES'),
          life: 3000
        });
        input.value = '';
        return;
      }

      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const preview = e.target.result;

          if (this.isEditMode && this.categoryId) {
            // Upload immediately in edit mode
            this.uploadImageImmediately(file, preview);
          } else {
            // Queue for upload after creation
            this.queuedImages.push({ preview, file });
          }
        };
        reader.readAsDataURL(file);
      });

      // Reset input
      input.value = '';
    }
  }

  uploadImageImmediately(file: File, preview: string): void {
    if (!this.categoryId) return;

    // Add to uploading list
    this.uploadingImages.push({ preview, file });

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const imageBase64 = e.target.result as string;
      const request: AddImageRequest = {
        imageBase64,
        isMain: false,
        sortOrder: this.additionalImages.length + this.uploadingImages.length
      };

      this.categoryService.addCategoryImage(this.categoryId!, request).subscribe({
        next: (image) => {
          // Remove from uploading
          this.uploadingImages = this.uploadingImages.filter(u => u.preview !== preview);
          // Add to additional images
          this.additionalImages.push(image);
          // Sort by sortOrder
          this.additionalImages.sort((a, b) => a.sortOrder - b.sortOrder);

          this.messageService.add({
            severity: 'success',
            summary: this.translate.instant('ADMIN.MENU_MANAGEMENT.CATEGORY_SAVED'),
            detail: this.translate.instant('ADMIN.MENU_MANAGEMENT.IMAGE_ADDED'),
            life: 3000
          });
        },
        error: (error) => {
          // Remove from uploading on error
          this.uploadingImages = this.uploadingImages.filter(u => u.preview !== preview);
          console.error('Error uploading image:', error);
          const errorMessage = error?.error?.message || error?.message || this.translate.instant('ADMIN.MENU_MANAGEMENT.ERROR_UPLOADING_IMAGE');
          this.messageService.add({
            severity: 'error',
            summary: this.translate.instant('ADMIN.MENU_MANAGEMENT.ERROR_SAVING'),
            detail: errorMessage,
            life: 5000
          });
        }
      });
    };
    reader.readAsDataURL(file);
  }

  deleteAdditionalImage(imageId: number): void {
    if (!this.categoryId || this.isDeletingImage === imageId) return;

    this.isDeletingImage = imageId;
    this.categoryService.deleteCategoryImage(this.categoryId, imageId).subscribe({
      next: () => {
        this.additionalImages = this.additionalImages.filter(img => img.id !== imageId);
        this.isDeletingImage = null;
        this.messageService.add({
          severity: 'success',
          summary: this.translate.instant('ADMIN.MENU_MANAGEMENT.CATEGORY_SAVED'),
          detail: this.translate.instant('ADMIN.MENU_MANAGEMENT.IMAGE_DELETED'),
          life: 3000
        });
      },
      error: (error) => {
        this.isDeletingImage = null;
        console.error('Error deleting image:', error);
        const errorMessage = error?.error?.message || error?.message || this.translate.instant('ADMIN.MENU_MANAGEMENT.ERROR_DELETING_IMAGE');
        this.messageService.add({
          severity: 'error',
          summary: this.translate.instant('ADMIN.MENU_MANAGEMENT.ERROR_SAVING'),
          detail: errorMessage,
          life: 5000
        });
      }
    });
  }

  isFormValid(): boolean {
    return this.categoryForm.valid && !!this.selectedImage;
  }

  save(): void {
    if (this.isFormValid() && !this.isLoading) {
      this.isLoading = true;
      const formValue = this.categoryForm.value;

      // Ensure all required fields have values (trim and validate)
      const nameAr = (formValue.name || '').trim();
      const nameEn = (formValue.nameEn || '').trim();
      const descriptionAr = (formValue.description || '').trim();
      const descriptionEn = (formValue.descriptionEn || '').trim();
      const imageUrl = (this.selectedImage || '').trim();

      // Validate required fields
      if (!nameAr) {
        this.messageService.add({
          severity: 'error',
          summary: this.translate.instant('ADMIN.MENU_MANAGEMENT.ERROR_SAVING'),
          detail: this.translate.instant('ADMIN.MENU_MANAGEMENT.CATEGORY_NAME_AR_REQUIRED'),
          life: 3000
        });
        this.isLoading = false;
        return;
      }

      if (!nameEn) {
        this.messageService.add({
          severity: 'error',
          summary: this.translate.instant('ADMIN.MENU_MANAGEMENT.ERROR_SAVING'),
          detail: this.translate.instant('ADMIN.MENU_MANAGEMENT.CATEGORY_NAME_EN_REQUIRED'),
          life: 3000
        });
        this.isLoading = false;
        return;
      }

      if (!imageUrl) {
        this.messageService.add({
          severity: 'error',
          summary: this.translate.instant('ADMIN.MENU_MANAGEMENT.ERROR_SAVING'),
          detail: this.translate.instant('ADMIN.MENU_MANAGEMENT.IMAGE_REQUIRED'),
          life: 3000
        });
        this.isLoading = false;
        return;
      }

      // Prepare category data
      const categoryData: CreateCategoryRequest = {
        nameAr: nameAr,
        nameEn: nameEn,
        descriptionAr: descriptionAr || '', // Empty string if not provided
        descriptionEn: descriptionEn || '', // Empty string if not provided
        imageUrl: imageUrl,
        isActive: formValue.status === true || formValue.status === 'true'
      };

      // Debug: Log the data being sent
      console.log('Sending category data:', categoryData);

      // Prevent duplicate calls - unsubscribe previous subscription if exists
      if (this.saveSubscription) {
        this.saveSubscription.unsubscribe();
      }

      const apiCall = this.isEditMode && this.categoryId
        ? this.categoryService.updateCategory(this.categoryId, categoryData)
        : this.categoryService.createCategory(categoryData);

      this.saveSubscription = apiCall.subscribe({
        next: (category) => {
          // In create mode, upload queued images
          if (!this.isEditMode && this.queuedImages.length > 0) {
            this.uploadQueuedImages(category.id);
          } else {
            this.isLoading = false;
            this.messageService.add({
              severity: 'success',
              summary: this.translate.instant('ADMIN.MENU_MANAGEMENT.CATEGORY_SAVED'),
              detail: this.isEditMode ? this.translate.instant('ADMIN.MENU_MANAGEMENT.CATEGORY_UPDATED') : this.translate.instant('ADMIN.MENU_MANAGEMENT.CATEGORY_ADDED'),
              life: 3000
            });
            this.dialogRef.close({ success: true, category });
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error saving category:', error);
          console.error('Error details:', error?.error);
          console.error('Request data that was sent:', categoryData);

          // Show detailed error messages if available
          let errorMessage = error?.error?.message || error?.message || 'حدث خطأ أثناء حفظ الصنف';
          if (error?.error?.errors && Array.isArray(error.error.errors)) {
            errorMessage = error.error.errors.join(', ');
          }

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

  uploadQueuedImages(categoryId: number): void {
    if (this.queuedImages.length === 0) {
      this.isLoading = false;
      this.messageService.add({
        severity: 'success',
        summary: this.translate.instant('ADMIN.MENU_MANAGEMENT.CATEGORY_SAVED'),
        detail: this.translate.instant('ADMIN.MENU_MANAGEMENT.CATEGORY_ADDED'),
        life: 3000
      });
      this.dialogRef.close({ success: true });
      return;
    }

    // Move queued images to uploading
    this.uploadingImages = [...this.queuedImages];
    const imagesToUpload = [...this.queuedImages];
    this.queuedImages = [];

    // Upload each image sequentially
    let uploadIndex = 0;
    const uploadNext = () => {
      if (uploadIndex >= imagesToUpload.length) {
        // All images uploaded
        this.isLoading = false;
        this.uploadingImages = [];
        this.messageService.add({
          severity: 'success',
          summary: this.translate.instant('ADMIN.MENU_MANAGEMENT.CATEGORY_SAVED'),
          detail: this.translate.instant('ADMIN.MENU_MANAGEMENT.CATEGORY_ADDED'),
          life: 3000
        });
        this.dialogRef.close({ success: true });
        return;
      }

      const { file, preview } = imagesToUpload[uploadIndex];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const imageBase64 = e.target.result as string;
        const request: AddImageRequest = {
          imageBase64,
          isMain: false,
          sortOrder: uploadIndex
        };

        this.categoryService.addCategoryImage(categoryId, request).subscribe({
          next: () => {
            uploadIndex++;
            // Remove from uploading
            this.uploadingImages = this.uploadingImages.filter(u => u.preview !== preview);
            uploadNext();
          },
          error: (error) => {
            // Remove from uploading on error
            this.uploadingImages = this.uploadingImages.filter(u => u.preview !== preview);
            console.error('Error uploading queued image:', error);
            // Continue with next image even if this one fails
            uploadIndex++;
            uploadNext();
          }
        });
      };
      reader.readAsDataURL(file);
    };

    uploadNext();
  }

  close(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks and duplicate calls
    if (this.saveSubscription) {
      this.saveSubscription.unsubscribe();
    }
  }

  getPlaceholder(text: string): string {
    return `${text} *`;
  }

  // Custom validator for Arabic-only text
  arabicOnlyValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value || control.value.trim() === '') {
      return null; // Let required validator handle empty values
    }

    // Arabic Unicode range: \u0600-\u06FF
    // Also allow common Arabic punctuation and numbers
    const arabicPattern = /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\s\d\.,;:!?()\-]+$/;

    if (!arabicPattern.test(control.value)) {
      return { arabicOnly: true };
    }

    return null;
  }

  // Custom validator for Arabic or English text
  arabicOrEnglishValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value || control.value.trim() === '') {
      return null; // Let required validator handle empty values
    }

    // Arabic Unicode range: \u0600-\u06FF
    // English: A-Z, a-z
    // Also allow common punctuation and numbers
    const arabicEnglishPattern = /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFFA-Za-z\s\d\.,;:!?()\-]+$/;

    if (!arabicEnglishPattern.test(control.value)) {
      return { arabicOrEnglish: true };
    }

    return null;
  }
}

