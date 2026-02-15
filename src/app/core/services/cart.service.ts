import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cart, CartItem } from '../../models/menu-item.model';
import { MenuItem } from '../../models/menu-item.model';
import { AppSettings } from '../../models/settings.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartSubject = new BehaviorSubject<Cart>(this.getInitialCart());
  public cart$ = this.cartSubject.asObservable();

  private readonly CART_KEY = 'cart_items';
  private readonly TAX_RATE = 0.1; // 10% default
  private readonly DELIVERY_FEE = 5.00; // Default delivery fee

  constructor() {
    this.loadCartFromStorage();
  }

  addItem(menuItem: MenuItem, quantity: number = 1): void {
    const cart = this.cartSubject.value;
    const existingItemIndex = cart.items.findIndex(
      item => item.menuItem.id === menuItem.id
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
      cart.items[existingItemIndex].subtotal = 
        cart.items[existingItemIndex].quantity * menuItem.price;
    } else {
      cart.items.push({
        menuItem,
        quantity,
        subtotal: menuItem.price * quantity
      });
    }

    this.updateCart(cart);
  }

  removeItem(menuItemId: string): void {
    const cart = this.cartSubject.value;
    cart.items = cart.items.filter(item => item.menuItem.id !== menuItemId);
    this.updateCart(cart);
  }

  updateQuantity(menuItemId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(menuItemId);
      return;
    }

    const cart = this.cartSubject.value;
    const item = cart.items.find(item => item.menuItem.id === menuItemId);

    if (item) {
      item.quantity = quantity;
      item.subtotal = item.menuItem.price * quantity;
      this.updateCart(cart);
    }
  }

  clearCart(): void {
    const cart = this.getInitialCart();
    this.updateCart(cart);
  }

  getCart(): Cart {
    return this.cartSubject.value;
  }

  updateSettings(settings: AppSettings): void {
    const cart = this.cartSubject.value;
    this.updateCart(cart);
  }

  private updateCart(cart: Cart): void {
    cart.subtotal = cart.items.reduce((sum, item) => sum + item.subtotal, 0);
    cart.tax = cart.subtotal * this.TAX_RATE;
    cart.deliveryFee = this.DELIVERY_FEE;
    cart.total = cart.subtotal + cart.tax + cart.deliveryFee;

    this.cartSubject.next(cart);
    this.saveCartToStorage(cart);
  }

  private getInitialCart(): Cart {
    return {
      items: [],
      subtotal: 0,
      tax: 0,
      deliveryFee: 0,
      total: 0
    };
  }

  private saveCartToStorage(cart: Cart): void {
    localStorage.setItem(this.CART_KEY, JSON.stringify(cart.items));
  }

  private loadCartFromStorage(): void {
    const storedItems = localStorage.getItem(this.CART_KEY);
    if (storedItems) {
      try {
        const items: CartItem[] = JSON.parse(storedItems);
        const cart = this.getInitialCart();
        cart.items = items;
        this.updateCart(cart);
      } catch (error) {
        console.error('Error loading cart from storage:', error);
      }
    }
  }
}

