import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

/**
 * Utility function to format currency based on current language
 * @param amount - The amount to format
 * @param translateService - TranslateService instance to get current language
 * @param showDecimals - Whether to show decimal places (default: false)
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number,
  translateService: TranslateService,
  showDecimals: boolean = false
): string {
  const currentLang = translateService.currentLang || 'ar';
  
  // Format number with or without decimals
  const formattedNumber = showDecimals
    ? amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : amount.toLocaleString('en-US');
  
  // Set currency symbol based on language
  const currencySymbol = currentLang === 'ar' ? 'ر.ق' : 'QAR';
  
  return `${formattedNumber} ${currencySymbol}`;
}

