import { useState } from 'react';
import { studentApi } from '../services/api';
import Notification from './Notification';

export default function StudentLogin({ onLoginSuccess, onSignupClick }) {
  const [matricula, setMatricula] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleMatriculaChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setMatricula(value);
    if (errors.matricula) {
      setErrors(prev => ({ ...prev, matricula: '' }));
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!matricula) {
      newErrors.matricula = 'Matrícula é obrigatória';
    }
    
    if (!email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Email inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setLoading(true);
    setNotification({ message: '', type: '' });

    try {
      const response = await studentApi.login(matricula);
      
      if (response.success && response.student) {
        if (response.student.email !== email) {
          setNotification({
            message: 'Email não corresponde ao cadastrado para esta matrícula',
            type: 'error'
          });
          setLoading(false);
          return;
        }
        onLoginSuccess(response.student);
      }
    } catch (error) {
      setNotification({
        message: error.message,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Área do Aluno</h1>
          <p className="text-gray-600">Entre com suas credenciais</p>
        </div>

        <Notification 
          message={notification.message} 
          type={notification.type}
          onClose={() => setNotification({ message: '', type: '' })}
        />

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="matricula" className="block text-sm font-medium text-gray-700 mb-2">
              Matrícula
            </label>
            <input
              id="matricula"
              name="matricula"
              type="text"
              value={matricula}
              onChange={handleMatriculaChange}
              className={`w-full px-4 py-3 border ${errors.matricula ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition`}
              placeholder="Digite sua matrícula"
            />
            {errors.matricula && (
              <p className="mt-1 text-sm text-red-500">{errors.matricula}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition`}
              placeholder="seu.email@universidade.edu.br"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Primeira vez aqui?{' '}
            <button
              onClick={onSignupClick}
              className="text-blue-600 font-semibold hover:underline focus:outline-none"
            >
              Cadastre-se
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
