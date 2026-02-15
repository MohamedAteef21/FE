# Restaurant Website - Angular 17+ Project

A production-ready Angular 17+ application for a restaurant website with public-facing pages and an admin dashboard.

## Project Structure

```
src/
├── app/
│   ├── core/                          # Core module (singleton services, interceptors, guards)
│   │   ├── guards/                    # Route guards
│   │   │   ├── auth.guard.ts         # Authentication guard
│   │   │   └── admin.guard.ts        # Admin role guard
│   │   ├── interceptors/             # HTTP interceptors
│   │   │   ├── jwt.interceptor.ts    # JWT token interceptor
│   │   │   └── error.interceptor.ts  # Error handling interceptor
│   │   ├── services/                  # Core services
│   │   │   ├── auth.service.ts       # Authentication service
│   │   │   └── cart.service.ts       # Shopping cart service
│   │   └── core.module.ts            # Core module definition
│   │
│   ├── shared/                         # Shared module (reusable components, pipes, directives)
│   │   ├── components/                # Shared components
│   │   │   ├── loading-spinner/      # Loading spinner component
│   │   │   └── error-message/        # Error message component
│   │   ├── directives/                # Shared directives
│   │   │   └── click-outside.directive.ts
│   │   ├── pipes/                     # Shared pipes
│   │   │   └── currency.pipe.ts      # Currency formatting pipe
│   │   └── shared.module.ts          # Shared module definition
│   │
│   ├── features/                       # Feature modules (lazy loaded)
│   │   ├── public/                    # Public website features
│   │   │   ├── home/                 # Home page
│   │   │   ├── menu/                 # Menu page
│   │   │   ├── item-details/         # Item details page
│   │   │   ├── cart/                 # Shopping cart
│   │   │   ├── about/                 # About us page
│   │   │   ├── contact/               # Contact us page
│   │   │   ├── public.module.ts      # Public module
│   │   │   └── public-routing.module.ts
│   │   │
│   │   ├── auth/                       # Authentication feature
│   │   │   ├── login/                 # Login component
│   │   │   ├── auth.module.ts        # Auth module
│   │   │   └── auth-routing.module.ts
│   │   │
│   │   └── admin/                      # Admin dashboard (protected)
│   │       ├── layout/                 # Admin layout component
│   │       ├── dashboard/             # Dashboard overview
│   │       ├── menu-management/       # Menu CRUD operations
│   │       ├── order-management/      # Order management
│   │       ├── settings/              # Application settings
│   │       ├── admin.module.ts       # Admin module
│   │       └── admin-routing.module.ts
│   │
│   ├── layout/                         # Layout components
│   │   └── public-layout.component.ts # Public website layout
│   │
│   ├── models/                         # TypeScript interfaces/models
│   │   ├── auth.model.ts              # Authentication models
│   │   ├── menu-item.model.ts         # Menu item & cart models
│   │   ├── order.model.ts             # Order models
│   │   └── settings.model.ts          # Settings models
│   │
│   ├── app.component.ts               # Root component
│   ├── app.module.ts                  # Root module
│   └── app-routing.module.ts          # Root routing configuration
│
├── environments/                       # Environment configuration
│   ├── environment.ts                 # Development environment
│   └── environment.prod.ts            # Production environment
│
├── assets/                             # Static assets (images, fonts, etc.)
├── styles.scss                         # Global styles
├── index.html                          # HTML entry point
└── main.ts                             # Application entry point
```

## Architecture Overview

### Feature-Based Modular Architecture

The application follows a feature-based modular architecture with clear separation of concerns:

1. **Core Module**: Contains singleton services, interceptors, and guards that are used application-wide
2. **Shared Module**: Contains reusable components, pipes, and directives shared across features
3. **Feature Modules**: Self-contained modules for specific features (public, auth, admin)

### Lazy Loading

All feature modules are lazy-loaded to improve initial load time:
- Public module: Loaded on initial route
- Auth module: Loaded when accessing `/login`
- Admin module: Loaded when accessing `/admin` (protected)

### Routing Structure

#### Public Routes (No Authentication Required)
- `/` - Home page
- `/menu` - Menu listing
- `/item/:id` - Item details
- `/cart` - Shopping cart
- `/about` - About us
- `/contact` - Contact us

#### Authentication Routes
- `/login` - Admin login page

#### Admin Routes (Authentication + Admin Role Required)
- `/admin` - Admin dashboard (redirects to `/admin/dashboard`)
- `/admin/dashboard` - Dashboard overview
- `/admin/menu` - Menu management
- `/admin/orders` - Order management
- `/admin/settings` - Application settings

## Key Features

### Public Website
- **Home Page**: Displays featured menu items and offers
- **Menu Page**: Browse menu items by category
- **Item Details**: View detailed information about menu items
- **Shopping Cart**: Add/remove items, update quantities, calculate totals
- **About & Contact**: Static information pages

### Authentication
- JWT-based authentication
- Role-based access control (Admin only)
- Protected routes using guards
- HTTP interceptor for automatic token attachment

### Admin Dashboard
- **Dashboard**: Overview statistics and recent orders
- **Menu Management**: CRUD operations for categories and menu items
- **Order Management**: View and update order statuses
- **Settings**: Configure tax rates, delivery fees, and restaurant information

## Services

### AuthService
- Handles user authentication
- Manages JWT tokens
- Provides user information and role checking
- Logout functionality

### CartService
- Manages shopping cart state
- Calculates subtotal, tax, delivery fee, and total
- Persists cart to localStorage
- Observable-based for reactive updates

## Guards

### AuthGuard
- Protects routes requiring authentication
- Redirects to login if not authenticated

### AdminGuard
- Protects admin routes
- Requires both authentication and admin role
- Redirects to login if not authorized

## Interceptors

### JwtInterceptor
- Automatically attaches JWT token to HTTP requests
- Adds `Authorization: Bearer <token>` header

### ErrorInterceptor
- Handles HTTP errors globally
- Automatically logs out on 401 (Unauthorized) errors

## Environment Configuration

Environment files are located in `src/environments/`:
- `environment.ts`: Development configuration
- `environment.prod.ts`: Production configuration

Configure API URLs and other environment-specific settings here.

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
   - Update `src/environments/environment.ts` with your API URL
   - Update `src/environments/environment.prod.ts` for production

3. Start development server:
```bash
npm start
```

4. Build for production:
```bash
npm run build
```

## Best Practices

### Scalability
1. **Feature Modules**: Each feature is self-contained and can be developed independently
2. **Lazy Loading**: Reduces initial bundle size
3. **Shared Module**: Prevents code duplication
4. **Core Module**: Ensures singleton services are properly managed

### Code Organization
1. **Models**: Centralized type definitions for better type safety
2. **Services**: Business logic separated from components
3. **Guards**: Route protection logic centralized
4. **Interceptors**: Cross-cutting concerns handled globally

### Security
1. **JWT Tokens**: Stored in localStorage (consider httpOnly cookies for production)
2. **Route Guards**: Protect sensitive routes
3. **Role-Based Access**: Admin routes require admin role
4. **Error Handling**: Global error interceptor handles unauthorized access

### Performance
1. **Lazy Loading**: Features loaded on demand
2. **OnPush Change Detection**: Consider using for better performance
3. **Observable Patterns**: Reactive programming for efficient updates
4. **Image Optimization**: Implement lazy loading for images

## Next Steps

1. **Backend Integration**: Connect to your backend API
2. **Image Upload**: Implement image upload functionality for menu items
3. **Checkout Flow**: Complete the checkout process
4. **Order Tracking**: Add order tracking for customers
5. **Notifications**: Implement real-time notifications
6. **Testing**: Add unit and e2e tests
7. **Error Handling**: Enhance error messages and user feedback
8. **Loading States**: Add loading indicators for better UX

## Technologies Used

- Angular 17+
- Angular Material
- RxJS
- TypeScript
- SCSS

## License

This project is proprietary and confidential.

