import { useAuth } from './contexts/AuthContext';
import { PublicRoutes } from './routes/PublicRoutes';
import { PrivateRoutes } from './routes/PrivateRoutes';

function App() {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <PrivateRoutes /> : <PublicRoutes />;
}

export default App;
