import { useState, useEffect } from 'react';
import { CATEGORIES } from '../config/api.config';

export default function ApproveOverrideModal({ submission, onConfirm, onCancel, loading }) {
  const [formData, setFormData] = useState({
    final_hours: submission?.extracted_activity?.calculated_hours || '',
    final_category_id: '',
    override_reason: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (submission?.extracted_activity?.category_name) {
      const matchedCategory = CATEGORIES.find(
        cat => cat.name === submission.extracted_activity.category_name
      );
      if (matchedCategory) {
        setFormData(prev => ({
          ...prev,
          final_category_id: matchedCategory.id.toString(),
        }));
      }
    }
  }, [submission]);

  const validate = () => {
    const newErrors = {};
    
    if (!formData.final_hours || formData.final_hours <= 0) {
      newErrors.final_hours = 'Horas devem ser maior que zero';
    }
    
    if (!formData.final_category_id) {
      newErrors.final_category_id = 'Categoria é obrigatória';
    }
    
    if (!formData.override_reason.trim()) {
      newErrors.override_reason = 'Justificativa é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onConfirm({
        final_hours: parseFloat(formData.final_hours),
        final_category_id: parseInt(formData.final_category_id),
        override_reason: formData.override_reason,
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4">
          <h3 className="text-xl font-semibold text-gray-900">Aprovar com Ajustes</h3>
          <p className="text-sm text-gray-600 mt-1">Aluno: {submission?.student_name}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-sm text-gray-700 mb-2">Valores Sugeridos pela IA</h4>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Categoria:</span> {submission?.extracted_activity?.category_name}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Horas:</span> {submission?.extracted_activity?.calculated_hours}h
            </p>
          </div>

          <div>
            <label htmlFor="final_hours" className="block text-sm font-medium text-gray-700 mb-2">
              Horas Finais *
            </label>
            <input
              id="final_hours"
              name="final_hours"
              type="number"
              step="0.5"
              min="0"
              value={formData.final_hours}
              onChange={handleChange}
              className={`w-full px-4 py-3 border ${errors.final_hours ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition`}
              placeholder="Ex: 8"
            />
            {errors.final_hours && (
              <p className="mt-1 text-sm text-red-500">{errors.final_hours}</p>
            )}
          </div>

          <div>
            <label htmlFor="final_category_id" className="block text-sm font-medium text-gray-700 mb-2">
              Categoria Final *
            </label>
            <select
              id="final_category_id"
              name="final_category_id"
              value={formData.final_category_id}
              onChange={handleChange}
              className={`w-full px-4 py-3 border ${errors.final_category_id ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition`}
            >
              <option value="">Selecione uma categoria</option>
              {CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.final_category_id && (
              <p className="mt-1 text-sm text-red-500">{errors.final_category_id}</p>
            )}
          </div>

          <div>
            <label htmlFor="override_reason" className="block text-sm font-medium text-gray-700 mb-2">
              Justificativa do Ajuste *
            </label>
            <textarea
              id="override_reason"
              name="override_reason"
              rows="4"
              value={formData.override_reason}
              onChange={handleChange}
              className={`w-full px-4 py-3 border ${errors.override_reason ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition`}
              placeholder="Explique por que está alterando os valores sugeridos..."
            />
            {errors.override_reason && (
              <p className="mt-1 text-sm text-red-500">{errors.override_reason}</p>
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
              className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Aprovando...' : 'Aprovar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
