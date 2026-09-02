import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { useProducts } from '../hooks/useProducts';
import { useCombos } from '../hooks/useContent';

export type CartItemKind = 'product' | 'combo';

interface CartItem {
  productId: string;
  quantity: number;
  kind?: CartItemKind;
}

interface CartContextValue {
  items: CartItem[];
  addToCart: (productId: string, quantity?: number, kind?: CartItemKind) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextValue | null>(null);

type CartActions = Pick<
  CartContextValue,
  'addToCart' | 'removeFromCart' | 'updateQuantity' | 'clearCart'
>;

const CartActionsContext = createContext<CartActions | null>(null);


const STORAGE_KEY = 'doc-cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { data: products = [] } = useProducts();
  const { data: combos = [] } = useCombos();
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as CartItem[];
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore parse errors
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore storage errors
    }
  }, [items]);

  const addToCart = useCallback(
    (productId: string, quantity = 1, kind: CartItemKind = 'product') => {
      if (quantity < 1) return;
      setItems((current) => {
        const existing = current.find((item) => item.productId === productId);
        if (existing) {
          return current.map((item) =>
            item.productId === productId
              ? { ...item, quantity: item.quantity + quantity, kind }
              : item
          );
        }
        return [...current, { productId, quantity, kind }];
      });
    },
    []
  );

  const removeFromCart = useCallback((productId: string) => {
    setItems((current) =>
      current.filter((item) => item.productId !== productId)
    );
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    setItems((current) =>
      current.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => {
      if (item.kind === 'combo') {
        const combo = combos.find((c) => c.id === item.productId);
        return sum + (combo ? combo.price * item.quantity : 0);
      }
      const product = products.find((p) => p.id === item.productId);
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);
  }, [items, products, combos]);

  // Stable identity: action handlers never change, so components that only
  // need them (e.g. product cards) don't re-render when the cart changes.
  const actions = useMemo(
    () => ({ addToCart, removeFromCart, updateQuantity, clearCart }),
    [addToCart, removeFromCart, updateQuantity, clearCart],
  );

  const value = useMemo(
    () => ({ items, ...actions, totalItems, subtotal }),
    [items, actions, totalItems, subtotal],
  );

  return (
    <CartActionsContext.Provider value={actions}>
      <CartContext.Provider value={value}>{children}</CartContext.Provider>
    </CartActionsContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

// Actions-only accessor with a stable reference across cart updates.
export function useCartActions() {
  const context = useContext(CartActionsContext);
  if (!context) {
    throw new Error('useCartActions must be used within a CartProvider');
  }
  return context;
}

