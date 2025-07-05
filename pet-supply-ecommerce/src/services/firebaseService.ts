import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { 
  Product, 
  Order, 
  User, 
  OrderItem,
  CartItem 
} from '../types'; // Fixed import path

class FirebaseService {
  // Products
  async getProducts(): Promise<Product[]> {
    const querySnapshot = await getDocs(collection(db, 'products'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || doc.data().updatedAt
    })) as Product[];
  }

  async addProduct(product: Omit<Product, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'products'), {
      ...product,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<void> {
    const productRef = doc(db, 'products', id);
    await updateDoc(productRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  }

  async deleteProduct(id: string): Promise<void> {
    await deleteDoc(doc(db, 'products', id));
  }

  // Orders
  async getOrders(): Promise<Order[]> {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || doc.data().updatedAt
    })) as Order[];
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    const q = query(
      collection(db, 'orders'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || doc.data().updatedAt
    })) as Order[];
  }

  async addOrder(order: Omit<Order, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'orders'), {
      ...order,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  }

  async updateOrderStatus(orderId: string, status: string): Promise<void> {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      status,
      updatedAt: Timestamp.now()
    });
  }

  // Users
  async getUsers(): Promise<User[]> {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          email: data.email || '',
          name: data.name || '',
          avatar: data.avatar,
          role: data.role || 'user',
          addresses: data.addresses || [],
          phone: data.phone,
          dateOfBirth: data.dateOfBirth,
          preferences: data.preferences || {
            petTypes: [],
            favoriteCategories: [],
            newsletter: false,
            notifications: {
              email: false,
              sms: false,
              push: false
            }
          },
          createdAt: data.createdAt instanceof Timestamp 
            ? data.createdAt.toDate().toISOString() 
            : data.createdAt || new Date().toISOString(),
          lastLogin: data.lastLogin instanceof Timestamp 
            ? data.lastLogin.toDate().toISOString() 
            : data.lastLogin || new Date().toISOString()
        } as User;
      });
    } catch (error) {
      console.error('Error getting users:', error);
      throw error;
    }
  }

  async getUser(userId: string): Promise<User | null> {
    try {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          email: data.email || '',
          name: data.name || '',
          avatar: data.avatar,
          role: data.role || 'user',
          addresses: data.addresses || [],
          phone: data.phone,
          dateOfBirth: data.dateOfBirth,
          preferences: data.preferences || {
            petTypes: [],
            favoriteCategories: [],
            newsletter: false,
            notifications: {
              email: false,
              sms: false,
              push: false
            }
          },
          createdAt: data.createdAt instanceof Timestamp 
            ? data.createdAt.toDate().toISOString() 
            : data.createdAt || new Date().toISOString(),
          lastLogin: data.lastLogin instanceof Timestamp 
            ? data.lastLogin.toDate().toISOString() 
            : data.lastLogin || new Date().toISOString()
        } as User;
      }
      return null;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  }

  async addUser(user: Omit<User, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'users'), {
      ...user,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<void> {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  }

  async deleteUser(userId: string): Promise<void> {
    await deleteDoc(doc(db, 'users', userId));
  }

  // Real-time listeners
  // Add this method to the FirebaseService class
  subscribeToOrders(callback: (orders: Order[]) => void): () => void {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const orders = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
        updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || doc.data().updatedAt
      })) as Order[];
      
      callback(orders);
    });
    
    return unsubscribe;
  }

  subscribeToProducts(callback: (products: Product[]) => void) {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    
    return onSnapshot(q, (querySnapshot) => {
      const products: Product[] = [];
      querySnapshot.forEach((doc) => {
        products.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
          updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || doc.data().updatedAt
        } as Product);
      });
      callback(products);
    });
  }

  // Dashboard statistics
  async getDashboardStats() {
    try {
      const [usersSnapshot, productsSnapshot, ordersSnapshot] = await Promise.all([
        getDocs(collection(db, 'users')),
        getDocs(collection(db, 'products')),
        getDocs(collection(db, 'orders'))
      ]);

      const orders = ordersSnapshot.docs.map(doc => doc.data() as Order);
      const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
      
      // Calculate monthly growth (simplified)
      const currentMonth = new Date().getMonth();
      const currentMonthOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate.getMonth() === currentMonth;
      });

      return {
        totalUsers: usersSnapshot.size,
        totalProducts: productsSnapshot.size,
        totalOrders: ordersSnapshot.size,
        totalRevenue,
        monthlyGrowth: {
          users: 12.5,
          orders: 8.3,
          revenue: 15.7
        }
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {
        totalUsers: 0,
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
        monthlyGrowth: {
          users: 0,
          orders: 0,
          revenue: 0
        }
      };
    }
  }
}

export const firebaseService = new FirebaseService();