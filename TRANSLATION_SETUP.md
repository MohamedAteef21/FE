# Translation and RTL Setup Guide

## Features Implemented

1. ✅ **ngx-translate Integration**: Full i18n support with ngx-translate
2. ✅ **Arabic & English Support**: Two language JSON files (ar.json, en.json)
3. ✅ **RTL/LTR Direction Switching**: Automatic direction change for Arabic
4. ✅ **Language Switcher in Navbar**: Dropdown menu to switch languages
5. ✅ **PDF Download Button**: Button to download PDF from assets folder

## Installation

After updating package.json, run:
```bash
npm install
```

This will install:
- `@ngx-translate/core` - Core translation functionality
- `@ngx-translate/http-loader` - HTTP loader for JSON translation files

## Translation Files

Translation files are located in `src/assets/i18n/`:
- `en.json` - English translations
- `ar.json` - Arabic translations

### Adding New Translations

1. Add the key-value pair to both `en.json` and `ar.json`
2. Use the translate pipe in templates: `{{ 'KEY' | translate }}`
3. Or use TranslateService in components: `this.translate.get('KEY')`

## RTL Support

The application automatically switches to RTL when Arabic is selected:
- HTML `dir` attribute is set to `rtl`
- Body class `rtl` is added
- CSS rules in `styles.scss` handle RTL-specific styling

### RTL Styling

RTL-specific styles are in `src/styles.scss`:
- Toolbar direction reversed
- Navigation links reversed
- Form fields right-aligned
- Cards right-aligned

## PDF Download Setup

1. Place your PDF file in `src/assets/` folder
2. Name it `menu.pdf` (or update the path in `public-layout.component.ts`)
3. The download button will trigger the download

### To Change PDF File:
Update the `downloadPDF()` method in `public-layout.component.ts`:
```typescript
downloadPDF(): void {
  const link = this.document.createElement('a');
  link.href = 'assets/your-file.pdf'; // Change this
  link.download = 'your-file.pdf'; // Change this
  link.click();
}
```

## Usage in Components

### Using Translate Pipe in Templates

```html
<h1>{{ 'HOME.TITLE' | translate }}</h1>
<p>{{ 'HOME.SUBTITLE' | translate }}</p>
```

### Using TranslateService in Components

```typescript
import { TranslateService } from '@ngx-translate/core';

constructor(private translate: TranslateService) {}

getTranslation() {
  this.translate.get('HOME.TITLE').subscribe((res: string) => {
    console.log(res);
  });
}
```

### Changing Language Programmatically

```typescript
import { TranslationService } from '../core/services/translation.service';

constructor(private translationService: TranslationService) {}

setLanguage(lang: string) {
  this.translationService.setLanguage(lang);
}
```

## Language Switcher

The language switcher is in the navbar (public-layout.component.ts):
- Click the language icon
- Select English or Arabic
- The app will switch language and direction automatically

## Current Translation Keys

### Navigation (NAV)
- HOME, MENU, ABOUT, CONTACT, ADMIN, CART

### Home (HOME)
- TITLE, SUBTITLE, FEATURED_ITEMS, SPECIAL_OFFERS

### Menu (MENU)
- TITLE, ADD_TO_CART, NOT_AVAILABLE

### Cart (CART)
- TITLE, EMPTY_CART, BROWSE_MENU, SUBTOTAL, TAX, DELIVERY_FEE, TOTAL, CHECKOUT

### Contact (CONTACT)
- All form labels and messages

### Footer (FOOTER)
- COPYRIGHT, PRIVACY_POLICY, TERMS_OF_SERVICE

### Language (LANGUAGE)
- ENGLISH, ARABIC

### Download (DOWNLOAD)
- PDF, MENU_PDF

## Next Steps

1. Add more translation keys as needed
2. Update components to use translate pipe
3. Add PDF file to assets folder
4. Test RTL layout with Arabic content
5. Customize RTL styles if needed

## Notes

- Language preference is saved in localStorage
- Default language is English
- RTL is automatically applied for Arabic
- All Material components support RTL by default

