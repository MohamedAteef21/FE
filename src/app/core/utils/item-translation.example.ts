/**
 * Example: How to use isArabicLang in your services
 * 
 * When returning items from an API or service, add the isArabicLang property
 * using the addLanguageProperty utility function.
 */

import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { MenuItem, Category } from '../../models/menu-item.model';
import { TranslationService } from '../services/translation.service';
import { addLanguageProperty, getDisplayName, getDisplayDescription } from './item-translation.util';

/**
 * Example service method that returns menu items with isArabicLang property
 */
export function getMenuItemsExample(
  translationService: TranslationService
): Observable<MenuItem[]> {
  // Simulate API call
  const items: MenuItem[] = [
    {
      id: '1',
      name: 'سلطة قيصر', // Arabic name
      nameEn: 'Caesar Salad', // English name
      description: 'خس روماني طازج', // Arabic description
      descriptionEn: 'Fresh romaine lettuce', // English description
      price: 12.99,
      imageUrl: 'https://example.com/image.jpg',
      categoryId: '1',
      isAvailable: true
    }
  ];

  // Add isArabicLang property based on current language
  return of(addLanguageProperty(items, translationService));
}

/**
 * Example: Using in a component
 */
export class ExampleComponent {
  constructor(private translationService: TranslationService) {}

  getItems(): Observable<MenuItem[]> {
    return this.translationService.translate.onLangChange.pipe(
      map(() => {
        const items: MenuItem[] = [
          // Your items here
        ];
        return addLanguageProperty(items, this.translationService);
      })
    );
  }
}

/**
 * Example: In template, use conditional rendering
 * 
 * <h3>{{ item.isArabicLang ? item.name : (item.nameEn || item.name) }}</h3>
 * <p>{{ item.isArabicLang ? item.description : (item.descriptionEn || item.description) }}</p>
 * 
 * Or use the utility functions:
 * 
 * <h3>{{ getDisplayName(item) }}</h3>
 * <p>{{ getDisplayDescription(item) }}</p>
 */

