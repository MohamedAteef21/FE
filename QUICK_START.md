# Quick Start Guide

## Project Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Update `src/environments/environment.ts` with your API URL:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api', // Your API URL
  appName: 'Restaurant Website'
};
```

### 3. Start Development Server

```bash
npm start
```

The application will be available at `http://localhost:4200`

## Project Structure Summary

```
src/app/
├── core/              # Singleton services, guards, interceptors
├── shared/            # Reusable components, pipes, directives
├── features/          # Feature modules (lazy loaded)
│   ├── public/       # Public website
│   ├── auth/         # Authentication
│   └── admin/        # Admin dashboard
├── layout/           # Layout components
├── models/           # TypeScript interfaces
└── app.module.ts     # Root module
```

## Key Routes

### Public Routes (No Auth Required)
- `/` - Home page
- `/menu` - Menu listing
- `/item/:id` - Item details
- `/cart` - Shopping cart
- `/about` - About us
- `/contact` - Contact us

### Authentication
- `/login` - Admin login

### Admin Routes (Auth + Admin Role Required)
- `/admin/dashboard` - Dashboard
- `/admin/menu` - Menu management
- `/admin/orders` - Order management
- `/admin/settings` - Settings

## Key Services

### AuthService
- `login(credentials)` - Authenticate user
- `logout()` - Logout user
- `isAuthenticated()` - Check auth status
- `isAdmin()` - Check admin role
- `getToken()` - Get JWT token

### CartService
- `addItem(item, quantity)` - Add to cart
- `removeItem(itemId)` - Remove from cart
- `updateQuantity(itemId, quantity)` - Update quantity
- `cart$` - Observable for cart updates

## Next Steps

1. **Backend Integration**: Update API endpoints in services
2. **Image Upload**: Implement image upload for menu items
3. **Checkout**: Complete checkout flow
4. **Testing**: Add unit and e2e tests
5. **Styling**: Customize Material theme
6. **Error Handling**: Enhance error messages

## Important Notes

- All feature modules are lazy-loaded
- JWT tokens are stored in localStorage
- Admin routes are protected by AdminGuard
- Cart state persists in localStorage
- All HTTP requests automatically include JWT token via interceptor

## Troubleshooting

### Module Not Found Errors
- Ensure all dependencies are installed: `npm install`
- Check that Angular Material is properly installed

### Routing Issues
- Verify routes are correctly configured in routing modules
- Check that guards are properly applied

### Authentication Issues
- Verify API endpoints return correct JWT format
- Check that token is being stored correctly
- Ensure interceptor is properly configured

## Development Tips

1. Use Angular DevTools for debugging
2. Check browser console for errors
3. Verify API responses match expected models
4. Test guards by accessing protected routes
5. Use RxJS operators for complex async operations

