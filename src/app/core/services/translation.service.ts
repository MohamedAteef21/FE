import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private readonly LANGUAGE_KEY = 'app_language';
  private readonly RTL_LANGUAGES = ['ar'];

  constructor(
    private translate: TranslateService,
    @Inject(DOCUMENT) private document: Document
  ) {
    // Set default language first
    this.translate.setDefaultLang('en');
    
    // Get saved language or default to 'en'
    const savedLanguage = localStorage.getItem(this.LANGUAGE_KEY) || 'en';
    
    // Set direction immediately (before translations load)
    this.setDirection(savedLanguage);
    
    // Set the language - this will load translations
    this.translate.use(savedLanguage).subscribe(() => {
      localStorage.setItem(this.LANGUAGE_KEY, savedLanguage);
    }, (error) => {
      // If translation file fails to load, still save the preference
      console.warn('Translation file failed to load:', error);
      localStorage.setItem(this.LANGUAGE_KEY, savedLanguage);
    });
  }

  setLanguage(lang: string): void {
    this.translate.use(lang).subscribe(() => {
      localStorage.setItem(this.LANGUAGE_KEY, lang);
      this.setDirection(lang);
    });
  }

  getCurrentLanguage(): string {
    return this.translate.currentLang || 'en';
  }

  private setDirection(lang: string): void {
    const htmlElement = this.document.documentElement;
    const bodyElement = this.document.body;
    
    if (this.isRTL(lang)) {
      htmlElement.setAttribute('dir', 'rtl');
      htmlElement.setAttribute('lang', 'en');
      htmlElement.style.direction = 'rtl';
      bodyElement.classList.add('rtl');
      bodyElement.classList.remove('ltr');
      bodyElement.style.direction = 'rtl';
    } else {
      htmlElement.setAttribute('dir', 'ltr');
      htmlElement.setAttribute('lang', 'ar');
      htmlElement.style.direction = 'ltr';
      bodyElement.classList.add('ltr');
      bodyElement.classList.remove('rtl');
      bodyElement.style.direction = 'ltr';
    }
  }

  isRTL(lang?: string): boolean {
    const currentLang = lang || this.getCurrentLanguage();
    return currentLang === 'en';
  }

  toggleLanguage(): void {
    const currentLang = this.getCurrentLanguage();
    const newLang = currentLang === 'en' ? 'ar' : 'en';
    this.setLanguage(newLang);
  }

  isArabicLang(): boolean {
    return this.getCurrentLanguage() === 'ar';
  }
}

