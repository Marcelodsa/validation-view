import { useState } from 'react';

export default function DocumentTable({ submissions }) {
  const [viewFile, setViewFile] = useState(null);
  const [viewNotes, setViewNotes] = useState(null);

  const getStatusDisplay = (status) => {
    const statusMap = {
      'approved': { label: 'Aprovado', class: 'bg-green-100 text-green-800' },
      'failed': { label: 'Falha', class: 'bg-red-100 text-red-800' },
      'pending_review': { label: 'Aguardando revisão de coordenador', class: 'bg-yellow-100 text-yellow-800' },
    };
    
    return statusMap[status] || { label: 'Processando', class: 'bg-blue-100 text-blue-800' };
  };

  const formatDate = (utcDateString) => {
    const date = new Date(utcDateString);
    return date.toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getFileFormat = (mimeType) => {
    const formats = {
      'application/pdf': 'PDF',
      'image/jpeg': 'JPEG',
      'image/jpg': 'JPG',
      'image/png': 'PNG',
    };
    return formats[mimeType] || 'Desconhecido';
  };

  const handleViewFile = (url, mimeType) => {
    setViewFile({ url, mimeType });
  };

  const closeViewer = () => {
    setViewFile(null);
  };

  const handleViewNotes = (notes) => {
    setViewNotes(notes);
  };

  const closeNotes = () => {
    setViewNotes(null);
  };

  if (!submissions || submissions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
        Nenhum certificado enviado ainda.
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome do Arquivo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data de Envio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Formato
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Horas Contabilizadas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {submissions.map((submission) => {
                const statusInfo = getStatusDisplay(submission.status);
                return (
                  <tr key={submission.submission_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {submission.original_filename}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusInfo.class}`}>
                        {statusInfo.label}
                      </span>
                      {submission.error_message && (
                        <div className="mt-1 text-xs text-red-600">
                          {submission.error_message}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(submission.submitted_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getFileFormat(submission.mime_type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {submission.status === 'approved' && submission.final_hours ? (
                        <span className="font-semibold text-green-700">{submission.final_hours}h</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {submission.status === 'approved' && submission.category_name ? (
                        submission.category_name
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <button
                        onClick={() => handleViewFile(submission.download_url, submission.mime_type)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Visualizar
                      </button>
                      {submission.coordinator_notes && (
                        <button
                          onClick={() => handleViewNotes(submission.coordinator_notes)}
                          className="text-purple-600 hover:text-purple-800 font-medium"
                        >
                          Ver Notas
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {viewFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={closeViewer}>
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Visualização do Certificado</h3>
              <button
                onClick={closeViewer}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              {viewFile.mimeType.startsWith('image/') ? (
                <img src={viewFile.url} alt="Certificado" className="w-full h-auto" />
              ) : viewFile.mimeType === 'application/pdf' ? (
                <iframe
                  src={viewFile.url}
                  className="w-full h-[70vh]"
                  title="Visualização do PDF"
                />
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">Formato não suportado para visualização.</p>
                  <a
                    href={viewFile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Abrir em nova aba
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {viewNotes && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={closeNotes}>
          <div className="bg-white rounded-lg max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="border-b px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Notas do Coordenador</h3>
              <button
                onClick={closeNotes}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <p className="text-gray-800 whitespace-pre-wrap">{viewNotes}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
