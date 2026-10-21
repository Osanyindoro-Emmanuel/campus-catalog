import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { ThemeProvider } from './context/ThemeContext';
import { StoreConfigProvider } from './context/StoreConfigContext';
import { CatalogProvider } from './context/CatalogContext';
import { CartProvider } from './context/CartContext';
import { AdminAuthProvider } from './context/AdminAuthContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <StoreConfigProvider>
        <CatalogProvider>
          <CartProvider>
            <AdminAuthProvider>
              <App />
            </AdminAuthProvider>
          </CartProvider>
        </CatalogProvider>
      </StoreConfigProvider>
    </ThemeProvider>
  </StrictMode>
);
