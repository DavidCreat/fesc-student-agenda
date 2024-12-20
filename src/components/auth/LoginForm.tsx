import { useForm } from 'react-hook-form';
import { LogIn } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthActions } from '../../hooks/auth';
import { LoginCredentials } from '../../services/auth';

export const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginCredentials>();
  const { handleLogin, loading, error } = useAuthActions();

  const onSubmit = async (data: LoginCredentials) => {
    try {
      await handleLogin(data);
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="backdrop-blur-lg bg-white/30 p-8 rounded-xl shadow-xl max-w-md w-full"
    >
      <div className="flex items-center justify-center mb-8">
        <LogIn className="text-red-600 w-8 h-8 mr-2" />
        <h2 className="text-2xl font-bold text-gray-800">Iniciar Sesión</h2>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <input
            {...register('email', {
              required: 'Correo requerido',
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@fesc\.edu\.co$/,
                message: 'Debe ser un correo @fesc.edu.co'
              }
            })}
            placeholder="Correo institucional"
            className="w-full px-4 py-3 rounded-lg bg-white/50 border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
          />
          {errors.email && (
            <span className="text-red-500 text-sm mt-1">{errors.email.message}</span>
          )}
        </div>

        <div>
          <input
            type="password"
            {...register('password', { required: 'Contraseña requerida' })}
            placeholder="Contraseña"
            className="w-full px-4 py-3 rounded-lg bg-white/50 border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
          />
          {errors.password && (
            <span className="text-red-500 text-sm mt-1">{errors.password.message}</span>
          )}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-medium disabled:bg-red-400"
        >
          {loading ? 'Iniciando sesión...' : 'Ingresar'}
        </motion.button>
      </form>
    </motion.div>
  );
};