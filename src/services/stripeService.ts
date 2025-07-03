import { firebaseService } from './firebaseService';
import { Order, CartItem } from '../../pet-supply-ecommerce/src/types/index';

interface StripeCheckoutData {
  items: CartItem[];
  userId: string;
  shippingAddress: any;
  total: number;
}

export class StripeService {
  async createCheckoutSession(data: StripeCheckoutData) {
    try {
      // Create order in Firebase first
      const orderData: Omit<Order, 'id'> = {
        userId: data.userId,
        items: data.items.map(item => ({
          id: item.id,
          productId: item.product.id,
          productName: item.product.name,
          productImage: item.product.images[0],
          quantity: item.quantity,
          price: item.product.price,
          total: item.product.price * item.quantity
        })),
        subtotal: data.total,
        tax: 0,
        shipping: 0,
        total: data.total,
        status: 'pending',
        shippingAddress: data.shippingAddress,
        paymentMethod: 'stripe',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const orderId = await firebaseService.addOrder(orderData);
      
      // Redirect to Stripe (you'll need to implement Stripe Checkout)
      // For now, simulate successful payment
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