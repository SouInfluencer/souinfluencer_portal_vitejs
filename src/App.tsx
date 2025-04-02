import { PublicRoutes } from './routes/PublicRoutes';
import { PrivateRoutes } from './routes/PrivateRoutes';
import { NotificationProvider } from './components/ui/NotificationProvider';
import {AuthService} from "./services/authService.ts";

function App() {

  return (
      <NotificationProvider>
        { AuthService.isAuthenticated() ? <PrivateRoutes /> : <PublicRoutes />}
      </NotificationProvider>
  );
}

export default App;
