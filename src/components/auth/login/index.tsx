import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { authService } from '../../../services/auth/AuthService';
import { FaEnvelope, FaLock } from 'react-icons/fa';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (email: string): boolean => {
    // Validate FESC email format (est_nombre_apellido@fesc.edu.co)
    const emailRegex = /^est_[a-z0-9]+_[a-z0-9]+@fesc\.edu\.co$/;
    return emailRegex.test(email.toLowerCase());
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Handle email input
    if (name === 'email') {
      const normalizedEmail = value.toLowerCase();
      setFormData({
        ...formData,
        [name]: normalizedEmail,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    // Validate email
    if (!formData.email) {
      setError('El correo es requerido');
      return;
    }

    // Validate email format
    if (!validateEmail(formData.email)) {
      setError('El correo debe tener el formato est_nombre_apellido@fesc.edu.co (ejemplo: est_da_fonseca@fesc.edu.co)');
      return;
    }

    // Validate password
    if (!formData.password) {
      setError('La contraseña es requerida');
      return;
    }

    setLoading(true);

    try {
      console.log('Attempting login with email:', formData.email);
      const response = await authService.login({
        email: formData.email.toLowerCase(),
        password: formData.password
      });
      console.log('Login response:', response);
      
      if (response?.token) {
        // Don't call setAuthToken here, it's already handled in the AuthService
        toast.success('¡Bienvenido de vuelta!');
        navigate('/dashboard', { replace: true });
      } else {
        throw new Error('No se recibió un token válido');
      }
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'Error al iniciar sesión';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        errorMessage = axiosError.response?.data?.message || 'Error al iniciar sesión';
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">
          Inicia sesión
        </h2>
        <p className="auth-subtitle">
          ¿No tienes una cuenta?{' '}
          <Link to="/register" className="auth-link">
            Regístrate aquí
          </Link>
        </p>
        <form className="form-group" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="input-group">
              <FaEnvelope className="input-icon" />
              <input
                id="email"
                name="email"
                type="email"
                required
                className="input"
                placeholder="Correo electrónico (est_nombre_apellido@fesc.edu.co)"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>
            <div className="input-group">
              <FaLock className="input-icon" />
              <input
                id="password"
                name="password"
                type="password"
                required
                className="input"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleChange}
                minLength={8}
                autoComplete="current-password"
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm mt-2">
                {error}
              </div>
            )}
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;