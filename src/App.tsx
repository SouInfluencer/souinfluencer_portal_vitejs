import { useAuth } from './contexts/AuthContext';
import { PublicRoutes } from './routes/PublicRoutes';
import { PrivateRoutes } from './routes/PrivateRoutes';
import { NotificationProvider } from './components/ui/NotificationProvider';

function App() {
  const { isAuthenticated } = useAuth();

  return (
      <NotificationProvider>
        {isAuthenticated ? <PrivateRoutes /> : <PublicRoutes />}
      </NotificationProvider>
  );
}

export default App;
