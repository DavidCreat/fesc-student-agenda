import { motion } from 'framer-motion';
import { LogIn, UserPlus } from 'lucide-react';

interface AuthNavigationProps {
  isLogin: boolean;
  setIsLogin: (value: boolean) => void;
}

export const AuthNavigation = ({ isLogin, setIsLogin }: AuthNavigationProps) => {
  return (
    <nav className="bg-white/10 backdrop-blur-md rounded-lg p-2 mb-8">
      <div className="grid grid-cols-2 gap-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsLogin(true)}
          className={`flex items-center justify-center p-3 rounded-lg transition-all ${
            isLogin ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10'
          }`}
        >
          <LogIn className="w-5 h-5 mr-2" />
          <span>Iniciar Sesión</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsLogin(false)}
          className={`flex items-center justify-center p-3 rounded-lg transition-all ${
            !isLogin ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10'
          }`}
        >
          <UserPlus className="w-5 h-5 mr-2" />
          <span>Registrarse</span>
        </motion.button>
      </div>
    </nav>
  );
};