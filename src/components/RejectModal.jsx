import { useState } from 'react';

export default function RejectModal({ submission, onConfirm, onCancel, loading }) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!reason.trim()) {
      setError('Motivo da rejeição é obrigatório');
      return;
    }

    onConfirm(reason);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-xl w-full">
        <div className="border-b px-6 py-4">
          <h3 className="text-xl font-semibold text-gray-900">Rejeitar Submissão</h3>
          <p className="text-sm text-gray-600 mt-1">Aluno: {submission?.student_name}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
            <p className="text-sm text-red-800">
              <strong>Atenção:</strong> O aluno será notificado sobre a rejeição e receberá o motivo informado abaixo.
            </p>
          </div>

          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
              Motivo da Rejeição *
            </label>
            <textarea
              id="reason"
              name="reason"
              rows="5"
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setError('');
              }}
              className={`w-full px-4 py-3 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition`}
              placeholder="Explique detalhadamente o motivo da rejeição..."
            />
            {error && (
              <p className="mt-1 text-sm text-red-500">{error}</p>
            )}
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Rejeitando...' : 'Rejeitar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
