# Architecture Documentation

## Overview

This document provides a detailed explanation of the Angular 17+ restaurant website architecture, including design decisions, folder structure, and best practices.

## Architecture Principles

### 1. Feature-Based Modular Architecture

The application is organized into feature modules, each representing a distinct business capability:

- **Public Module**: Customer-facing website
- **Auth Module**: Authentication functionality
- **Admin Module**: Administrative dashboard

Each feature module is:
- Self-contained with its own components, services, and routing
- Lazy-loaded for optimal performance
- Independently testable and maintainable

### 2. Core Module Pattern

The Core Module contains:
- Singleton services (AuthService, CartService)
- HTTP interceptors (JWT, Error handling)
- Route guards (AuthGuard, AdminGuard)
- Application-wide providers

**Important**: CoreModule should only be imported in AppModule to ensure singletons.

### 3. Shared Module Pattern

The Shared Module contains:
- Reusable components (LoadingSpinner, ErrorMessage)
- Shared pipes (CurrencyPipe)
- Shared directives (ClickOutsideDirective)
- Angular Material modules
- Common Angular modules (CommonModule, FormsModule, etc.)

**Best Practice**: Import SharedModule in feature modules that need shared functionality.

## Folder Structure Explained

### `/src/app/core/`

**Purpose**: Application-wide singleton services and infrastructure

**Contains**:
- `services/`: Singleton services used across the application
  - `auth.service.ts`: Manages authentication state and JWT tokens
  - `cart.service.ts`: Manages shopping cart state
- `interceptors/`: HTTP interceptors
  - `jwt.interceptor.ts`: Automatically adds JWT token to requests
  - `error.interceptor.ts`: Handles HTTP errors globally
- `guards/`: Route guards
  - `auth.guard.ts`: Protects routes requiring authentication
  - `admin.guard.ts`: Protects routes requiring admin role
- `core.module.ts`: Core module definition with providers

**Rules**:
- Only import CoreModule in AppModule
- Services should be provided in 'root' or CoreModule
- No components should be declared here

### `/src/app/shared/`

**Purpose**: Reusable components, directives, and pipes

**Contains**:
- `components/`: Shared UI components
  - `loading-spinner/`: Loading indicator
  - `error-message/`: Error display component
- `directives/`: Custom directives
  - `click-outside.directive.ts`: Detects clicks outside element
- `pipes/`: Custom pipes
  - `currency.pipe.ts`: Currency formatting
- `shared.module.ts`: Exports all shared functionality

**Rules**:
- Components should be standalone or declared in SharedModule
- Export everything that other modules might need
- Import SharedModule in feature modules

### `/src/app/features/`

**Purpose**: Feature modules representing business capabilities

#### `/features/public/`

Customer-facing website features:
- `home/`: Homepage with featured items and offers
- `menu/`: Menu browsing with categories
- `item-details/`: Individual menu item details
- `cart/`: Shopping cart management
- `about/`: About us page
- `contact/`: Contact form
- `public.module.ts`: Public module definition
- `public-routing.module.ts`: Public routes

#### `/features/auth/`

Authentication functionality:
- `login/`: Login component
- `auth.module.ts`: Auth module definition
- `auth-routing.module.ts`: Auth routes

#### `/features/admin/`

Administrative dashboard (protected):
- `layout/`: Admin layout with sidebar navigation
- `dashboard/`: Dashboard overview
- `menu-management/`: CRUD for categories and menu items
- `order-management/`: Order status management
- `settings/`: Application settings
- `admin.module.ts`: Admin module definition
- `admin-routing.module.ts`: Admin routes with guards

### `/src/app/models/`

**Purpose**: TypeScript interfaces and type definitions

**Contains**:
- `auth.model.ts`: Authentication-related types
- `menu-item.model.ts`: Menu item, category, cart types
- `order.model.ts`: Order-related types
- `settings.model.ts`: Application settings types

**Best Practice**: Centralize all type definitions for better maintainability and type safety.

### `/src/app/layout/`

**Purpose**: Layout components that wrap feature modules

**Contains**:
- `public-layout.component.ts`: Public website layout with header, footer, navigation

## Routing Architecture

### Root Routing (`app-routing.module.ts`)

```typescript
Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    loadChildren: () => import('./features/public/public.module')
  },
  {
    path: 'login',
    loadChildren: () => import('./features/auth/auth.module')
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.module')
  }
]
```

### Public Routes (`public-routing.module.ts`)

All public routes are child routes of the PublicLayoutComponent:
- `/` → HomeComponent
- `/menu` → MenuComponent
- `/item/:id` → ItemDetailsComponent
- `/cart` → CartComponent
- `/about` → AboutComponent
- `/contact` → ContactComponent

### Admin Routes (`admin-routing.module.ts`)

All admin routes are protected by AdminGuard:
- `/admin` → Redirects to `/admin/dashboard`
- `/admin/dashboard` → DashboardComponent
- `/admin/menu` → MenuManagementComponent
- `/admin/orders` → OrderManagementComponent
- `/admin/settings` → SettingsComponent

## Service Architecture

### AuthService

**Responsibilities**:
- User authentication (login/logout)
- JWT token management (storage, retrieval)
- User state management (current user, role checking)
- Session persistence

**Key Methods**:
- `login(credentials)`: Authenticate user and store token
- `logout()`: Clear authentication state
- `isAuthenticated()`: Check if user is logged in
- `isAdmin()`: Check if user has admin role
- `getToken()`: Retrieve JWT token

### CartService

**Responsibilities**:
- Shopping cart state management
- Cart calculations (subtotal, tax, delivery, total)
- Cart persistence (localStorage)
- Reactive cart updates (Observable)

**Key Methods**:
- `addItem(menuItem, quantity)`: Add item to cart
- `removeItem(itemId)`: Remove item from cart
- `updateQuantity(itemId, quantity)`: Update item quantity
- `clearCart()`: Empty cart
- `cart$`: Observable for reactive updates

## Guard Architecture

### AuthGuard

**Purpose**: Protect routes requiring authentication

**Implementation**:
- Checks if user is authenticated via AuthService
- Redirects to login if not authenticated
- Preserves return URL for redirect after login

### AdminGuard

**Purpose**: Protect admin routes

**Implementation**:
- Checks if user is authenticated
- Checks if user has admin role
- Redirects to login if not authorized

## Interceptor Architecture

### JwtInterceptor

**Purpose**: Automatically attach JWT token to HTTP requests

**Implementation**:
- Retrieves token from AuthService
- Adds `Authorization: Bearer <token>` header
- Applied to all HTTP requests automatically

### ErrorInterceptor

**Purpose**: Handle HTTP errors globally

**Implementation**:
- Catches HTTP errors
- Handles 401 (Unauthorized) by logging out user
- Can be extended for other error handling (404, 500, etc.)

## State Management

### Authentication State

Managed by AuthService using BehaviorSubject:
- Current user observable
- Token stored in localStorage
- Automatic token attachment via interceptor

### Cart State

Managed by CartService using BehaviorSubject:
- Cart observable for reactive updates
- Persisted to localStorage
- Automatic calculations on state changes

## Best Practices

### 1. Lazy Loading

All feature modules are lazy-loaded:
- Reduces initial bundle size
- Improves initial load time
- Better code splitting

### 2. Standalone Components

Modern Angular 17+ approach:
- Components can be standalone
- Reduces module dependencies
- Better tree-shaking

### 3. Type Safety

- All models defined in `/models` folder
- Strong typing throughout application
- Interfaces for API contracts

### 4. Reactive Programming

- RxJS Observables for async operations
- BehaviorSubject for state management
- Reactive forms for form handling

### 5. Separation of Concerns

- Components: Presentation logic only
- Services: Business logic
- Models: Type definitions
- Guards: Route protection
- Interceptors: Cross-cutting concerns

## Scalability Considerations

### Adding New Features

1. Create new feature module in `/features/`
2. Define feature routing
3. Add route to root routing with lazy loading
4. Implement feature components and services

### Extending Existing Features

1. Add components to appropriate feature folder
2. Update feature routing
3. Add necessary services
4. Update models if needed

### Performance Optimization

1. **Lazy Loading**: Already implemented
2. **OnPush Change Detection**: Consider for large lists
3. **Virtual Scrolling**: For long lists (menu items, orders)
4. **Image Lazy Loading**: Implement for menu item images
5. **Caching**: Consider HTTP caching strategies

## Security Considerations

1. **JWT Storage**: Currently in localStorage (consider httpOnly cookies)
2. **Route Guards**: Protect sensitive routes
3. **Role-Based Access**: Admin routes require admin role
4. **XSS Protection**: Angular's built-in sanitization
5. **CSRF Protection**: Implement if using cookies

## Testing Strategy

### Unit Tests
- Services: Test business logic
- Components: Test component behavior
- Guards: Test route protection
- Interceptors: Test HTTP modifications

### Integration Tests
- Feature modules: Test feature workflows
- Routing: Test navigation and guards

### E2E Tests
- Critical user flows
- Authentication flow
- Cart functionality
- Admin operations

## Deployment Considerations

1. **Environment Configuration**: Use environment files
2. **Build Optimization**: Production build with AOT
3. **Asset Optimization**: Minify and compress assets
4. **API Configuration**: Update API URLs for production
5. **Error Tracking**: Implement error logging service

## Future Enhancements

1. **State Management**: Consider NgRx for complex state
2. **Internationalization**: Add i18n support
3. **PWA**: Convert to Progressive Web App
4. **Real-time Updates**: WebSocket integration
5. **Advanced Search**: Search functionality for menu
6. **User Accounts**: Customer account management
7. **Reviews & Ratings**: Product reviews
8. **Payment Integration**: Payment gateway integration

