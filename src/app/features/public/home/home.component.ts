import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule, ViewportScroller } from '@angular/common';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../../shared/shared.module';
import { MenuItem, Offer } from '../../../models/menu-item.model';
import { TranslationService } from '../../../core/services/translation.service';
import { addLanguageProperty } from '../../../core/utils/item-translation.util';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, SharedModule, TranslateModule],
  template: `
    <div class="container-fluid px-0">
      <section class="hero-section text-center text-white pb-5 mb-5 position-relative overflow-hidden">
        <video #heroVideo class="hero-video" autoplay loop muted playsinline preload="auto">
          <source src="assets/Video_banner.mp4" type="video/mp4">
        </video>
        <button class="unmute-button" (click)="toggleMute()" [attr.aria-label]="isMuted ? 'Unmute video' : 'Mute video'">
          <svg *ngIf="isMuted" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.5 12C16.5 10.23 15.48 8.71 14.07 7.93L15.5 6.5C17.48 7.61 18.9 9.64 18.9 12C18.9 14.36 17.48 16.39 15.5 17.5L14.07 16.07C15.48 15.29 16.5 13.77 16.5 12ZM19 12C19 8.13 16.36 4.86 12.5 4.03V2.05C17.54 2.88 21.5 7.03 21.5 12C21.5 16.97 17.54 21.12 12.5 21.95V19.97C16.36 19.14 19 15.87 19 12ZM4.27 3L3 4.27L7.73 9H3V15H7L12 20V13.27L16.25 17.53C15.58 18.04 14.83 18.46 14 18.7V20.73C15.38 20.46 16.63 19.93 17.68 19.18L19.73 21.23L21 19.96L4.27 3ZM12 4L9.91 6.09L12 8.18V4Z" fill="white"/>
          </svg>
          <svg *ngIf="!isMuted" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 9V15H7L12 20V4L7 9H3ZM16.5 12C16.5 10.23 15.48 8.71 14.07 7.93L15.5 6.5C17.48 7.61 18.9 9.64 18.9 12C18.9 14.36 17.48 16.39 15.5 17.5L14.07 16.07C15.48 15.29 16.5 13.77 16.5 12ZM19 12C19 8.13 16.36 4.86 12.5 4.03V2.05C17.54 2.88 21.5 7.03 21.5 12C21.5 16.97 17.54 21.12 12.5 21.95V19.97C16.36 19.14 19 15.87 19 12Z" fill="white"/>
          </svg>
        </button>
        <div class="hero-overlay">
          <div class="hero-logo">
            <img src="assets/Bashwat-logo.png" alt="Al Bashawat Restaurant Logo" />
          </div>
          <div class="hero-text">
            <div class="hero-year">{{ 'HOME.YEAR' | translate }}</div>
            <div class="hero-slogan">{{ 'HOME.SLOGAN' | translate }}</div>
          </div>
        </div>
      </section>
    </div>
    <div class="container-fluid px-0">
      <section class="categories-section py-5">
        <div class="container">
          <div class="section-header">
            <a (click)="navigateToMenu()" class="view-all-link" style="cursor: pointer;">عرض الكل</a>
            <h2 class="section-title">الاصناف</h2>
          </div>
          <div class="categories-grid">
            <div class="category-item" (click)="navigateToCategory('الخضار')" style="cursor: pointer;">
              <div class="category-image-wrapper">
                <img src="assets/itmes/الخضار.png" alt="الخضار" class="category-image" />
                <span class="category-circle"></span>
              </div>
              <div class="category-label">الخضار</div>
            </div>
            <div class="category-item" (click)="navigateToCategory('الساندوشات')" style="cursor: pointer;">
              <div class="category-image-wrapper">
                <img src="assets/itmes/الساندوشات.png" alt="الساندوشات" class="category-image" />
                <span class="category-circle"></span>
              </div>
              <div class="category-label">الساندوشات</div>
            </div>
            <div class="category-item" (click)="navigateToCategory('الباستا')" style="cursor: pointer;">
              <div class="category-image-wrapper">
                <img src="assets/itmes/الباستا.png" alt="الباستا" class="category-image" />
                <span class="category-circle"></span>
              </div>
              <div class="category-label">الباستا</div>
            </div>
            <div class="category-item" (click)="navigateToCategory('المقبلات')" style="cursor: pointer;">
              <div class="category-image-wrapper">
                <img src="assets/itmes/المقبلات.png" alt="المقبلات" class="category-image" />
                <span class="category-circle"></span>
              </div>
              <div class="category-label">المقبلات</div>
            </div>
            <div class="category-item" (click)="navigateToCategory('الفطار')" style="cursor: pointer;">
              <div class="category-image-wrapper">
                <img src="assets/itmes/الفطار.png" alt="الفطار" class="category-image" />
                <span class="category-circle"></span>
              </div>
              <div class="category-label">الفطار</div>
            </div>
            <div class="category-item" (click)="navigateToCategory('الحلويات')" style="cursor: pointer;">
              <div class="category-image-wrapper">
                <img src="assets/itmes/الحلويات.png" alt="الحلويات" class="category-image" />
                <span class="category-circle"></span>
              </div>
              <div class="category-label">الحلويات</div>
            </div>
            <div class="category-item" (click)="navigateToCategory('الصواني')" style="cursor: pointer;">
              <div class="category-image-wrapper">
                <img src="assets/itmes/الصوانى.png" alt="الصواني" class="category-image" />
                <span class="category-circle"></span>
              </div>
              <div class="category-label">الصواني</div>
            </div>
            <div class="category-item" (click)="navigateToCategory('الأطباق الرئيسة')" style="cursor: pointer;">
              <div class="category-image-wrapper">
                <img src="assets/itmes/الأطباق الرئيسة.png" alt="الأطباق الرئيسة" class="category-image" />
                <span class="category-circle"></span>
              </div>
              <div class="category-label">الأطباق الرئيسة</div>
            </div>
            <div class="category-item" (click)="navigateToCategory('المشاوي')" style="cursor: pointer;">
              <div class="category-image-wrapper">
                <img src="assets/itmes/المشاوى.png" alt="المشاوي" class="category-image" />
                <span class="category-circle"></span>
              </div>
              <div class="category-label">المشاوي</div>
            </div>
            <div class="category-item" (click)="navigateToCategory('الشوربة')" style="cursor: pointer;">
              <div class="category-image-wrapper">
                <img src="assets/itmes/الشوربةز.png" alt="الشوربة" class="category-image" />
                <span class="category-circle"></span>
              </div>
              <div class="category-label">الشوربة</div>
            </div>
          </div>
        </div>
      </section>
    </div>
<div class="container-fluid px-0">
      <section class="most-requested-section py-5">
        <div class="container">
          <div class="section-header">
            <a href="#" class="view-all-link">عرض الكل</a>
            <h2 class="section-title">الاكثر طلبا</h2>
          </div>
          <div class="most-requested-cards">
            <div class="requested-card">
              <div class="card-image-wrapper">
                <img src="assets/1.png" alt="ورق عنب يغير مودك" class="card-image" />
              </div>
              <div class="card-content">
                <h3 class="card-title">ورق عنب يغير مودك</h3>
                <p class="card-description">نص فرخة+قطعتين صدور+صبعين گفته+ارز+سلطة طحينه+عيش</p>
                <div class="card-action-row">
                  <div class="card-price">82 ريال</div>
                  <button class="order-button">
                    <span class="plus-icon">+</span>
                    <span>أطلب</span>
                  </button>
                </div>
              </div>
            </div>
            <div class="requested-card">
              <div class="card-image-wrapper">
                <img src="assets/1.png" alt="أفندينا" class="card-image" />
              </div>
              <div class="card-content">
                <h3 class="card-title">أفندينا</h3>
                <p class="card-description">نص فرخة+قطعتين صدور+صبعين گفته+ارز+سلطة طحينه+عيش</p>
                <div class="card-action-row">
                  <div class="card-price">89 ريال</div>
                  <button class="order-button">
                    <span class="plus-icon">+</span>
                    <span>أطلب</span>
                  </button>
                </div>
              </div>
            </div>
            <div class="requested-card">
              <div class="card-image-wrapper">
                <img src="assets/1.png" alt="وجبة الأفندية" class="card-image" />
              </div>
              <div class="card-content">
                <h3 class="card-title">وجبة الأفندية</h3>
                <p class="card-description">نص فرخة+قطعتين صدور+صبعين گفته+ارز+سلطة طحينه+عيش</p>
                <div class="card-action-row">
                  <div class="card-price">82 ريال</div>
                  <button class="order-button">
                    <span class="plus-icon">+</span>
                    <span>أطلب</span>
                  </button>
                </div>
              </div>
            </div>
            <div class="requested-card">
              <div class="card-image-wrapper">
                <img src="assets/1.png" alt="صينية المزاجنجية" class="card-image" />
              </div>
              <div class="card-content">
                <h3 class="card-title">صينية المزاجنجية</h3>
                <p class="card-description">نص فرخة+قطعتين صدور+صبعين گفته+ارز+سلطة طحينه+عيش</p>
                <div class="card-action-row">
                  <div class="card-price">299 ريال</div>
                  <button class="order-button">
                    <span class="plus-icon">+</span>
                    <span>أطلب</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    <div class="container-fluid px-0">
      <section class="offers-section mb-5" [style.background-image]="'url(assets/OfferBackground.png)'">
        <div class="container">
          <div class="offers-grid">
            <div class="offer-item">
              <img src="assets/offerPhoto/Rectangle_4603.png" alt="Offer" class="offer-photo" />
              <div class="offer-content">
                <img src="assets/Subtract.png" alt="Offer" class="offer-shape" />
                <div class="offer-details">
                  <div class="offer-price-section">
                    <div class="offer-price">500 ريال</div>
                    <div class="offer-original-price">
                      <span class="offer-label">بدلا من</span>
                      <span class="offer-strikethrough">1000 ريال</span>
                    </div>
                  </div>
                  <div class="offer-title">صنية الملوك</div>
                  <div class="offer-description" data-full-text="8 حمام محشي، وطلب ريش، ونصف كيلو كفتة، وطلب طرب، وطلب كباب، ونصف كيلو ممبار، بالإضافة إلى اختيارك من الأرز المصري أو البخاري.">
                    <span class="offer-description-text">8 حمام محشي، وطلب ريش، ونصف كيلو كفتة، وطلب طرب، وطلب كباب، ونصف كيلو ممبار، بالإضافة إلى اختيارك من الأرز المصري أو البخاري.</span>
                  </div>
                  <div class="offer-action">
                    <button class="offer-button" (click)="navigateToOffer('1')">أطلب +</button>
                    <span class="offer-discount">50% خصم</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="offer-item">
              <img src="assets/offerPhoto/Rectangle_4604.png" alt="Offer" class="offer-photo" />
              <div class="offer-content">
                <img src="assets/Subtract.png" alt="Offer" class="offer-shape" />
                <div class="offer-details">
                  <div class="offer-price-section">
                    <div class="offer-price">500 ريال</div>
                    <div class="offer-original-price">
                      <span class="offer-label">بدلا من</span>
                      <span class="offer-strikethrough">1000 ريال</span>
                    </div>
                  </div>
                  <div class="offer-title">صنية الملوك</div>
                  <div class="offer-description" data-full-text="8 حمام محشي، وطلب ريش، ونصف كيلو كفتة، وطلب طرب، وطلب كباب، ونصف كيلو ممبار، بالإضافة إلى اختيارك من الأرز المصري أو البخاري.">
                    <span class="offer-description-text">8 حمام محشي، وطلب ريش، ونصف كيلو كفتة، وطلب طرب، وطلب كباب، ونصف كيلو ممبار، بالإضافة إلى اختيارك من الأرز المصري أو البخاري.</span>
                  </div>
                  <div class="offer-action">
                    <button class="offer-button" (click)="navigateToOffer('2')">أطلب +</button>
                    <span class="offer-discount">50% خصم</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="offer-item">
              <img src="assets/offerPhoto/Rectangle_4605.png" alt="Offer" class="offer-photo" />
              <div class="offer-content">
                <img src="assets/Subtract.png" alt="Offer" class="offer-shape" />
                <div class="offer-details">
                  <div class="offer-price-section">
                    <div class="offer-price">500 ريال</div>
                    <div class="offer-original-price">
                      <span class="offer-label">بدلا من</span>
                      <span class="offer-strikethrough">1000 ريال</span>
                    </div>
                  </div>
                  <div class="offer-title">صنية الملوك</div>
                  <div class="offer-description" data-full-text="8 حمام محشي، وطلب ريش، ونصف كيلو كفتة، وطلب طرب، وطلب كباب، ونصف كيلو ممبار، بالإضافة إلى اختيارك من الأرز المصري أو البخاري.">
                    <span class="offer-description-text">8 حمام محشي، وطلب ريش، ونصف كيلو كفتة، وطلب طرب، وطلب كباب، ونصف كيلو ممبار، بالإضافة إلى اختيارك من الأرز المصري أو البخاري.</span>
                  </div>
                  <div class="offer-action">
                    <button class="offer-button" (click)="navigateToOffer('3')">أطلب +</button>
                    <span class="offer-discount">50% خصم</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="offer-item">
              <img src="assets/offerPhoto/Rectangle_4606.png" alt="Offer" class="offer-photo" />
              <div class="offer-content">
                <img src="assets/Subtract.png" alt="Offer" class="offer-shape" />
                <div class="offer-details">
                  <div class="offer-price-section">
                    <div class="offer-price">500 ريال</div>
                    <div class="offer-original-price">
                      <span class="offer-label">بدلا من</span>
                      <span class="offer-strikethrough">1000 ريال</span>
                    </div>
                  </div>
                  <div class="offer-title">صنية الملوك</div>
                  <div class="offer-description" data-full-text="8 حمام محشي، وطلب ريش، ونصف كيلو كفتة، وطلب طرب، وطلب كباب، ونصف كيلو ممبار، بالإضافة إلى اختيارك من الأرز المصري أو البخاري.">
                    <span class="offer-description-text">8 حمام محشي، وطلب ريش، ونصف كيلو كفتة، وطلب طرب، وطلب كباب، ونصف كيلو ممبار، بالإضافة إلى اختيارك من الأرز المصري أو البخاري.</span>
                  </div>
                  <div class="offer-action">
                    <button class="offer-button" (click)="navigateToOffer('4')">أطلب +</button>
                    <span class="offer-discount">50% خصم</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    <div class="container-fluid px-0">
      <section class="we-chose-section py-5">
        <div class="container">
          <div class="section-header">
            <div class="carousel-nav">
              <button class="carousel-btn prev-btn" (click)="scrollCarousel('we-chose', -1)">
                <span>←</span>
              </button>
              <button class="carousel-btn next-btn" (click)="scrollCarousel('we-chose', 1)">
                <span>→</span>
              </button>
            </div>
            <h2 class="section-title">اخترنا لك</h2>
          </div>
          <div class="we-chose-cards" #weChoseCarousel>
            <div class="we-chose-card">
              <div class="we-chose-card-bg">
                <img src="assets/Bashwat-logo.png" alt="Logo" class="we-chose-logo" />
              </div>
              <div class="we-chose-image-wrapper">
                <img src="assets/1.png" alt="ورق عنب يغير مودك" class="we-chose-image" />
                <!-- <div class="we-chose-price-tag">82 ريال</div> -->
              </div>
              <div class="we-chose-content">
                <h3 class="we-chose-title">ورق عنب يغير مودك</h3>
                <p class="we-chose-description">نص فرخة+قطعتين صدور+صبعين گفته+ارز+سلطة طحينه+عيش 500 جرام فراخ فيليه تشويه يقدم مع ارز بسمته وسلطه</p>
                <div class="we-chose-action-row">
                  <div class="we-chose-price">82 ريال</div>
                  <button class="we-chose-order-button">
                    <span>أطلب +</span>
                  </button>
                </div>
              </div>
            </div>
            <div class="we-chose-card">
              <div class="we-chose-card-bg">
                <img src="assets/Bashwat-logo.png" alt="Logo" class="we-chose-logo" />
              </div>
              <div class="we-chose-image-wrapper">
                <img src="assets/1.png" alt="أفندينا" class="we-chose-image" />
                <!-- <div class="we-chose-price-tag">89 ريال</div> -->
              </div>
              <div class="we-chose-content">
                <h3 class="we-chose-title">أفندينا</h3>
                <p class="we-chose-description">نص فرخة+قطعتين صدور+صبعين گفته+ارز+سلطة طحينه+عيش 500 جرام فراخ فيليه تشويه يقدم مع ارز بسمتة وسلطه</p>
                <div class="we-chose-action-row">
                  <div class="we-chose-price">82 ريال</div>
                  <button class="we-chose-order-button">
                    <span>أطلب +</span>
                  </button>
                </div>
              </div>
            </div>
            <div class="we-chose-card">
              <div class="we-chose-card-bg">
                <img src="assets/Bashwat-logo.png" alt="Logo" class="we-chose-logo" />
              </div>
              <div class="we-chose-image-wrapper">
                <img src="assets/1.png" alt="صينية المزاجنجية" class="we-chose-image" />
                <!-- <div class="we-chose-price-tag">299 ريال</div> -->
              </div>
              <div class="we-chose-content">
                <h3 class="we-chose-title">صينية المزاجنجية</h3>
                <p class="we-chose-description">نص فرخة+قطعتين صدور+صبعين گفته+ارز+سلطة طحينه+عيش 500 جرام فراخ فيليه تشويه يقدم مع ارز بسمتة وسلطه</p>
                <div class="we-chose-action-row">
                  <div class="we-chose-price">82 ريال</div>
                  <button class="we-chose-order-button">
                    <span>أطلب +</span>
                  </button>
                </div>
              </div>
            </div>
            <div class="we-chose-card">
              <div class="we-chose-card-bg">
                <img src="assets/Bashwat-logo.png" alt="Logo" class="we-chose-logo" />
              </div>
              <div class="we-chose-image-wrapper">
                <img src="assets/1.png" alt="وجبة الأفندية" class="we-chose-image" />
                <!-- <div class="we-chose-price-tag">82 ريال</div> -->
              </div>
              <div class="we-chose-content">
                <h3 class="we-chose-title">وجبة الأفندية</h3>
                <p class="we-chose-description">نص فرخة+قطعتين صدور+صبعين گفته+ارز+سلطة طحينه+عيش 500 جرام فراخ فيليه تشويه يقدم مع ارز بسمته وسلطة</p>
                <div class="we-chose-action-row">
                  <div class="we-chose-price">82 ريال</div>
                  <button class="we-chose-order-button">
                    <span>أطلب +</span>
                  </button>
                </div>
              </div>
            </div>
            <div class="we-chose-card">
              <div class="we-chose-card-bg">
                <img src="assets/Bashwat-logo.png" alt="Logo" class="we-chose-logo" />
              </div>
              <div class="we-chose-image-wrapper">
                <img src="assets/1.png" alt="صينية المشاوي المختلطة" class="we-chose-image" />
                <!-- <div class="we-chose-price-tag">150 ريال</div> -->
              </div>
              <div class="we-chose-content">
                <h3 class="we-chose-title">صينية المشاوي المختلطة</h3>
                <p class="we-chose-description">كيلو مشكل مشاوي+ارز+سلطة+طحينة+مقبلات+عيش 500 جرام فراخ فيليه تشويه يقدم مع ارز بسمتة وسلطه</p>
                <div class="we-chose-action-row">
                  <div class="we-chose-price">150 ريال</div>
                  <button class="we-chose-order-button">
                    <span>أطلب +</span>
                  </button>
                </div>
              </div>
            </div>
            <div class="we-chose-card">
              <div class="we-chose-card-bg">
                <img src="assets/Bashwat-logo.png" alt="Logo" class="we-chose-logo" />
              </div>
              <div class="we-chose-image-wrapper">
                <img src="assets/1.png" alt="وجبة الكباب" class="we-chose-image" />
                <!-- <div class="we-chose-price-tag">95 ريال</div> -->
              </div>
              <div class="we-chose-content">
                <h3 class="we-chose-title">وجبة الكباب</h3>
                <p class="we-chose-description">نصف كيلو كباب+ارز+سلطة+طحينة+مقبلات+عيش 500 جرام فراخ فيليه تشويه يقدم مع ارز بسمته وسلطة</p>
                <div class="we-chose-action-row">
                  <div class="we-chose-price">95 ريال</div>
                  <button class="we-chose-order-button">
                    <span>أطلب +</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    <section class="vision-section">
      <img src="assets/BashwatVision.png" alt="Bashwat Vision" class="vision-image" />
    </section>
  `,
  styles: [`
    .hero-section {
      position: relative;
      height: 712px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 0;
      padding-top: 0;
    }
    .hero-video {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      z-index: 0;
      pointer-events: none;
    }
    .hero-section .container {
      z-index: 1;
      position: relative;
    }
    .hero-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 2;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      pointer-events: none;
    }
    .hero-logo {
      margin-bottom: 30px;
      pointer-events: none;
    }
    .hero-logo img {
      max-width: 200px;
      height: auto;
      object-fit: contain;
    }
    .hero-text {
      text-align: center;
      color: white;
    }
    .hero-year {
      font-family: 'Almarai', sans-serif;
      font-weight: 700;
      font-style: normal;
      font-size: 41.48px;
      line-height: 100%;
      letter-spacing: 0%;
      text-align: center;
      margin-bottom: 10px;
    }
    .hero-slogan {
      font-family: 'Almarai', sans-serif;
      font-weight: 700;
      font-style: normal;
      font-size: 41.48px;
      line-height: 100%;
      letter-spacing: 0%;
      text-align: center;
      position: relative;
    }
    .hero-slogan::after {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
      width: 200px;
      height: 2px;
      background-color: white;
    }
    .unmute-button {
      position: absolute;
      top: 20px;
      right: 20px;
      z-index: 10;
      background-color: rgba(0, 0, 0, 0.5);
      border: 2px solid rgba(255, 255, 255, 0.8);
      border-radius: 50%;
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
      backdrop-filter: blur(4px);
    }
    .unmute-button:hover {
      background-color: rgba(0, 0, 0, 0.7);
      border-color: white;
      transform: scale(1.1);
    }
    .unmute-button svg {
      width: 24px;
      height: 24px;
    }
    .item-card {
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .item-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.15) !important;
    }
    .offers-section {
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      padding: 2rem 0;
    }
    .offers-grid {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 1.5rem;
      margin-top: 2rem;
      margin-left: auto;
      width: fit-content;
    }
    .offer-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      gap: 1rem;
      flex: 0 0 calc(50% - 0.75rem);
    }
    .offer-photo {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      object-fit: cover;
      flex-shrink: 0;
      z-index: 2;
      left: 90px;
      top: 18px;
      position: relative; 
    }
    .offer-content {
      position: relative;
      flex: 1;
    }
    .offer-shape {
      max-width: 100%;
      height: 155px;
      object-fit: contain;
      z-index: 1;
    }
    .offer-details {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      z-index: 2;
      direction: rtl;
      overflow: visible;
    }
    .offer-price-section {
      display: flex;
      flex-direction: column;
      // align-items: flex-start;
      margin-bottom: 0.5rem;
      position: relative;
  top: 27px;
  left: -97px;
  align-items: center;
    }
    .offer-price {
      font-family: 'Almarai', sans-serif;
      font-weight: 700;
      font-size: 1.5rem;
      color: #d32f2f;
      margin-bottom: 0.25rem;
    }
    .offer-original-price {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;
    }
    .offer-label {
      font-family: 'Almarai', sans-serif;
      font-weight: 400;
      font-size: 0.75rem;
      color: #999;
      align-self: center;
    }
    .offer-strikethrough {
      font-family: 'Almarai', sans-serif;
      font-weight: 400;
      font-size: 0.9rem;
      color: #666;
      text-decoration: line-through;
    }
    .offer-title {
      font-family: 'Almarai', sans-serif;
      font-weight: 700;
      font-size: 1.25rem;
      color: #d32f2f;
      margin-bottom: 0.5rem;
      position: relative;
      display: flex;
      bottom: 95px;
      right: 20px;
    }
    .offer-description {
      position: relative;
      bottom: 100px;
      left: 18px;
      width: 200px;
      margin-bottom: 0.5rem;
      flex: 1;
      cursor: pointer;
    }
    .offer-description-text {
      font-family: "Almarai", sans-serif;
      font-weight: 400;
      font-style: normal;
      font-size: 14px;
      line-height: 100%;
      letter-spacing: 0%;
      text-align: right;
      color: #333;
      display: -webkit-box;
      -webkit-line-clamp: 4;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      word-wrap: break-word;
      max-height: 80px; /* 3 lines: 14px * 3 + small buffer */
      position: relative;
      right: 40px;
    }
    .offer-description:hover {
      z-index: 10;
    }
    .offer-description::after {
      content: attr(data-full-text);
      position: absolute;
      bottom: calc(100% + 10px);
      right: 0;
      background-color: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      font-family: "Almarai", sans-serif;
      font-weight: 400;
      font-style: normal;
      font-size: 14px;
      line-height: 150%;
      letter-spacing: 0%;
      text-align: right;
      white-space: normal;
      width: 250px;
      max-width: 90vw;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
      z-index: 1000;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      direction: rtl;
    }
    .offer-description:hover::after {
      opacity: 1;
    }
    .offer-action {
      display: flex;
      align-items: center;
      // justify-content: space-between;
      // gap: 0.5rem;
      // margin-top: auto;
      position: relative;
  bottom: 104px;
  right: 9px;
    }
    .offer-discount {
      font-family: 'Almarai', sans-serif;
      font-weight: 700;
      font-size: 0.9rem;
      color: #F00E0C;
    }
    .offer-button {
      font-family: 'Almarai', sans-serif;
      font-weight: 700;
      font-size: 0.9rem;
      background-color: #d32f2f;
      color: white;
      border: none;
      border-radius: 25px;
      padding: 0.5rem 1rem;
      cursor: pointer;
      transition: background-color 0.3s ease;
      white-space: nowrap;
      margin-inline: 10px;
    }
    .offer-button:hover {
      background-color: #b71c1c;
    }
    .featured-section {
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      width: 100%;
    }
    .vision-section {
      width: 100%;
      padding: 0;
      margin: 0;
    }
    .vision-image {
      width: 100%;
      height: auto;
      max-width: 100%;
      object-fit: contain;
      display: block;
      margin: 0;
      padding: 0;
    }
    .categories-section {
      background-color: #ffffff;
      padding: 3rem 0;
    }
    .categories-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 2rem;
      justify-items: center;
      margin-top: 2rem;
    }
    .category-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }
    .category-image-wrapper {
      position: relative;
      width: 120px;
      height: 120px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .category-image {
      width: 85%;
      height: 85%;
      object-fit: cover;
      border-radius: 50%;
      z-index: 2;
      position: relative;
    }
    .category-circle {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: linear-gradient(180deg, rgba(253, 223, 89, 0.5) 0%, rgba(255, 255, 255, 0.5) 100%);
      z-index: 1;
    }
    .category-label {
      font-family: 'Almarai', sans-serif;
      font-weight: 400;
      font-size: 1rem;
      color: #333;
      text-align: center;
      margin-top: 0.5rem;
    }
    .we-chose-section {
      background-color: #ffffff;
      padding: 3rem 0;
    }
    .we-chose-section .section-header {
      display: grid;
      grid-template-columns: auto 1fr;
      align-items: center;
      gap: 1rem;
    }
    .we-chose-section .section-title {
      grid-column: 2;
      justify-self: center;
    }
    .carousel-nav {
      display: flex;
      gap: 0.5rem;
      grid-column: 1;
    }
    .carousel-btn {
      width: 40px;
      height: 40px;
      border: 1px solid #ddd;
      background-color: #f5f5f5;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 1.2rem;
      color: #666;
    }
    .carousel-btn:hover {
      background-color: #d32f2f;
      color: white;
      border-color: #d32f2f;
    }
    .we-chose-cards {
      display: flex;
      gap: 1.5rem;
      overflow-x: auto;
      scroll-behavior: smooth;
      padding: 1rem 0;
      scrollbar-width: thin;
      -webkit-overflow-scrolling: touch;
    }
    .we-chose-cards::-webkit-scrollbar {
      height: 8px;
    }
    .we-chose-cards::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 10px;
    }
    .we-chose-cards::-webkit-scrollbar-thumb {
      background: #d32f2f;
      border-radius: 10px;
    }
    .we-chose-card {
      flex: 0 0 calc(25% - 1.125rem);
      min-width: 300px;
      max-width: 350px;
      position: relative;
      // background: linear-gradient(135deg, #8B0000 0%, #A52A2A 100%);
      border-radius: 15px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
            border: 2px solid #d32f2f;
    }
    .we-chose-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
    }
    .we-chose-card-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      opacity: 0.1;
    }
    .we-chose-logo {
      position: absolute;
      top: 15px;
      left: 15px;
      width: 50px;
      height: 50px;
      z-index: 2;
      opacity: 0.8;
    }
    .we-chose-image-wrapper {
      position: relative;
      width: 100%;
      padding: 1rem;
      z-index: 2;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .we-chose-image {
      // width: 100%;
      // max-width: 250px;
      // height: auto;
      // object-fit: cover;
      // border-radius: 10px;
      // background-color: white;
      // padding: 0.5rem;
            width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .we-chose-price-tag {
      position: absolute;
      top: 2.5rem;
      right: 2rem;
      background: linear-gradient(135deg, #FDC55E 0%, #FFD700 100%);
      color: #333;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-family: 'Almarai', sans-serif;
      font-weight: 700;
      font-size: 0.9rem;
      z-index: 3;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }
    .we-chose-content {
      padding: 1rem;
      z-index: 2;
      position: relative;
      // background-color: rgba(139, 0, 0, 0.95);
      flex-grow: 1;
      display: flex;
      flex-direction: column;
    }
    .we-chose-title {
      font-family: 'Almarai', sans-serif;
      font-weight: 700;
      font-size: 1.25rem;
      // color: #ffffff;
      margin-bottom: 0.75rem;
      text-align: right;
    }
    .we-chose-description {
      font-family: 'Almarai', sans-serif;
      font-weight: 400;
      font-size: 0.85rem;
      // color: rgba(255, 255, 255, 0.9);
      margin-bottom: 1rem;
      text-align: right;
      line-height: 1.5;
      flex-grow: 1;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .we-chose-action-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      margin-top: auto;
      direction: rtl;
    }
    .we-chose-order-button {
      background-color: #d32f2f;
      color: white;
      border: none;
      border-radius: 8px;
      padding: 0.75rem 1.5rem;
      font-family: 'Almarai', sans-serif;
      font-weight: 700;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.3s ease, transform 0.2s ease;
      white-space: nowrap;
    }
    .we-chose-order-button:hover {
      background-color: #b71c1c;
      transform: scale(1.05);
    }
    .we-chose-price {
      font-family: 'Aref_Menna', serif;
      font-weight: 700;
      font-size: 1.5rem;
      color: #b71c1c;
      white-space: nowrap;
    }
    .most-requested-section {
      background-color: #ffffff;
      padding: 3rem 0;
    }
    .section-header {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      align-items: center;
      margin-bottom: 2rem;
      position: relative;
    }
    .section-title {
      font-family: 'Almarai', sans-serif;
      font-weight: 700;
      font-size: 2.5rem;
      color: #d32f2f;
      text-align: center;
      grid-column: 2;
      position: relative;
      padding-bottom: 0.5rem;
    }
    .categories-section .section-header .view-all-link {
      grid-column: 1;
      justify-self: start;
    }
    .section-title::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 100px;
      height: 4px;
      background-color: #FDC55E;
    }
    .view-all-link {
      font-family: 'Almarai', sans-serif;
      font-weight: 400;
      font-size: 1rem;
      color: #333;
      text-decoration: none;
      transition: color 0.3s ease;
    }
    .view-all-link:hover {
      color: #d32f2f;
    }
    .most-requested-cards {
      display: flex;
      gap: 1.5rem;
      flex-wrap: wrap;
      justify-content: center;
    }
    .requested-card {
      background-color: #ffffff;
      border: 2px solid #d32f2f;
      // color: black;
      border-radius: 15px;
      overflow: hidden;
      flex: 0 0 calc(25% - 1.125rem);
      min-width: 250px;
      max-width: 300px;
      display: flex;
      flex-direction: column;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .requested-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    }
    .card-image-wrapper {
      // position: relative;
      // width: 100%;
      // height: 200px;
      // overflow: hidden;
           position: relative;
      width: 100%;
      padding: 1rem;
      z-index: 2;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .card-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .price-tag {
      position: absolute;
      top: 10px;
      right: 10px;
      background-color: #FDC55E;
      color: #333;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-family: 'Almarai', sans-serif;
      font-weight: 700;
      font-size: 1rem;
      z-index: 2;
    }
    .card-content {
      padding: 1rem;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    }
    .card-title {
      font-family: 'Almarai', sans-serif;
      font-weight: 700;
      font-size: 1.25rem;
      // color: #ffffff;
      margin-bottom: 0.75rem;
      text-align: right;
    }
    .card-description {
      font-family: 'Almarai', sans-serif;
      font-weight: 400;
      font-size: 0.9rem;
      // color: #ffffff;
      margin-bottom: 1rem;
      text-align: right;
      line-height: 1.5;
      flex-grow: 1;
    }
    .card-action-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      margin-top: auto;
      direction: rtl;
    }
    .card-price {
      width: 100px;
      height: 25px;
      font-family: 'Aref_Menna', serif;
      font-weight: 700;
      font-size: 24px;
      line-height: 100%;
      letter-spacing: 0px;
      text-transform: capitalize;
      color: #d32f2f;
      opacity: 1;
    }
    .order-button {
      width: 183px;
      height: 40px;
      background-color: #F00E0C;
      border: 1px solid transparent;
      color: #ffffff;
      padding: 12px 10px;
      border-radius: 100px;
      font-family: 'Almarai', sans-serif;
      font-weight: 700;
      font-size: 1rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      transition: background-color 0.3s ease, transform 0.2s ease;
      margin-top: auto;
      opacity: 1;
    }
    .order-button:hover {
      background-color: #b71c1c;
      transform: scale(1.05);
    }
    .plus-icon {
      font-size: 1.25rem;
      font-weight: 700;
    }
    @media (max-width: 1200px) {
      .requested-card {
        flex: 0 0 calc(50% - 0.75rem);
      }
    }
    @media (max-width: 1200px) {
      .categories-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }
    @media (max-width: 768px) {
      .section-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }
      .section-title {
        font-size: 2rem;
        width: 100%;
      }
      .view-all-link {
        align-self: flex-end;
      }
      .we-chose-section .section-header {
        grid-template-columns: 1fr;
        justify-items: center;
      }
      .we-chose-section .section-title {
        grid-column: 1;
        justify-self: center;
      }
      .carousel-nav {
        grid-column: 1;
        justify-self: center;
      }
      .we-chose-card {
        min-width: 280px;
      }
      .categories-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 1.5rem;
      }
      .category-image-wrapper {
        width: 100px;
        height: 100px;
      }
      .most-requested-cards {
        flex-direction: column;
        align-items: center;
      }
      .requested-card {
        flex: 0 0 100%;
        max-width: 100%;
      }
    }
  `]
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild('heroVideo', { static: false }) heroVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('weChoseCarousel', { static: false }) weChoseCarousel!: ElementRef<HTMLDivElement>;
  featuredItems$!: Observable<MenuItem[]>;
  offers$!: Observable<Offer[]>;
  isMuted: boolean = true;

  constructor(
    private translationService: TranslationService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private viewportScroller: ViewportScroller
  ) { }

  ngAfterViewInit(): void {
    const vid = this.heroVideo.nativeElement;
    vid.muted = true;
    this.isMuted = true;

    // Start playing the video
    vid.play().catch(err => {
      console.log('Autoplay prevented:', err);
    });
  }

  toggleMute(): void {
    const vid = this.heroVideo.nativeElement;
    vid.muted = !vid.muted;
    this.isMuted = vid.muted;

    // Ensure video continues playing
    if (vid.paused) {
      vid.play().catch(err => {
        console.log('Video play failed:', err);
      });
    }
  }


  ngOnInit(): void {
    // Static mock data until backend is ready
    const items: MenuItem[] = [
      {
        id: '1',
        name: 'سلطة قيصر',
        nameEn: 'Caesar Salad',
        description: 'خس روماني طازج مع صلصة قيصر',
        descriptionEn: 'Fresh romaine lettuce with Caesar dressing',
        price: 12.99,
        imageUrl: 'https://via.placeholder.com/300',
        categoryId: '1',
        isAvailable: true
      },
      {
        id: '2',
        name: 'دجاج مشوي',
        nameEn: 'Grilled Chicken',
        description: 'صدر دجاج مشوي طري مع خضار',
        descriptionEn: 'Tender grilled chicken breast with vegetables',
        price: 18.99,
        imageUrl: 'https://via.placeholder.com/300',
        categoryId: '2',
        isAvailable: true
      },
      {
        id: '3',
        name: 'كيك الشوكولاتة',
        nameEn: 'Chocolate Cake',
        description: 'كيك شوكولاتة غني مع آيس كريم الفانيليا',
        descriptionEn: 'Rich chocolate cake with vanilla ice cream',
        price: 8.99,
        imageUrl: 'https://via.placeholder.com/300',
        categoryId: '3',
        isAvailable: true
      }
    ];
    this.featuredItems$ = of(addLanguageProperty(items, this.translationService));

    this.offers$ = of([
      {
        id: '1',
        title: 'Weekend Special',
        description: 'Get 20% off on all main courses this weekend',
        discountPercentage: 20,
        validFrom: new Date(),
        validTo: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        isActive: true
      },
      {
        id: '2',
        title: 'Free Delivery',
        description: 'Free delivery on orders over $50',
        discountAmount: 5,
        validFrom: new Date(),
        validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isActive: true
      }
    ]);
  }

  scrollCarousel(carouselName: string, direction: number): void {
    let carousel: ElementRef<HTMLDivElement> | null = null;

    if (carouselName === 'we-chose') {
      carousel = this.weChoseCarousel;
    }

    if (carousel) {
      const element = carousel.nativeElement;
      const cards = element.querySelectorAll('.we-chose-card');

      if (cards.length > 0) {
        // Get the first card's width including margin/gap
        const firstCard = cards[0] as HTMLElement;
        const cardStyle = window.getComputedStyle(firstCard);
        const cardWidth = firstCard.offsetWidth;

        // Get gap from parent container
        const containerStyle = window.getComputedStyle(element);
        const gap = parseFloat(containerStyle.gap) || 24; // Default gap is 1.5rem = 24px

        // Calculate scroll amount: card width + gap
        const scrollAmount = cardWidth + gap;

        element.scrollBy({
          left: direction * scrollAmount,
          behavior: 'smooth'
        });
      }
    }
  }

  navigateToOffer(offerId: string): void {
    this.router.navigate(['/item', offerId]).then(() => {
      this.viewportScroller.scrollToPosition([0, 0]);
    });
  }

  navigateToCategory(categoryName: string): void {
    this.router.navigate(['/menu'], { queryParams: { category: categoryName } }).then(() => {
      this.viewportScroller.scrollToPosition([0, 0]);
    });
  }

  navigateToMenu(): void {
    // Navigate to menu with the first category (الفطار - Breakfast) selected by default
    this.router.navigate(['/menu'], { queryParams: { category: 'الفطار' } }).then(() => {
      this.viewportScroller.scrollToPosition([0, 0]);
    });
  }
}

