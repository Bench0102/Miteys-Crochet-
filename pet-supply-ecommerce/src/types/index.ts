export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: ProductCategory;
  subcategory?: string;
  brand: string;
  stock: number;
  rating: number;
  reviewCount: number;
  reviews: Review[];
  petType: PetType[];
  tags: string[];
  specifications: { [key: string]: string };
  isOnSale: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ProductCategory = 
  | 'food' 
  | 'toys' 
  | 'accessories' 
  | 'health' 
  | 'grooming' 
  | 'beds' 
  | 'carriers' 
  | 'training';

export type PetType = 
  | 'dog' 
  | 'cat' 
  | 'bird' 
  | 'fish' 
  | 'rabbit' 
  | 'hamster' 
  | 'reptile' 
  | 'all';

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  helpful: number;
  verified: boolean;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'user' | 'admin';
  address: Address;  // Changed from addresses: Address[]
  phone?: string;
  dateOfBirth?: string;
  preferences?: UserPreferences;  // Made optional
  createdAt: string;
  lastLogin?: string;  // Made optional
}

export interface UserPreferences {
  petTypes: PetType[];
  favoriteCategories: ProductCategory[];
  newsletter: boolean;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

export interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  name: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedVariant?: ProductVariant;
  addedAt: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  value: string;
  priceModifier: number;
  stockModifier: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount?: number;  // Made optional
  total: number;
  status: OrderStatus;
  paymentStatus?: PaymentStatus;  // Made optional
  shippingAddress: Address;
  billingAddress?: Address;  // Made optional
  paymentMethod: string;  // Added this field
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  total: number;
  variant?: ProductVariant;
}

export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'processing' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled' 
  | 'refunded';

export type PaymentStatus = 
  | 'pending' 
  | 'paid' 
  | 'failed' 
  | 'refunded';

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  loading: boolean;
  isAuthenticated: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export interface LoginData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity: number, variant?: ProductVariant) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export interface FilterOptions {
  category?: ProductCategory;
  petType?: PetType;
  priceRange?: [number, number];
  brand?: string;
  rating?: number;
  inStock?: boolean;
  onSale?: boolean;
}

export interface SortOptions {
  field: 'name' | 'price' | 'rating' | 'createdAt';
  direction: 'asc' | 'desc';
}