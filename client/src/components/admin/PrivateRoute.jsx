import { useAdminAuth } from '../../context/AdminAuthContext';
import AdminLogin from './AdminLogin';

export default function PrivateRoute({ children }) {
  const { isAuthenticated, isLocked } = useAdminAuth();

  // 1. Unauthenticated: Standard full-screen login
  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  // 2. Authenticated & Locked: Render dashboard inputs underneath with glassmorphic lock overlay
  if (isLocked) {
    return (
      <>
        {children}
        <AdminLogin />
      </>
    );
  }

  // 3. Authenticated & Unlocked: Render protected admin routes
  return children;
}

