import { useState, useEffect } from "react";
import ProfessorTable from "../components/ProfessorTable";
import ApproveOverrideModal from "../components/ApproveOverrideModal";
import RejectModal from "../components/RejectModal";
import Notification from "../components/Notification";
import { coordinatorApi } from "../services/api";

export default function ProfessorDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  const fetchPendingSubmissions = async (page = 1) => {
    setLoading(true);
    try {
      const response = await coordinatorApi.getPending(page);
      if (response.success) {
        setSubmissions(response.data || []);
        setPagination(response.pagination);
        setCurrentPage(page);
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

  useEffect(() => {
    fetchPendingSubmissions(1);
  }, []);

  const handleAutoApprove = async (submission) => {
    setActionLoading(true);
    setNotification({ message: '', type: '' });

    try {
      await coordinatorApi.approve(submission.submission_id);
      setNotification({
        message: `Submissão aprovada automaticamente para ${submission.student_name}`,
        type: 'success'
      });
      await fetchPendingSubmissions(currentPage);
    } catch (error) {
      setNotification({
        message: error.message,
        type: 'error'
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleApproveWithOverride = (submission) => {
    setSelectedSubmission(submission);
    setShowApproveModal(true);
  };

  const handleConfirmApproveOverride = async (overrideData) => {
    setActionLoading(true);
    setNotification({ message: '', type: '' });

    try {
      await coordinatorApi.approve(selectedSubmission.submission_id, overrideData);
      setNotification({
        message: `Submissão aprovada com ajustes para ${selectedSubmission.student_name}`,
        type: 'success'
      });
      setShowApproveModal(false);
      setSelectedSubmission(null);
      await fetchPendingSubmissions(currentPage);
    } catch (error) {
      setNotification({
        message: error.message,
        type: 'error'
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = (submission) => {
    setSelectedSubmission(submission);
    setShowRejectModal(true);
  };

  const handleConfirmReject = async (reason) => {
    setActionLoading(true);
    setNotification({ message: '', type: '' });

    try {
      await coordinatorApi.reject(selectedSubmission.submission_id, reason);
      setNotification({
        message: `Submissão rejeitada para ${selectedSubmission.student_name}`,
        type: 'success'
      });
      setShowRejectModal(false);
      setSelectedSubmission(null);
      await fetchPendingSubmissions(currentPage);
    } catch (error) {
      setNotification({
        message: error.message,
        type: 'error'
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    fetchPendingSubmissions(newPage);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Área do Coordenador</h1>
          <p className="text-sm text-gray-600 mt-1">Revisão de certificados pendentes</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <Notification 
          message={notification.message} 
          type={notification.type}
          onClose={() => setNotification({ message: '', type: '' })}
        />

        {pagination && (
          <div className="mb-4 bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">
              Exibindo {submissions.length} de {pagination.total} submissões pendentes
              {pagination.pages > 1 && ` - Página ${pagination.page} de ${pagination.pages}`}
            </p>
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Carregando submissões...</p>
          </div>
        ) : (
          <ProfessorTable
            submissions={submissions}
            onAutoApprove={handleAutoApprove}
            onApproveWithOverride={handleApproveWithOverride}
            onReject={handleReject}
          />
        )}

        {pagination && pagination.pages > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Anterior
            </button>
            <div className="flex items-center px-4 py-2 text-gray-700">
              Página {currentPage} de {pagination.pages}
            </div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pagination.pages || loading}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Próxima
            </button>
          </div>
        )}
      </main>

      {showApproveModal && (
        <ApproveOverrideModal
          submission={selectedSubmission}
          onConfirm={handleConfirmApproveOverride}
          onCancel={() => {
            setShowApproveModal(false);
            setSelectedSubmission(null);
          }}
          loading={actionLoading}
        />
      )}

      {showRejectModal && (
        <RejectModal
          submission={selectedSubmission}
          onConfirm={handleConfirmReject}
          onCancel={() => {
            setShowRejectModal(false);
            setSelectedSubmission(null);
          }}
          loading={actionLoading}
        />
      )}
    </div>
  );
}
