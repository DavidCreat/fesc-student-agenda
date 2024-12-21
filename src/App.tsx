import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes';
import { Navigation } from './components/Navigation';
import { useStore } from './store/useStore';

const App = () => {
  const user = useStore((state) => state.user);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className={user ? "pt-20 px-4" : ""}>
          <AppRoutes />
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;