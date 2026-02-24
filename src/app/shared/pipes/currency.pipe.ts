import { Pipe, PipeTransform, Inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'currency',
  standalone: true
})
export class CurrencyPipe implements PipeTransform {
  constructor(private translate: TranslateService) {}

  transform(value: number, showDecimals: boolean = false): string {
    if (value == null || isNaN(value)) {
      return showDecimals ? '0.00' : '0';
    }

    const currentLang = this.translate.currentLang || 'ar';
    
    // Format number with or without decimals
    const formattedNumber = showDecimals
      ? value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : value.toLocaleString('en-US');
    
    // Set currency symbol based on language
    const currencySymbol = currentLang === 'ar' ? 'ر.ق' : 'QAR';
    
    return `${formattedNumber} ${currencySymbol}`;
  }
}

