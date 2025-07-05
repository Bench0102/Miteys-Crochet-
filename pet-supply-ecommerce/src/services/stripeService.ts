import { firebaseService } from './firebaseService';
import { Order, CartItem, Address } from '../types'; // Fixed import path

interface StripeCheckoutData {
  items: CartItem[];
  userId: string;
  shippingAddress: Address;
  total: number;
}

export class StripeService {
  async createCheckoutSession(data: StripeCheckoutData) {
    try {
      // Calculate totals
      const subtotal = data.items.reduce((sum, item) => {
        const price = item.selectedVariant 
          ? item.product.price + item.selectedVariant.priceModifier 
          : item.product.price;
        return sum + (price * item.quantity);
      }, 0);
      
      const shipping = subtotal >= 50 ? 0 : 9.99;
      const tax = subtotal * 0.08;
      const total = subtotal + shipping + tax;

      // Create order in Firebase first
      const orderData: Omit<Order, 'id'> = {
        userId: data.userId,
        items: data.items.map(item => ({
          id: item.id,
          productId: item.product.id,
          productName: item.product.name,
          productImage: item.product.images[0] || '',
          quantity: item.quantity,
          price: item.selectedVariant 
            ? item.product.price + item.selectedVariant.priceModifier 
            : item.product.price,
          total: (item.selectedVariant 
            ? item.product.price + item.selectedVariant.priceModifier 
            : item.product.price) * item.quantity,
          variant: item.selectedVariant
        })),
        subtotal,
        tax,
        shipping,
        total,
        status: 'pending',
        paymentStatus: 'pending',
        shippingAddress: data.shippingAddress,
        paymentMethod: 'stripe',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const orderId = await firebaseService.addOrder(orderData);
      
      // In a real Stripe implementation, you would:
      // 1. Create a Stripe checkout session
      // 2. Redirect user to Stripe's hosted checkout page
      // 3. Handle webhook for payment confirmation
      
      // For demo purposes, simulate successful payment
      setTimeout(async () => {
        await firebaseService.updateOrderStatus(orderId, 'confirmed');
      }, 2000);

      return orderId;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  }
}

export const stripeService = new StripeService();