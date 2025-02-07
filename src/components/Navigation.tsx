// src/components/Navigation.tsx
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useState } from 'react';
import { Home, Calendar, BookOpen, Clock, LogOut, User, BarChart } from 'lucide-react';

export const Navigation = () => {
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/auth');
  };

  // Si no hay usuario, no renderizamos la navegación
  if (!user) return null;

  return (
    <nav className="bg-red-600 text-white fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-14 px-4">
          {/* Botón de menú móvil */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="sm:hidden flex items-center"
          >
            <span className={`transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
          </button>

          {/* Enlaces para desktop */}
          <div className="hidden sm:flex items-center space-x-4">
            <Link to="/dashboard" className="flex items-center space-x-1 py-2">
              <Home className="w-5 h-5" />
              <span>Inicio</span>
            </Link>
            <Link to="/schedule" className="flex items-center space-x-1 py-2">
              <Calendar className="w-5 h-5" />
              <span>Horario</span>
            </Link>
            <Link to="/tasks" className="flex items-center space-x-1 py-2">
              <BookOpen className="w-5 h-5" />
              <span>Tareas</span>
            </Link>
            <Link to="/session" className="flex items-center space-x-1 py-2">
              <Clock className="w-5 h-5" />
              <span>Sesión</span>
            </Link>
            <Link to="/profile" className="flex items-center space-x-1 py-2">
              <User className="w-5 h-5" />
              <span>Perfil</span>
            </Link>
            <Link to="/reports" className="flex items-center space-x-1 py-2">
              <BarChart className="w-5 h-5" />
              <span>Reportes</span>
            </Link>
          </div>

          {/* Botón de logout */}
          <div className="flex items-center">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 py-2"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        <div className={`sm:hidden ${isOpen ? 'block' : 'hidden'} pb-4 bg-red-600`}>
          <div className="flex flex-col space-y-2 px-4">
            <Link 
              to="/dashboard"
              className="flex items-center space-x-2 py-2 hover:bg-red-500 rounded-md px-2"
              onClick={() => setIsOpen(false)}
            >
              <Home className="w-5 h-5" />
              <span>Inicio</span>
            </Link>
            <Link 
              to="/schedule"
              className="flex items-center space-x-2 py-2 hover:bg-red-500 rounded-md px-2"
              onClick={() => setIsOpen(false)}
            >
              <Calendar className="w-5 h-5" />
              <span>Horario</span>
            </Link>
            <Link 
              to="/tasks"
              className="flex items-center space-x-2 py-2 hover:bg-red-500 rounded-md px-2"
              onClick={() => setIsOpen(false)}
            >
              <BookOpen className="w-5 h-5" />
              <span>Tareas</span>
            </Link>
            <Link 
              to="/session"
              className="flex items-center space-x-2 py-2 hover:bg-red-500 rounded-md px-2"
              onClick={() => setIsOpen(false)}
            >
              <Clock className="w-5 h-5" />
              <span>Sesión</span>
            </Link>
            <Link 
              to="/profile"
              className="flex items-center space-x-2 py-2 hover:bg-red-500 rounded-md px-2"
              onClick={() => setIsOpen(false)}
            >
              <User className="w-5 h-5" />
              <span>Perfil</span>
            </Link>
            <Link 
              to="/reports"
              className="flex items-center space-x-2 py-2 hover:bg-red-500 rounded-md px-2"
              onClick={() => setIsOpen(false)}
            >
              <BarChart className="w-5 h-5" />
              <span>Reportes</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};