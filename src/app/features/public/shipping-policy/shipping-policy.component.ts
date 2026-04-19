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
          <a routerLink="/" class="breadcrumb-link">{{ 'ITEM_DETAILS.HOME' | translate }}</a>
          <span class="breadcrumb-separator"> &gt; </span>
          <span class="breadcrumb-current">{{ 'SHIPPING_POLICY.BREADCRUMB' | translate }}</span>
        </nav>

        <!-- Shipping Policy Section -->
        <section class="policy-section">
          <h2 class="section-title">{{ 'SHIPPING_POLICY.SHIPPING_TITLE' | translate }}</h2>

          <ul class="policy-list">
            <li>
              <strong>{{ 'SHIPPING_POLICY.SHIPPING_COVERAGE_LABEL' | translate }}:</strong>
              {{ 'SHIPPING_POLICY.SHIPPING_COVERAGE_TEXT' | translate }}
            </li>
            <li>
              <strong>{{ 'SHIPPING_POLICY.SHIPPING_TIME_LABEL' | translate }}:</strong>
              {{ 'SHIPPING_POLICY.SHIPPING_TIME_TEXT' | translate }}
            </li>
            <li>
              <strong>{{ 'SHIPPING_POLICY.SHIPPING_FEES_LABEL' | translate }}:</strong>
              {{ 'SHIPPING_POLICY.SHIPPING_FEES_TEXT' | translate }}
            </li>
            <li>
              <strong>{{ 'SHIPPING_POLICY.SHIPPING_RECEIPT_LABEL' | translate }}:</strong>
              {{ 'SHIPPING_POLICY.SHIPPING_RECEIPT_TEXT' | translate }}
            </li>
            <li>
              <strong>{{ 'SHIPPING_POLICY.SHIPPING_SUPPORT_LABEL' | translate }}:</strong>
              {{ 'SHIPPING_POLICY.SHIPPING_SUPPORT_TEXT' | translate }}
            </li>
          </ul>
        </section>

        <!-- Cancellation and Return Policy Section -->
        <section class="policy-section">
          <h2 class="section-title">{{ 'SHIPPING_POLICY.RETURN_TITLE' | translate }}</h2>

          <ul class="policy-list">
            <li>
              <strong>{{ 'SHIPPING_POLICY.RETURN_CANCEL_LABEL' | translate }}:</strong>
              {{ 'SHIPPING_POLICY.RETURN_CANCEL_TEXT' | translate }}
            </li>

            <li>
              <strong>{{ 'SHIPPING_POLICY.RETURN_CASES_LABEL' | translate }}:</strong>
              <ul class="policy-sublist">
                <li>{{ 'SHIPPING_POLICY.RETURN_CASES_ITEM_1' | translate }}</li>
                <li>{{ 'SHIPPING_POLICY.RETURN_CASES_ITEM_2' | translate }}</li>
                <li>{{ 'SHIPPING_POLICY.RETURN_CASES_ITEM_3' | translate }}</li>
                <li>{{ 'SHIPPING_POLICY.RETURN_CASES_ITEM_4' | translate }}</li>
              </ul>
            </li>

            <li>
              <strong>{{ 'SHIPPING_POLICY.RETURN_REPORT_LABEL' | translate }}:</strong>
              {{ 'SHIPPING_POLICY.RETURN_REPORT_TEXT' | translate }}
            </li>

            <li>
              <strong>{{ 'SHIPPING_POLICY.RETURN_METHOD_LABEL' | translate }}:</strong>
              {{ 'SHIPPING_POLICY.RETURN_METHOD_TEXT' | translate }}
            </li>

            <li>
              <strong>{{ 'SHIPPING_POLICY.RETURN_REFUND_LABEL' | translate }}:</strong>
              <ul class="policy-sublist">
                <li>
                  <strong>{{ 'SHIPPING_POLICY.RETURN_REFUND_ELECTRONIC_LABEL' | translate }}:</strong>
                  {{ 'SHIPPING_POLICY.RETURN_REFUND_ELECTRONIC_TEXT' | translate }}
                </li>
                <li>
                  <strong>{{ 'SHIPPING_POLICY.RETURN_REFUND_CASH_LABEL' | translate }}:</strong>
                  {{ 'SHIPPING_POLICY.RETURN_REFUND_CASH_TEXT' | translate }}
                </li>
              </ul>
            </li>

            <li>
              <strong>{{ 'SHIPPING_POLICY.RETURN_EXCLUDED_LABEL' | translate }}:</strong>
              <ul class="policy-sublist">
                <li>{{ 'SHIPPING_POLICY.RETURN_EXCLUDED_ITEM_1' | translate }}</li>
                <li>{{ 'SHIPPING_POLICY.RETURN_EXCLUDED_ITEM_2' | translate }}</li>
                <li>{{ 'SHIPPING_POLICY.RETURN_EXCLUDED_ITEM_3' | translate }}</li>
              </ul>
            </li>
          </ul>
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
    }

    .shipping-policy-content {
      // max-width: 1200px;
      margin: 0 2rem;
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
      margin-bottom: 24px;
    }

    .policy-list {
      font-family: 'Almarai', sans-serif;
      font-weight: 400;
      font-size: 16px;
      color: #000000;
      line-height: 1.9;
      margin: 0;
      padding-inline-start: 24px;
      list-style-type: disc;
      text-align: start;
    }

    .policy-list > li {
      margin-bottom: 10px;
    }

    .policy-list > li > strong {
      font-weight: 700;
      color: #000000;
    }

    .policy-sublist {
      list-style-type: disc;
      padding-inline-start: 24px;
      margin: 6px 0 6px;
    }

    .policy-sublist li {
      margin-bottom: 4px;
    }

    .policy-sublist li strong {
      font-weight: 700;
    }

    /* RTL/LTR alignment */
    :host-context([dir='rtl']) .shipping-policy-container,
    :host-context(html[lang='ar']) .shipping-policy-container {
      direction: rtl;
    }

    :host-context([dir='rtl']) .section-title,
    :host-context(html[lang='ar']) .section-title {
      text-align: right;
    }

    :host-context([dir='ltr']) .section-title,
    :host-context(html[lang='en']) .section-title {
      text-align: left;
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
        margin-bottom: 16px;
      }

      .policy-list {
        font-size: 14px;
        padding-inline-start: 20px;
      }

      .policy-sublist {
        padding-inline-start: 20px;
      }

      .breadcrumb-nav {
        font-size: 12px;
      }
    }

    @media (max-width: 480px) {
      .section-title {
        font-size: 20px;
      }

      .policy-list {
        font-size: 13px;
      }
    }
  `]
})
export class ShippingPolicyComponent { }
