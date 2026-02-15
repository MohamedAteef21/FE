# PDF File Setup

## Instructions

1. Place your PDF file in this directory (`src/assets/`)
2. Name it `menu.pdf` (or update the path in `public-layout.component.ts`)
3. The PDF will be accessible at: `assets/menu.pdf`

## Example

If you have a menu PDF file:
- Copy it to: `src/assets/menu.pdf`
- The download button in the navbar will work automatically

## Custom PDF Name

If you want to use a different filename, update `public-layout.component.ts`:

```typescript
downloadPDF(): void {
  const link = this.document.createElement('a');
  link.href = 'assets/your-custom-name.pdf'; // Change this
  link.download = 'your-custom-name.pdf'; // Change this
  link.click();
}
```

## Note

This README file can be deleted once you add your PDF file.

