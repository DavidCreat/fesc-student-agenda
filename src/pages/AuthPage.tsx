import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LoginForm } from '../components/auth/LoginForm';
import { RegisterForm } from '../components/auth/RegisterForm';
import { AuthNavigation } from '../components/auth/AuthNavigation';
import { GraduationCap } from 'lucide-react';

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 to-red-700 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center mb-8"
      >
        <GraduationCap className="w-12 h-12 text-white mr-4" />
        <h1 className="text-4xl font-bold text-white">FESC Agenda</h1>
      </motion.div>

      <div className="w-full max-w-md">
        <AuthNavigation isLogin={isLogin} setIsLogin={setIsLogin} />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? 'login' : 'register'}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {isLogin ? <LoginForm /> : <RegisterForm />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};