import { useState, useEffect } from "react";
import DocumentForm from "../components/DocumentForm";
import DocumentTable from "../components/DocumentTable";
import StudentLogin from "../components/StudentLogin";
import StudentSignup from "../components/StudentSignup";
import Notification from "../components/Notification";
import { certificateApi } from "../services/api";

export default function AlunoDashboard() {
  const [studentData, setStudentData] = useState(null);
  const [view, setView] = useState('login');
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [canRefresh, setCanRefresh] = useState(true);
  const [notification, setNotification] = useState({ message: '', type: '' });

  const fetchSubmissions = async (enrollmentNumber) => {
    try {
      const response = await certificateApi.getSubmissions(enrollmentNumber);
      if (response.submissions) {
        setSubmissions(response.submissions);
      }
    } catch (error) {
      console.error('Erro ao carregar certificados:', error);
    }
  };

  useEffect(() => {
    if (studentData && view === 'dashboard') {
      fetchSubmissions(studentData.enrollment_number);
    }
  }, [studentData, view]);

  const handleLoginSuccess = (student) => {
    setStudentData(student);
    setView('dashboard');
  };

  const handleSignupSuccess = () => {
    setView('login');
  };

  const handleLogout = () => {
    setStudentData(null);
    setView('login');
    setSubmissions([]);
    setNotification({ message: '', type: '' });
  };

  const handleSubmit = async (file) => {
    setLoading(true);
    setNotification({ message: '', type: '' });

    try {
      const response = await certificateApi.submit(studentData.enrollment_number, file);
      
      if (response.success) {
        setNotification({
          message: `Certificado "${response.filename}" enviado com sucesso! Status: ${response.status}`,
          type: 'success'
        });

        await fetchSubmissions(studentData.enrollment_number);
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

  const handleRefresh = async () => {
    if (!canRefresh || refreshing) return;

    setRefreshing(true);
    setCanRefresh(false);
    setNotification({ message: '', type: '' });

    try {
      await fetchSubmissions(studentData.enrollment_number);
      setNotification({
        message: 'Certificados atualizados com sucesso',
        type: 'success'
      });
    } catch (error) {
      setNotification({
        message: 'Erro ao atualizar certificados',
        type: 'error'
      });
    } finally {
      setRefreshing(false);
      setTimeout(() => {
        setCanRefresh(true);
      }, 5000);
    }
  };

  if (view === 'signup') {
    return (
      <StudentSignup
        onSignupSuccess={handleSignupSuccess}
        onBackToLogin={() => setView('login')}
      />
    );
  }

  if (view === 'login') {
    return (
      <StudentLogin
        onLoginSuccess={handleLoginSuccess}
        onSignupClick={() => setView('signup')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Área do Aluno</h1>
            <p className="text-sm text-gray-600 mt-1">
              Bem-vindo(a), {studentData?.name}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Sair
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Matrícula</p>
              <p className="text-lg font-semibold text-gray-900">{studentData?.enrollment_number}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Email</p>
              <p className="text-lg font-semibold text-gray-900">{studentData?.email}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Horas Aprovadas</p>
              <p className="text-lg font-semibold text-gray-900">{studentData?.total_approved_hours || 0}h</p>
            </div>
          </div>
        </div>

        <Notification 
          message={notification.message} 
          type={notification.type}
          onClose={() => setNotification({ message: '', type: '' })}
        />

        <DocumentForm onSubmit={handleSubmit} loading={loading} />
        
        <div className="flex justify-between items-center mt-6 mb-4">
          <h2 className="text-xl font-semibold">Certificados Enviados</h2>
          <button
            onClick={handleRefresh}
            disabled={!canRefresh || refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            title={!canRefresh ? 'Aguarde 5 segundos para atualizar novamente' : 'Atualizar certificados'}
          >
            <svg
              className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            {refreshing ? 'Atualizando...' : 'Atualizar'}
          </button>
        </div>
        
        <DocumentTable submissions={submissions} />
      </main>
    </div>
  );
}
