import { MenuItem, Category } from '../../models/menu-item.model';
import { TranslationService } from '../services/translation.service';

/**
 * Adds isArabicLang property to menu items based on current language
 */
export function addLanguageProperty<T extends MenuItem | Category>(
  items: T[],
  translationService: TranslationService
): T[] {
  const isArabicLang = translationService.isArabicLang();
  return items.map(item => ({
    ...item,
    isArabicLang
  }));
}

/**
 * Gets the display name for an item based on current language
 */
export function getDisplayName(item: MenuItem | Category): string {
  if (item.isArabicLang) {
    return item.name;
  }
  return item.nameEn || item.name;
}

/**
 * Gets the display description for an item based on current language
 */
export function getDisplayDescription(item: MenuItem | Category): string {
  if (item.isArabicLang) {
    return item.description || '';
  }
  return item.descriptionEn || item.description || '';
}

