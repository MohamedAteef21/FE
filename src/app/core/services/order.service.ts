import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  CreateOrderRequest,
  OrderResponse,
  MyOrderResponse,
  OrderStatus,
  OrderType,
  PaymentMethod,
  PaymentStatus,
} from '../../models/order.model';
import { CityWithDetails } from '../../models/location.model';
import { ApiResponse, ApiPagedResponse, PagedResponse } from '../../models/api-response.model';
import { AuthService } from './auth.service';
import { Cart } from '../../models/menu-item.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly ORDERS_URL = `${environment.apiUrl}/Orders`;
  private readonly CITIES_URL = `${environment.apiUrl}/Cities/with-details`;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  // ─── Cities ────────────────────────────────────────────────────────────────

  /**
   * Fetch all cities with their districts and areas.
   * GET /api/Cities/with-details
   */
  getCitiesWithDetails(): Observable<CityWithDetails[]> {
    return this.http
      .get<ApiResponse<CityWithDetails[]>>(this.CITIES_URL)
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw new Error(response.message || 'Failed to load cities');
          }
          return response.data;
        }),
        catchError(error => {
          console.error('Cities API error:', error);
          return throwError(() => error);
        }),
      );
  }

  // ─── Orders ────────────────────────────────────────────────────────────────

  /**
   * Submit a new order.
   * POST /api/Orders  (authenticated — Bearer token is attached automatically)
   *
   * @param deliveryMethod  'home' | 'pickup'
   * @param paymentMethod   'cash' | 'visa'
   * @param cityId          Numeric ID from the Cities API
   * @param districtId      Numeric ID from the Cities API
   * @param areaId          Numeric ID from the Cities API (0 if not selected)
   * @param deliveryFees    Taken from the selected city's deliveryFees field
   * @param cart            Current cart snapshot
   * @param discount        Applied discount amount
   * @param couponCode      Coupon / discount code string
   */
  createOrder(
    deliveryMethod: string,
    paymentMethod:  string,
    cityId:         number,
    districtId:     number,
    areaId:         number,
    deliveryFees:   number,
    cart:           Cart,
    discount:       number,
    couponCode:     string,
    orderFutureDate?: string, // ISO date string (optional)
    token?: string, // Optional token (for newly registered users)
    customerName?:  string,  // Customer name for guest orders
    customerEmail?: string,  // Customer email for guest orders
    customerPhone?: string,  // Customer phone for guest orders
  ): Observable<ApiResponse<OrderResponse>> {
    const authToken = token || this.authService.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    });

    const orderType    = deliveryMethod === 'pickup' ? OrderType.Pickup    : OrderType.Delivery;
    const payment      = paymentMethod  === 'visa'   ? PaymentMethod.Visa  : PaymentMethod.Cash;
    const paymentStatus = PaymentStatus.Pending;   // Gateway will update on completion

    const finalTotal = cart.subtotal + deliveryFees - discount;

    const body: CreateOrderRequest = {
      branchId:       1,
      cityId,
      districtId,
      areaId,
      orderType,
      paymentMethod:  payment,
      paymentStatus,
      orderStatus:    OrderStatus.Pending,
      deliveryFees,
      discountAmount: discount,
      totalAmount:    finalTotal > 0 ? finalTotal : 0,
      couponCode:     couponCode || '',
      ...(orderFutureDate && { orderFutureDate }),
      ...(customerName && { customerName }),
      ...(customerEmail && { customerEmail }),
      ...(customerPhone && { customerPhone }),
      items: cart.items.map(item => ({
        productId:  parseInt(item.menuItem.id, 10) || 0,
        variantId:  0,
        quantity:   item.quantity,
        unitPrice:  item.menuItem.price,
        totalPrice: item.subtotal,
        notes:      '',
      })),
    };

    return this.http
      .post<ApiResponse<OrderResponse>>(this.ORDERS_URL, body, { headers })
      .pipe(
        map(response => {
          if (!response.success) {
            throw new Error(response.message || 'Order submission failed');
          }
          return response;
        }),
        catchError(error => {
          console.error('Order API error:', error);
          return throwError(() => error);
        }),
      );
  }

  /**
   * Update orderStatus and/or paymentStatus for an existing order.
   * PUT /api/Orders/{id}/status
   */
  updateOrderStatus(
    orderId: string,
    orderStatus: number,
    paymentStatus: number,
  ): Observable<ApiResponse<any>> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http
      .put<ApiResponse<any>>(
        `${this.ORDERS_URL}/${orderId}/status`,
        { status: orderStatus, paymentStatus },
        { headers },
      )
      .pipe(
        catchError(error => {
          console.error('Update order status error:', error);
          return throwError(() => error);
        }),
      );
  }

  /**
   * Get paginated list of orders for the authenticated user.
   * GET /api/Orders/my-orders?pageNumber=1&pageSize=10
   *
   * @param pageNumber Page number (1-based)
   * @param pageSize   Number of items per page
   */
  getMyOrders(pageNumber: number = 1, pageSize: number = 10): Observable<ApiPagedResponse<MyOrderResponse>> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http
      .get<ApiResponse<PagedResponse<MyOrderResponse>>>(`${this.ORDERS_URL}/my-orders`, { headers, params })
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw new Error(response.message || 'Failed to load orders');
          }
          // Convert to ApiPagedResponse format
          return {
            success: response.success,
            message: response.message,
            data: response.data,
            errors: response.errors,
          };
        }),
        catchError(error => {
          console.error('Get orders API error:', error);
          return throwError(() => error);
        }),
      );
  }
}
