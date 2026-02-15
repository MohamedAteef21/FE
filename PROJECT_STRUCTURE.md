# Complete Project Structure

```
restaurant-website/
│
├── src/
│   ├── app/
│   │   ├── core/                                    # Core Module (Singleton Services)
│   │   │   ├── guards/
│   │   │   │   ├── auth.guard.ts                   # Authentication guard
│   │   │   │   └── admin.guard.ts                  # Admin role guard
│   │   │   ├── interceptors/
│   │   │   │   ├── jwt.interceptor.ts              # JWT token interceptor
│   │   │   │   └── error.interceptor.ts            # Error handling interceptor
│   │   │   ├── services/
│   │   │   │   ├── auth.service.ts                 # Authentication service
│   │   │   │   └── cart.service.ts                 # Shopping cart service
│   │   │   └── core.module.ts                      # Core module definition
│   │   │
│   │   ├── shared/                                 # Shared Module (Reusable Components)
│   │   │   ├── components/
│   │   │   │   ├── loading-spinner/
│   │   │   │   │   └── loading-spinner.component.ts
│   │   │   │   └── error-message/
│   │   │   │       └── error-message.component.ts
│   │   │   ├── directives/
│   │   │   │   └── click-outside.directive.ts
│   │   │   ├── pipes/
│   │   │   │   └── currency.pipe.ts
│   │   │   └── shared.module.ts                    # Shared module definition
│   │   │
│   │   ├── features/                               # Feature Modules (Lazy Loaded)
│   │   │   │
│   │   │   ├── public/                             # Public Website Feature
│   │   │   │   ├── home/
│   │   │   │   │   └── home.component.ts          # Home page with featured items
│   │   │   │   ├── menu/
│   │   │   │   │   └── menu.component.ts          # Menu listing with categories
│   │   │   │   ├── item-details/
│   │   │   │   │   └── item-details.component.ts  # Individual item details
│   │   │   │   ├── cart/
│   │   │   │   │   └── cart.component.ts          # Shopping cart
│   │   │   │   ├── about/
│   │   │   │   │   └── about.component.ts         # About us page
│   │   │   │   ├── contact/
│   │   │   │   │   └── contact.component.ts      # Contact form
│   │   │   │   ├── public.module.ts
│   │   │   │   └── public-routing.module.ts
│   │   │   │
│   │   │   ├── auth/                               # Authentication Feature
│   │   │   │   ├── login/
│   │   │   │   │   └── login.component.ts        # Admin login page
│   │   │   │   ├── auth.module.ts
│   │   │   │   └── auth-routing.module.ts
│   │   │   │
│   │   │   └── admin/                              # Admin Dashboard Feature
│   │   │       ├── layout/
│   │   │       │   └── admin-layout.component.ts # Admin layout with sidebar
│   │   │       ├── dashboard/
│   │   │       │   └── dashboard.component.ts    # Dashboard overview
│   │   │       ├── menu-management/
│   │   │       │   └── menu-management.component.ts # Menu CRUD
│   │   │       ├── order-management/
│   │   │       │   └── order-management.component.ts # Order management
│   │   │       ├── settings/
│   │   │       │   └── settings.component.ts      # Application settings
│   │   │       ├── admin.module.ts
│   │   │       └── admin-routing.module.ts
│   │   │
│   │   ├── layout/                                 # Layout Components
│   │   │   └── public-layout.component.ts          # Public website layout
│   │   │
│   │   ├── models/                                 # TypeScript Interfaces
│   │   │   ├── auth.model.ts                      # Auth types (User, Login, etc.)
│   │   │   ├── menu-item.model.ts                  # Menu, Category, Cart types
│   │   │   ├── order.model.ts                     # Order types
│   │   │   └── settings.model.ts                  # Settings types
│   │   │
│   │   ├── app.component.ts                       # Root component
│   │   ├── app.module.ts                          # Root module
│   │   └── app-routing.module.ts                 # Root routing
│   │
│   ├── environments/                              # Environment Configuration
│   │   ├── environment.ts                         # Development config
│   │   └── environment.prod.ts                    # Production config
│   │
│   ├── assets/                                     # Static Assets
│   ├── styles.scss                                 # Global Styles
│   ├── index.html                                  # HTML Entry Point
│   └── main.ts                                     # Application Entry Point
│
├── angular.json                                     # Angular CLI Configuration
├── package.json                                     # Dependencies
├── tsconfig.json                                    # TypeScript Configuration
├── tsconfig.app.json                               # App TypeScript Config
├── .gitignore                                       # Git Ignore Rules
├── README.md                                        # Project Documentation
├── ARCHITECTURE.md                                  # Architecture Details
├── QUICK_START.md                                   # Quick Start Guide
└── PROJECT_STRUCTURE.md                             # This File
```

## Module Dependencies

```
AppModule
├── CoreModule (imported once in AppModule)
├── SharedModule (imported in AppModule and feature modules)
└── Feature Modules (lazy loaded)
    ├── PublicModule
    │   └── imports SharedModule
    ├── AuthModule
    │   └── imports SharedModule
    └── AdminModule
        └── imports SharedModule
```

## Routing Hierarchy

```
AppRoutingModule (Root)
├── PublicLayoutComponent
│   └── PublicRoutingModule
│       ├── HomeComponent (/)
│       ├── MenuComponent (/menu)
│       ├── ItemDetailsComponent (/item/:id)
│       ├── CartComponent (/cart)
│       ├── AboutComponent (/about)
│       └── ContactComponent (/contact)
│
├── AuthRoutingModule
│   └── LoginComponent (/login)
│
└── AdminRoutingModule (Protected by AdminGuard)
    └── AdminLayoutComponent
        └── AdminRoutingModule
            ├── DashboardComponent (/admin/dashboard)
            ├── MenuManagementComponent (/admin/menu)
            ├── OrderManagementComponent (/admin/orders)
            └── SettingsComponent (/admin/settings)
```

## Service Dependencies

```
AuthService
├── Used by: LoginComponent, Guards, Interceptors
├── Manages: JWT tokens, User state
└── Provides: Authentication, Authorization checks

CartService
├── Used by: MenuComponent, ItemDetailsComponent, CartComponent
├── Manages: Shopping cart state
└── Provides: Cart operations, calculations
```

## Guard Protection

```
Public Routes: No protection
├── /, /menu, /item/:id, /cart, /about, /contact

Auth Routes: No protection (public login)
└── /login

Admin Routes: Protected by AdminGuard
├── Requires: Authentication + Admin Role
└── Routes: /admin/* (all admin routes)
```

## Interceptor Chain

```
HTTP Request
├── JwtInterceptor (adds Authorization header)
└── ErrorInterceptor (handles errors, 401 logout)
```

## State Management

```
Authentication State
└── AuthService (BehaviorSubject)
    ├── currentUser$ (Observable<User>)
    └── Token (localStorage)

Cart State
└── CartService (BehaviorSubject)
    └── cart$ (Observable<Cart>)
    └── Cart Items (localStorage)
```

