// ─── Enums (match the C# backend exactly) ────────────────────────────────────

export enum OrderStatus {
  Pending       = 1,
  Confirmed     = 2,
  Preparing     = 3,
  Ready         = 4,
  OutForDelivery = 5,
  Delivered     = 6,
  Cancelled     = 7,
}

export enum PaymentMethod {
  Cash = 1,
  Visa = 2,
}

export enum PaymentStatus {
  Pending = 1,
  Paid    = 2,
  Failed  = 3,
}

export enum OrderType {
  Pickup   = 1,
  Delivery = 2,
}

// ─── Request ─────────────────────────────────────────────────────────────────

export interface CreateOrderItemRequest {
  productId:  number;
  variantId:  number;
  quantity:   number;
  unitPrice:  number;
  totalPrice: number;
  notes:      string;
}

export interface CreateOrderRequest {
  branchId:       number;
  cityId:         number;
  districtId:     number;
  areaId:         number;
  orderType:      number;   // OrderType enum value
  paymentMethod:  number;   // PaymentMethod enum value
  paymentStatus:  number;   // PaymentStatus enum value
  orderStatus:    number;   // OrderStatus enum value
  deliveryFees:   number;
  discountAmount: number;
  totalAmount:    number;
  couponCode:     string;
  orderFutureDate?: string | null; // ISO date string (e.g., "2026-02-18T05:34:13.760Z") or null for "today"
  userId?:        number;   // User ID if user is logged in
  customerName?:  string;  // Customer name for guest orders
  customerEmail?: string;  // Customer email for guest orders
  customerPhone?: string;  // Customer phone for guest orders
  items:          CreateOrderItemRequest[];
}

// ─── Response ────────────────────────────────────────────────────────────────

export interface OrderResponse {
  id:            number;
  orderNumber:   string;
  orderStatus:   number;
  paymentStatus: number;
  totalAmount:   number;
  createdAt:     string;
}

// ─── My Orders API Response ──────────────────────────────────────────────────

export interface OrderItemResponse {
  id:          string;
  productId:   number;
  productName: string;      // Fallback if productNameAr/productNameEn not available
  productNameAr?: string;
  productNameEn?: string;
  variantName: string;      // Fallback if variantNameAr/variantNameEn not available
  variantNameAr?: string;
  variantNameEn?: string;
  quantity:    number;
  unitPrice:   number;
  totalPrice:  number;
  notes:       string;
}

export interface MyOrderResponse {
  id:             string;
  orderNumber:    string;
  userId:         string;
  customerName?:  string;  // Customer name if available from API
  customerEmail?: string;  // Customer email if available from API
  customerPhone?: string;  // Customer phone if available from API
  branchId:       number;
  branchName:     string;      // Fallback if branchNameAr/branchNameEn not available
  branchNameAr?:  string;
  branchNameEn?:  string;
  orderType:      number | string;   // OrderType enum (1=Pickup, 2=Delivery) - can be number or string from API
  paymentMethod:  number | string;   // PaymentMethod enum (1=Cash, 2=Visa) - can be number or string from API
  paymentStatus:  number | string;   // PaymentStatus enum (1=Pending, 2=Paid, 3=Failed) - can be number or string from API
  orderStatus:    number | string;   // OrderStatus enum (1-7) - can be number or string from API
  totalAmount:    number;
  discountAmount: number;
  deliveryFee:    number;
  finalAmount:    number;
  cityId:         number;
  cityName:       string;      // Fallback if cityNameAr/cityNameEn not available
  cityNameAr?:    string;
  cityNameEn?:    string;
  districtId:     number;
  districtName:   string;      // Fallback if districtNameAr/districtNameEn not available
  districtNameAr?: string;
  districtNameEn?: string;
  areaId:         number;
  areaName:       string;      // Fallback if areaNameAr/areaNameEn not available
  areaNameAr?:    string;
  areaNameEn?:    string;
  createdDate:    string;
  items:          OrderItemResponse[];
}
