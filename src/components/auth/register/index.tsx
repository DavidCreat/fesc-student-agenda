import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { authService } from '../../../services/auth';
import { FaUser, FaEnvelope, FaLock, FaGraduationCap, FaCalendarAlt, FaClock } from 'react-icons/fa';
import { CAREERS } from '../../../constants/careers';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<{
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    career: string;
    semester: number;
    schedule: 'day' | 'night' | '';
  }>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    career: '',
    semester: 1,
    schedule: '',
  });
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string): boolean => {
    // Validate FESC email format
    const emailRegex = /^[a-zA-Z0-9_.+-]+(?:\.[a-zA-Z0-9_.+-]+)*@fesc\.edu\.co$/;
    return emailRegex.test(email);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.name === 'semester' ? parseInt(e.target.value, 10) || 1 : e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate email format
    if (!validateEmail(formData.email)) {
      toast.error('El correo debe ser un correo válido de FESC (ejemplo: est.da.fonseca@fesc.edu.co)');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    if (!formData.schedule) {
      toast.error('Por favor seleccione un horario');
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...registerData } = formData;
      const response = await authService.registerUser(registerData as any);
      localStorage.setItem('token', response.token);
      toast.success('Registro exitoso');
      navigate('/', { replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">
          Crea tu cuenta
        </h2>
        <p className="auth-subtitle">
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login" className="auth-link">
            Inicia sesión aquí
          </Link>
        </p>
        <form className="form-group" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="input-group">
              <FaUser className="input-icon" />
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                className="input"
                placeholder="Nombre completo"
                value={formData.fullName}
                onChange={handleChange}
                minLength={3}
              />
            </div>
            <div className="input-group">
              <FaEnvelope className="input-icon" />
              <input
                id="email"
                name="email"
                type="email"
                required
                className="input"
                placeholder="Correo electrónico @fesc.edu.co"
                value={formData.email}
                onChange={handleChange}
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
              />
            </div>
            <div className="input-group">
              <FaLock className="input-icon" />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="input"
                placeholder="Confirmar contraseña"
                value={formData.confirmPassword}
                onChange={handleChange}
                minLength={8}
              />
            </div>
            <div className="input-group">
              <FaGraduationCap className="input-icon" />
              <select
                id="career"
                name="career"
                required
                className="input"
                value={formData.career}
                onChange={handleChange}
              >
                <option value="">Selecciona tu carrera</option>
                {CAREERS.map((career) => (
                  <option key={career} value={career}>
                    {career}
                  </option>
                ))}
              </select>
            </div>
            <div className="input-group">
              <FaCalendarAlt className="input-icon" />
              <input
                id="semester"
                name="semester"
                type="number"
                required
                className="input"
                placeholder="Semestre actual"
                value={formData.semester}
                onChange={handleChange}
                min="1"
                max="10"
              />
            </div>
            <div className="input-group">
              <FaClock className="input-icon" />
              <select
                id="schedule"
                name="schedule"
                required
                className="input"
                value={formData.schedule}
                onChange={handleChange}
              >
                <option value="">Selecciona tu jornada</option>
                <option value="day">Diurna</option>
                <option value="night">Nocturna</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? 'Registrando...' : 'Registrarse'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;