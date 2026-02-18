import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-help-center',
  standalone: true,
  imports: [CommonModule, SharedModule, TranslateModule, RouterModule],
  template: `
    <div class="help-center-container">
      <div class="help-center-content">
        <!-- Breadcrumb Navigation -->
        <nav class="breadcrumb-nav">
          <a routerLink="/" class="breadcrumb-link">الرئيسية</a>
          <span class="breadcrumb-separator"> > </span>
          <span class="breadcrumb-current">مركز المساعده</span>
        </nav>

        <!-- Main Title -->
        <h1 class="help-center-title">مركز المساعده</h1>

        <!-- Contact Information -->
        <div class="contact-section">
          <p class="contact-intro">
            لاستفسارات أو الشكاوى تواصل مع خدمة العملاء عبر الخط الساخن 00000
          </p>

          <!-- Phone Numbers List -->
          <ul class="phone-list">
            <li class="phone-item">
              <svg class="phone-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15.46l-5.27-.61-2.52 2.52a15.045 15.045 0 01-6.59-6.59l2.53-2.53L8.54 3H3.03C2.45 13.18 10.82 21.55 21 20.97v-5.51z" fill="#000000"/>
              </svg>
              <span class="phone-number">399 90589</span>
            </li>
            <li class="phone-item">
              <svg class="phone-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15.46l-5.27-.61-2.52 2.52a15.045 15.045 0 01-6.59-6.59l2.53-2.53L8.54 3H3.03C2.45 13.18 10.82 21.55 21 20.97v-5.51z" fill="#000000"/>
              </svg>
              <span class="phone-number">399 90589</span>
            </li>
            <li class="phone-item">
              <svg class="phone-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15.46l-5.27-.61-2.52 2.52a15.045 15.045 0 01-6.59-6.59l2.53-2.53L8.54 3H3.03C2.45 13.18 10.82 21.55 21 20.97v-5.51z" fill="#000000"/>
              </svg>
              <span class="phone-number">399 90589</span>
            </li>
            <li class="phone-item">
              <svg class="phone-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15.46l-5.27-.61-2.52 2.52a15.045 15.045 0 01-6.59-6.59l2.53-2.53L8.54 3H3.03C2.45 13.18 10.82 21.55 21 20.97v-5.51z" fill="#000000"/>
              </svg>
              <span class="phone-number">399 90589</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .help-center-container {
      width: 100%;
      min-height: calc(100vh - 400px);
      background-color: #FFFFFF;
      padding: 40px 20px;
      direction: rtl;
    }

    .help-center-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    /* Breadcrumb Navigation */
    .breadcrumb-nav {
      display: flex;
      align-items: center;
      margin-bottom: 30px;
      font-family: 'Almarai', sans-serif;
      font-size: 14px;
    }

    .breadcrumb-link {
      color: #000000;
      text-decoration: none;
      transition: color 0.3s;
    }

    .breadcrumb-link:hover {
      color: #DC2626;
    }

    .breadcrumb-separator {
      color: #000000;
      margin: 0 8px;
    }

    .breadcrumb-current {
      color: #000000;
    }

    /* Main Title */
    .help-center-title {
      font-family: 'Almarai', sans-serif;
      font-weight: 700;
      font-size: 48px;
      color: #DC2626;
      text-align: center;
      margin: 30px 0 40px 0;
      line-height: 1.2;
    }

    /* Contact Section */
    .contact-section {
      margin-top: 40px;
    }

    .contact-intro {
      font-family: 'Almarai', sans-serif;
      font-weight: 400;
      font-size: 18px;
      color: #000000;
      text-align: right;
      line-height: 1.8;
      margin-bottom: 30px;
      padding: 0 20px;
    }

    /* Phone List */
    .phone-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 15px;
      align-items: flex-start;
    }

    .phone-item {
      display: flex;
      align-items: center;
      gap: 12px;
      font-family: 'Almarai', sans-serif;
      font-size: 18px;
      color: #000000;
    }

    .phone-icon {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }

    .phone-number {
      font-weight: 400;
      font-size: 18px;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .help-center-container {
        padding: 20px 10px;
      }

      .help-center-content {
        padding: 10px;
      }

      .help-center-title {
        font-size: 32px;
        margin: 20px 0 30px 0;
      }

      .contact-intro {
        font-size: 16px;
        padding: 0 10px;
      }

      .phone-item {
        font-size: 16px;
      }

      .phone-number {
        font-size: 16px;
      }

      .breadcrumb-nav {
        font-size: 12px;
      }
    }

    @media (max-width: 480px) {
      .help-center-title {
        font-size: 28px;
      }

      .contact-intro {
        font-size: 14px;
      }

      .phone-item {
        font-size: 14px;
      }

      .phone-number {
        font-size: 14px;
      }

      .phone-icon {
        width: 18px;
        height: 18px;
      }
    }
  `]
})
export class HelpCenterComponent { }

