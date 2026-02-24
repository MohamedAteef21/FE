import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cart, CartItem, ProductVariant } from '../../models/menu-item.model';
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

  addItem(menuItem: MenuItem, quantity: number = 1, variant?: ProductVariant): void {
    const cart = this.cartSubject.value;
    const itemPrice = variant ? variant.price : menuItem.price;
    
    // Find existing item with same menuItem and variant (if variant exists)
    const existingItemIndex = cart.items.findIndex(item => {
      const sameMenuItem = item.menuItem.id === menuItem.id;
      const sameVariant = variant 
        ? (item.selectedVariant?.id === variant.id)
        : (!item.selectedVariant);
      return sameMenuItem && sameVariant;
    });

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
      cart.items[existingItemIndex].subtotal = 
        cart.items[existingItemIndex].quantity * itemPrice;
    } else {
      cart.items.push({
        menuItem,
        quantity,
        subtotal: itemPrice * quantity,
        selectedVariant: variant
      });
    }

    this.updateCart(cart);
  }

  removeItem(menuItemId: string, variantId?: number | null): void {
    const cart = this.cartSubject.value;
    // Normalize variantId: treat null/undefined as no variant
    const hasVariant = variantId !== undefined && variantId !== null;
    cart.items = cart.items.filter(item => {
      const sameMenuItem = item.menuItem.id === menuItemId;
      if (hasVariant) {
        // Remove item with matching menuItemId and variantId
        return !(sameMenuItem && item.selectedVariant?.id === variantId);
      } else {
        // Remove item with matching menuItemId and no variant
        return !(sameMenuItem && !item.selectedVariant);
      }
    });
    this.updateCart(cart);
  }

  updateQuantity(menuItemId: string, quantity: number, variantId?: number | null): void {
    if (quantity <= 0) {
      this.removeItem(menuItemId, variantId);
      return;
    }

    const cart = this.cartSubject.value;
    // Normalize variantId: treat null/undefined as no variant
    const hasVariant = variantId !== undefined && variantId !== null;
    const item = cart.items.find(item => {
      const sameMenuItem = item.menuItem.id === menuItemId;
      const sameVariant = hasVariant
        ? (item.selectedVariant?.id === variantId)
        : (!item.selectedVariant);
      return sameMenuItem && sameVariant;
    });

    if (item) {
      item.quantity = quantity;
      const itemPrice = item.selectedVariant ? item.selectedVariant.price : item.menuItem.price;
      item.subtotal = itemPrice * quantity;
      this.updateCart(cart);
    }
  }

  clearCart(): void {
    const cart = this.getInitialCart();
    // Remove cart from localStorage to clear cached data
    localStorage.removeItem(this.CART_KEY);
    // Update cart totals and notify subscribers without saving to storage
    cart.subtotal = 0;
    cart.tax = 0;
    cart.deliveryFee = 0;
    cart.total = 0;
    this.cartSubject.next(cart);
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
    if (cart.items.length === 0) {
      // Remove from localStorage when cart is empty to clear cached data
      localStorage.removeItem(this.CART_KEY);
    } else {
      localStorage.setItem(this.CART_KEY, JSON.stringify(cart.items));
    }
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

