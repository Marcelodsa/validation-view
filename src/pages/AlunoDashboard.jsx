import { useState } from "react";
import DocumentForm from "../components/DocumentForm";
import DocumentTable from "../components/DocumentTable";
import StudentLogin from "../components/StudentLogin";
import StudentSignup from "../components/StudentSignup";
import Notification from "../components/Notification";
import { certificateApi } from "../services/api";

export default function AlunoDashboard() {
  const [studentData, setStudentData] = useState(null);
  const [view, setView] = useState('login');
  const [documentos, setDocumentos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });

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
    setDocumentos([]);
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

        const novoDoc = {
          id: response.submission_id,
          filename: response.filename,
          fileSize: response.file_size,
          status: response.status,
          submittedAt: new Date(response.submitted_at).toLocaleString('pt-BR'),
          checksum: response.checksum,
        };
        setDocumentos([novoDoc, ...documentos]);
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
        <h2 className="text-xl font-semibold mt-6 mb-4">Certificados Enviados</h2>
        <DocumentTable documentos={documentos} />
      </main>
    </div>
  );
}
