import { useState } from 'react';

export default function DocumentForm({ onSubmit, loading }) {
  const [arquivo, setArquivo] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!arquivo) {
      setError('Por favor, selecione um arquivo');
      return;
    }

    const validExtensions = ['.pdf', '.jpg', '.jpeg', '.png'];
    const fileExtension = arquivo.name.toLowerCase().substring(arquivo.name.lastIndexOf('.'));
    
    if (!validExtensions.includes(fileExtension)) {
      setError('Formato inválido. Envie apenas PDF ou imagens (JPG, PNG)');
      return;
    }

    setError('');
    onSubmit(arquivo);
  };

  const handleFileChange = (e) => {
    setArquivo(e.target.files[0]);
    setError('');
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Enviar Certificado</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
            Arquivo do Certificado
          </label>
          <input
            id="file"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          />
          {error && (
            <p className="mt-2 text-sm text-red-500">{error}</p>
          )}
          <p className="mt-2 text-sm text-gray-500">
            Formatos aceitos: PDF, JPG, PNG
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? 'Enviando...' : 'Enviar Certificado'}
        </button>
      </form>
    </div>
  );
}
