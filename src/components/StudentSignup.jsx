import { useState } from 'react';
import { studentApi } from '../services/api';
import Notification from './Notification';

export default function StudentSignup({ onSignupSuccess, onBackToLogin }) {
  const [formData, setFormData] = useState({
    matricula: '',
    nome: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleMatriculaChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setFormData(prev => ({ ...prev, matricula: value }));
    if (errors.matricula) {
      setErrors(prev => ({ ...prev, matricula: '' }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.matricula) {
      newErrors.matricula = 'Matrícula é obrigatória';
    }
    
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    } else if (formData.nome.trim().length < 3) {
      newErrors.nome = 'Nome deve ter pelo menos 3 caracteres';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!validateEmail(formData.email)) {
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
      const response = await studentApi.register({
        enrollment_number: formData.matricula,
        name: formData.nome,
        email: formData.email
      });

      if (response) {
        setNotification({
          message: 'Cadastro realizado com sucesso! Redirecionando...',
          type: 'success'
        });
        setTimeout(() => {
          onSignupSuccess();
        }, 2000);
      }
    } catch (error) {
      setNotification({
        message: error.message,
        type: 'error'
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Cadastro de Aluno</h1>
          <p className="text-gray-600">Preencha seus dados para começar</p>
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
              value={formData.matricula}
              onChange={handleMatriculaChange}
              className={`w-full px-4 py-3 border ${errors.matricula ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition`}
              placeholder="Digite sua matrícula"
            />
            {errors.matricula && (
              <p className="mt-1 text-sm text-red-500">{errors.matricula}</p>
            )}
          </div>

          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
              Nome Completo
            </label>
            <input
              id="nome"
              name="nome"
              type="text"
              value={formData.nome}
              onChange={handleChange}
              className={`w-full px-4 py-3 border ${errors.nome ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition`}
              placeholder="Seu nome completo"
            />
            {errors.nome && (
              <p className="mt-1 text-sm text-red-500">{errors.nome}</p>
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
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition`}
              placeholder="seu.email@universidade.edu.br"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 focus:ring-4 focus:ring-green-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Já possui cadastro?{' '}
            <button
              onClick={onBackToLogin}
              className="text-green-600 font-semibold hover:underline focus:outline-none"
            >
              Fazer login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
