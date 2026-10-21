import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('mbw_cart');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [fulfillmentMethod, setFulfillmentMethod] = useState('pickup');

  const [studentDetails, setStudentDetails] = useState(() => {
    try {
      const saved = localStorage.getItem('mbw_student_details');
      return saved ? JSON.parse(saved) : { name: '', hostelName: '', roomNumber: '', landmark: '' };
    } catch { return { name: '', hostelName: '', roomNumber: '', landmark: '' }; }
  });

  const [toastMessage, setToastMessage] = useState(null);
  const toastTimer = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }, []);

  // Persist cart
  useEffect(() => {
    localStorage.setItem('mbw_cart', JSON.stringify(cart));
  }, [cart]);

  // Persist student details
  useEffect(() => {
    localStorage.setItem('mbw_student_details', JSON.stringify(studentDetails));
  }, [studentDetails]);

  const addToCart = useCallback((product, selectedSize) => {
    const cartItemId = `${product._id}_${selectedSize || 'onesize'}`;
    setCart((prev) => {
      const existing = prev.find((i) => i.cartItemId === cartItemId);
      if (existing) {
        return prev.map((i) =>
          i.cartItemId === cartItemId ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        {
          cartItemId,
          id: product._id,
          title: product.title,
          price: product.price,
          salePrice: product.salePrice || null,
          selectedSize: selectedSize || null,
          quantity: 1,
          imageUrl: product.imageUrl,
        },
      ];
    });
    toastTimer('✅ Added to Bag');
  }, [toastTimer]);

  const removeFromCart = useCallback((cartItemId) => {
    setCart((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
  }, []);

  const updateQuantity = useCallback((cartItemId, delta) => {
    setCart((prev) =>
      prev
        .map((i) =>
          i.cartItemId === cartItemId ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i
        )
        .filter((i) => i.quantity > 0)
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const subtotal = cart.reduce(
    (sum, item) => sum + (item.salePrice || item.price) * item.quantity,
    0
  );

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        subtotal,
        isDrawerOpen,
        setIsDrawerOpen,
        fulfillmentMethod,
        setFulfillmentMethod,
        studentDetails,
        setStudentDetails,
        toastMessage,
        toastTimer,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
