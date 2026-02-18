import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, SharedModule, TranslateModule, RouterModule],
  template: `
    <div class="about-container">
      <!-- Breadcrumb Navigation -->
      <nav class="breadcrumb-nav">
        <a routerLink="/" class="breadcrumb-link">الرئيسية</a>
        <span class="breadcrumb-separator"> > </span>
        <span class="breadcrumb-current">من نحن</span>
      </nav>

      <!-- Header Banner Section -->
      <section class="banner-section">
        <img src="assets/BashwatAbout.png" alt="Al Bashawat Restaurant" class="banner-image" />
        <div class="banner-overlay">
          <h1 class="banner-title">من نحن</h1>
        </div>
      </section>

      <!-- About Us Section -->
      <section class="about-section">
        <h2 class="section-title">الباشوات</h2>
        <div class="about-content">
          <p class="about-text">
            منذ عام 1995 في الدوحة، بدأت رحلة الباشوات نحو النجاح والتميز في عالم المطاعم. 
            نحن ملتزمون بتقديم أجود أنواع المأكولات الشرقية والمصرية الأصيلة، مع التركيز على 
            الجودة والطعم الأصيل في كل وجبة نقدمها.
          </p>
          <p class="about-text">
            هدفنا هو أن نكون الخيار الأول لعائلاتكم في المناسبات والجمعات العائلية. نقدم قائمة 
            متنوعة من الأطباق الشهية، مع استخدامنا لأجود المكونات الطازجة والعروض الخاصة التي 
            تناسب جميع الأذواق.
          </p>
          <p class="about-text">
            نحرص على أدق التفاصيل في التحضير والتقديم، لنضمن لكم تجربة طعام لا تُنسى. 
            البشوات.. طعم يليق بالمقام.
          </p>
        </div>
      </section>

      <!-- Values Section -->
      <section class="values-section">
        <h2 class="section-title">قيمنا</h2>
        <div class="values-grid">
          <div class="value-item">
            <div class="value-icon">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3 class="value-label">الجودة</h3>
          </div>
          <div class="value-item">
            <div class="value-icon">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M8 10C8 10 9 12 12 12C15 12 16 10 16 10" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M9 16H15" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3 class="value-label">الثقة</h3>
          </div>
          <div class="value-item">
            <div class="value-icon">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="6" width="16" height="12" rx="2" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M8 10H16" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M4 8L12 4L20 8" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M6 18H18" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3 class="value-label">الطعم</h3>
          </div>
        </div>
      </section>

      <!-- Our Goal Section -->
      <section class="goal-section">
        <div class="goal-content-wrapper">
          <div class="goal-image-wrapper">
            <img src="assets/BashwatFood.png" alt="Our Food" class="goal-image" />
          </div>
          <div class="goal-text-wrapper">
            <h2 class="section-title">هدفنا</h2>
            <p class="goal-text">
              تقديم أجود أنواع المأكولات الشرقية والمصرية الأصيلة، ولكل مطبخ أصل والباشوات أصل الأكل الشرقي في قطر. 
              اهتمامنا بأدق التفاصيل لنقدم لكم تجربة بطابع شرقي أصيل من أول الفطار إلى الوجبات الغداء والعشاء، 
              وضمان في كل عزائمك ومناسباتك.
            </p>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .about-container {
      width: 100%;
      min-height: calc(100vh - 400px);
      background-color: #FFFFFF;
      direction: rtl;
    }

    /* Breadcrumb Navigation */
    .breadcrumb-nav {
      display: flex;
      align-items: center;
      padding: 20px 40px;
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

    /* Banner Section */
    .banner-section {
      position: relative;
      width: 100%;
      height: 400px;
      overflow: hidden;
      margin-bottom: 60px;
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
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.3);
    }

    .banner-title {
      font-family: 'Almarai', sans-serif;
      font-weight: 700;
      font-size: 64px;
      color: #FFFFFF;
      text-align: center;
      background: rgba(255, 255, 255, 0.9);
      padding: 20px 60px;
      border-radius: 10px;
    }

    /* About Section */
    .about-section {
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 60px;
      margin-bottom: 60px;
    }

    .section-title {
      font-family: 'Almarai', sans-serif;
      font-weight: 700;
      font-size: 48px;
      color: #DC2626;
      text-align: right;
      margin-bottom: 30px;
    }

    .about-content {
      text-align: right;
    }

    .about-text {
      font-family: 'Almarai', sans-serif;
      font-weight: 400;
      font-size: 18px;
      color: #000000;
      line-height: 1.8;
      margin-bottom: 20px;
      text-align: justify;
    }

    /* Values Section */
    .values-section {
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 60px;
      margin-bottom: 60px;
    }

    .values-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 60px;
      margin-top: 40px;
    }

    .value-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
    }

    .value-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 120px;
      height: 120px;
    }

    .value-icon svg {
      width: 100%;
      height: 100%;
    }

    .value-label {
      font-family: 'Almarai', sans-serif;
      font-weight: 400;
      font-size: 24px;
      color: #000000;
      text-align: center;
      margin: 0;
    }

    /* Goal Section */
    .goal-section {
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 60px;
      margin-bottom: 60px;
    }

    .goal-content-wrapper {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      align-items: center;
    }

    .goal-image-wrapper {
      width: 100%;
      height: 100%;
      overflow: hidden;
      border-radius: 15px;
    }

    .goal-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 15px;
    }

    .goal-text-wrapper {
      padding: 20px;
    }

    .goal-text {
      font-family: 'Almarai', sans-serif;
      font-weight: 400;
      font-size: 18px;
      color: #000000;
      line-height: 1.8;
      text-align: justify;
      margin-top: 20px;
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
      .banner-title {
        font-size: 48px;
        padding: 15px 40px;
      }

      .section-title {
        font-size: 36px;
      }

      .about-section,
      .values-section,
      .goal-section {
        padding: 30px 40px;
      }

      .goal-content-wrapper {
        grid-template-columns: 1fr;
      }

      .goal-image-wrapper {
        order: 2;
      }

      .goal-text-wrapper {
        order: 1;
      }
    }

    @media (max-width: 768px) {
      .breadcrumb-nav {
        padding: 15px 20px;
        font-size: 12px;
      }

      .banner-section {
        height: 300px;
        margin-bottom: 40px;
      }

      .banner-title {
        font-size: 32px;
        padding: 12px 30px;
      }

      .section-title {
        font-size: 28px;
        margin-bottom: 20px;
      }

      .about-section,
      .values-section,
      .goal-section {
        padding: 20px 20px;
        margin-bottom: 40px;
      }

      .about-text,
      .goal-text {
        font-size: 16px;
      }

      .values-grid {
        grid-template-columns: 1fr;
        gap: 40px;
      }

      .value-icon {
        width: 100px;
        height: 100px;
      }

      .value-label {
        font-size: 20px;
      }
    }

    @media (max-width: 480px) {
      .banner-section {
        height: 250px;
      }

      .banner-title {
        font-size: 24px;
        padding: 10px 20px;
      }

      .section-title {
        font-size: 24px;
      }

      .about-text,
      .goal-text {
        font-size: 14px;
      }
    }
  `]
})
export class AboutComponent {}

