import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-shipping-policy',
  standalone: true,
  imports: [CommonModule, SharedModule, TranslateModule, RouterModule],
  template: `
    <div class="shipping-policy-container">
      <div class="shipping-policy-content">
        <!-- Breadcrumb Navigation -->
        <nav class="breadcrumb-nav">
          <a routerLink="/" class="breadcrumb-link">{{ "ITEM_DETAILS.HOME" | translate }}</a>
          <span class="breadcrumb-separator"> > </span>
          <span class="breadcrumb-current">{{ "FOOTER.SHIPPING_DELIVERY" | translate }}</span>
        </nav>

        <!-- Shipping Policy Section -->
        <section class="policy-section">
          <h2 class="section-title">سياسة الشحن</h2>
          
          <div class="policy-item">
            <h3 class="policy-subtitle">نطاق التوصيل</h3>
            <p class="policy-text">
              يقدم مطعم البشوات خدمة التوصيل ضمن نطاق تغطية فروع المطعم في قطر. يتم التأكد من توفر التوصيل تلقائياً عند إدخال عنوان التوصيل أثناء عملية الطلب.
            </p>
          </div>

          <div class="policy-item">
            <h3 class="policy-subtitle">وقت التوصيل</h3>
            <p class="policy-text">
              يتم عرض الوقت المقدر للتوصيل عند إتمام الطلب، وقد يختلف هذا الوقت بناءً على حجم الطلب، ظروف المرور، المسافة، أو أوقات الذروة والعطلات.
            </p>
          </div>

          <div class="policy-item">
            <h3 class="policy-subtitle">رسوم التوصيل</h3>
            <p class="policy-text">
              يتم حساب رسوم التوصيل تلقائياً بناءً على المنطقة والمسافة، ويتم عرضها بوضوح قبل تأكيد الدفع. قد تتأثر الرسوم بالعروض أو الكوبونات المتاحة.
            </p>
          </div>

          <div class="policy-item">
            <h3 class="policy-subtitle">عند الاستلام</h3>
            <p class="policy-text">
              يُنصح بالتحقق من مطابقة العناصر، سلامة التغليف، وأي عناصر إضافية. في حالة وجود أي ملاحظات، يرجى التواصل فوراً مع خدمة العملاء.
            </p>
          </div>

          <div class="policy-item">
            <h3 class="policy-subtitle">خدمة العملاء</h3>
            <p class="policy-text">
              يمكن للعملاء التواصل مع خدمة العملاء عبر الخط الساخن، نموذج الشكاوى على الموقع، أو الدردشة المباشرة.
            </p>
          </div>
        </section>

        <!-- Cancellation and Return Policy Section -->
        <section class="policy-section">
          <h2 class="section-title">سياسة الإلغاء والاسترجاع</h2>
          
          <div class="policy-item">
            <h3 class="policy-subtitle">الغاء الطلب</h3>
            <p class="policy-text">
              يمكن إلغاء الطلب فقط قبل بدء التحضير. بعد بدء التحضير، قد لا يكون الإلغاء ممكناً، أو قد يتم خصم رسوم معالجة.
            </p>
          </div>

          <div class="policy-item">
            <h3 class="policy-subtitle">حالات التعويض</h3>
            <ul class="policy-list">
              <li>استلام عنصر لا يطابق الطلب.</li>
              <li>عناصر مفقودة.</li>
              <li>تلف واضح أو مشكلة في الجودة عند الاستلام.</li>
              <li>خطأ في الدفع (مثل: شحن مزدوج).</li>
            </ul>
          </div>

          <div class="policy-item">
            <h3 class="policy-subtitle">مدة الإبلاغ</h3>
            <p class="policy-text">
              خلال 30 دقيقة من الاستلام، مع ذكر رقم الطلب. قد يُطلب إرفاق صور للتحقق.
            </p>
          </div>

          <div class="policy-item">
            <h3 class="policy-subtitle">آلية التعويض</h3>
            <p class="policy-text">
              قد يشمل التعويض إكمال العنصر المفقود، استبداله، أو استرداد قيمته بناءً على تقييم خدمة العملاء.
            </p>
          </div>

          <div class="policy-item">
            <h3 class="policy-subtitle">طريقة الاسترجاع حسب الدفع</h3>
            <div class="payment-method">
              <h4 class="payment-subtitle">الدفع الإلكتروني</h4>
              <p class="policy-text">
                يتم استرداد المبلغ إلى نفس طريقة الدفع وفقاً لإجراءات البنك.
              </p>
            </div>
            <div class="payment-method">
              <h4 class="payment-subtitle">الدفع نقدا</h4>
              <p class="policy-text">
                يتم تقديم التعويض نقداً أو عبر قسيمة/رصيد حسب الاتفاق.
              </p>
            </div>
          </div>

          <div class="policy-item">
            <h3 class="policy-subtitle">حالات لا يشملها التعويض</h3>
            <ul class="policy-list">
              <li>عدم الإعجاب بالطعم، بشرط أن يكون المنتج سليماً.</li>
              <li>التأخير بسبب عنوان غير دقيق أو عدم الرد من العميل.</li>
              <li>استلام الطلب دون إبلاغ فوري عن وجود مشكلة.</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  `,
  styles: [`
    .shipping-policy-container {
      width: 100%;
      min-height: calc(100vh - 400px);
      background-color: #FFFFFF;
      padding: 40px 20px;
      direction: rtl;
    }

    .shipping-policy-content {
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

    /* Policy Section */
    .policy-section {
      margin-bottom: 50px;
    }

    .section-title {
      font-family: 'Almarai', sans-serif;
      font-weight: 700;
      font-size: 32px;
      color: #DC2626;
      margin-bottom: 30px;
      text-align: right;
    }

    .policy-item {
      margin-bottom: 30px;
    }

    .policy-subtitle {
      font-family: 'Almarai', sans-serif;
      font-weight: 700;
      font-size: 20px;
      color: #000000;
      margin-bottom: 12px;
      text-align: right;
    }

    .policy-text {
      font-family: 'Almarai', sans-serif;
      font-weight: 400;
      font-size: 16px;
      color: #000000;
      text-align: justify;
      line-height: 1.8;
      margin-bottom: 0;
      padding: 0 20px;
    }

    .policy-list {
      font-family: 'Almarai', sans-serif;
      font-weight: 400;
      font-size: 16px;
      color: #000000;
      line-height: 1.8;
      margin: 0;
      padding-right: 40px;
      padding-left: 20px;
      list-style-type: disc;
      display: flex;
    }

    .policy-list li {
      margin-bottom: 10px;
    }

    .payment-method {
      margin-top: 15px;
      margin-bottom: 15px;
    }

    .payment-subtitle {
      font-family: 'Almarai', sans-serif;
      font-weight: 600;
      font-size: 18px;
      color: #000000;
      margin-bottom: 8px;
      text-align: right;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .shipping-policy-container {
        padding: 20px 10px;
      }

      .shipping-policy-content {
        padding: 10px;
      }

      .section-title {
        font-size: 24px;
        margin-bottom: 20px;
      }

      .policy-subtitle {
        font-size: 18px;
      }

      .policy-text {
        font-size: 14px;
        padding: 0 10px;
      }

      .policy-list {
        font-size: 14px;
        padding-right: 30px;
        padding-left: 10px;
      }

      .breadcrumb-nav {
        font-size: 12px;
      }

      .payment-subtitle {
        font-size: 16px;
      }
    }

    @media (max-width: 480px) {
      .section-title {
        font-size: 20px;
      }

      .policy-subtitle {
        font-size: 16px;
      }

      .policy-text {
        font-size: 13px;
      }

      .policy-list {
        font-size: 13px;
      }
    }
  `]
})
export class ShippingPolicyComponent { }

