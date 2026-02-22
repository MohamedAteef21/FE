import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [CommonModule, SharedModule, TranslateModule, RouterModule],
  template: `
    <div class="privacy-policy-container">
      <div class="privacy-policy-content">
        <!-- Breadcrumb Navigation -->
        <nav class="breadcrumb-nav">
          <a routerLink="/" class="breadcrumb-link">{{ "ITEM_DETAILS.HOME" | translate }}</a>
          <span class="breadcrumb-separator"> > </span>
          <span class="breadcrumb-current">{{ "FOOTER.PRIVACY_POLICY" | translate }}</span>
        </nav>

        <!-- Main Title -->
        <h1 class="privacy-policy-title">سياسة الخصوصية</h1>

        <!-- Introduction Paragraph -->
        <p class="privacy-intro">
          يمكنك التأكد من أمان وسرية بياناتك الشخصية التي تقدمها لموقع مطعم البشوات - قطر، حيث نضمن سريتها التامة وعدم مشاركتها مع أي طرف آخر إلا في حال طلبت الجهات الحكومية ذلك وفقًا للقانون.
        </p>

        <!-- Intellectual Property Rights Section -->
        <section class="privacy-section">
          <h2 class="section-title">حقوق الملكية الفكرية والعلامات التجارية</h2>
          <p class="section-paragraph">
            جميع محتويات هذا الموقع بما في ذلك النصوص والرسوم والصور والشعارات والأزرار والأيقونات والصور ومقاطع الصوت والفيديو وتصاميم القوائم وقواعد البيانات والبرمجيات هي ملك حصري لمطعم البشوات في قطر. لا يجوز نسخ أو إعادة إنتاج أو استخدام أي من هذه المحتويات دون الحصول على موافقة خطية مسبقة من مطعم البشوات.
          </p>
          <p class="section-paragraph">
            جميع العلامات التجارية والشعارات وعلامات الخدمة المعروضة على هذا الموقع هي ملك لمطعم البشوات أو أصحابها الشرعيين وهي محمية بموجب قوانين قطر والدولية. لا يجوز استخدام أو تعديل أو استغلال أي من هذه العلامات دون الحصول على إذن كتابي مسبق.
          </p>
          <p class="section-paragraph">
            يحظر أي شكل من أشكال الاستخدام غير المصرح به لمحتوى الموقع أو العلامات التجارية، بما في ذلك على سبيل المثال لا الحصر: النسخ، التوزيع، النقل، البث، العرض، التعديل، أو أي استخدام تجاري آخر.
          </p>
        </section>

        <!-- Content Section -->
        <section class="privacy-section">
          <h2 class="section-title">المحتوى</h2>
          <p class="section-paragraph">
            يشمل محتوى مطعم البشوات جميع الرسوم والصور (بما في ذلك حقوق الصور) والأصوات والموسيقى ومقاطع الفيديو والنصوص المنشورة على الموقع أو على منصات المطعم الرسمية.
          </p>
        </section>

        <!-- Third-Party Links and Cookies Section -->
        <section class="privacy-section">
          <h2 class="section-title">روابط الطرف الثالث وملفات تعريف الارتباط</h2>
          <p class="section-paragraph">
            يقوم الموقع بتخزين المعلومات الشخصية التي يدخلها المستخدم مثل الاسم والبريد الإلكتروني ورقم الهاتف لتسهيل التواصل ومعالجة الطلبات وتقديم الخدمات.
          </p>
          <p class="section-paragraph">
            لا يقوم الموقع بالكشف عن ملفات تعريف الارتباط الخاصة بالزوار لأطراف ثالثة، إلا في حالات الإجراءات القانونية الرسمية مثل أوامر المحكمة.
          </p>
          <p class="section-paragraph">
            يمكن للمستخدمين التحكم في إعدادات ملفات تعريف الارتباط من خلال متصفحهم، بما في ذلك رفضها أو تلقي إشعارات عند استخدامها.
          </p>
        </section>

        <!-- Policy Modification Section -->
        <section class="privacy-section">
          <h2 class="section-title">تعديل سياسة الخصوصية</h2>
          <p class="section-paragraph">
            يحتفظ مطعم البشوات - قطر بالحق في تعديل أو تحديث سياسة الخصوصية هذه من وقت لآخر دون إشعار مسبق. ويشكل الاستمرار في استخدام الموقع بعد نشر أي تعديلات موافقة ضمنية على تلك التغييرات.
          </p>
        </section>
      </div>
    </div>
  `,
  styles: [`
    .privacy-policy-container {
      width: 100%;
      min-height: calc(100vh - 400px);
      background-color: #FFFFFF;
      padding: 40px 20px;
      direction: rtl;
    }

    .privacy-policy-content {
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
    .privacy-policy-title {
      font-family: 'Almarai', sans-serif;
      font-weight: 700;
      font-size: 48px;
      color: #DC2626;
      text-align: center;
      margin: 30px 0 40px 0;
      line-height: 1.2;
      display: flex;
    }

    /* Introduction Paragraph */
    .privacy-intro {
      font-family: 'Almarai', sans-serif;
      font-weight: 400;
      font-size: 18px;
      color: #000000;
      text-align: justify;
      line-height: 1.8;
      margin-bottom: 40px;
      padding: 0 20px;
    }

    /* Section Styling */
    .privacy-section {
      margin-bottom: 40px;
    }

    .section-title {
      font-family: 'Almarai', sans-serif;
      font-weight: 700;
      font-size: 24px;
      color: #000000;
      margin-bottom: 20px;
      text-align: right;
    }

    .section-paragraph {
      font-family: 'Almarai', sans-serif;
      font-weight: 400;
      font-size: 16px;
      color: #000000;
      text-align: justify;
      line-height: 1.8;
      margin-bottom: 16px;
      padding: 0 20px;
    }

    .section-paragraph:last-child {
      margin-bottom: 0;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .privacy-policy-container {
        padding: 20px 10px;
      }

      .privacy-policy-content {
        padding: 10px;
      }

      .privacy-policy-title {
        font-size: 32px;
        margin: 20px 0 30px 0;
      }

      .privacy-intro {
        font-size: 16px;
        padding: 0 10px;
      }

      .section-title {
        font-size: 20px;
      }

      .section-paragraph {
        font-size: 14px;
        padding: 0 10px;
      }

      .breadcrumb-nav {
        font-size: 12px;
      }
    }

    @media (max-width: 480px) {
      .privacy-policy-title {
        font-size: 28px;
      }

      .privacy-intro {
        font-size: 14px;
      }

      .section-title {
        font-size: 18px;
      }

      .section-paragraph {
        font-size: 13px;
      }
    }
  `]
})
export class PrivacyPolicyComponent { }

