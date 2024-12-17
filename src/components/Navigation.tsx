import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, BookOpen, Clock } from 'lucide-react';

export const Navigation = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-red-600 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8">
            <Link
              to="/"
              className={`flex items-center ${isActive('/') ? 'text-white' : 'text-red-200'}`}
            >
              <Home className="w-5 h-5 mr-2" />
              <span>Inicio</span>
            </Link>
            
            <Link
              to="/schedule"
              className={`flex items-center ${isActive('/schedule') ? 'text-white' : 'text-red-200'}`}
            >
              <Calendar className="w-5 h-5 mr-2" />
              <span>Horario</span>
            </Link>
            
            <Link
              to="/tasks"
              className={`flex items-center ${isActive('/tasks') ? 'text-white' : 'text-red-200'}`}
            >
              <BookOpen className="w-5 h-5 mr-2" />
              <span>Tareas</span>
            </Link>
            
            <Link
              to="/session"
              className={`flex items-center ${isActive('/session') ? 'text-white' : 'text-red-200'}`}
            >
              <Clock className="w-5 h-5 mr-2" />
              <span>Sesión</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};