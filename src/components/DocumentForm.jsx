import { useState } from 'react';

export default function DocumentForm({ onSubmit }) {
  const [categoria, setCategoria] = useState('');
  const [horas, setHoras] = useState('');
  const [arquivo, setArquivo] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ categoria, horas, arquivo });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded shadow">
      <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="w-full p-2 border rounded">
        <option value="">Selecione a categoria</option>
        <option value="extensao">Extensão</option>
        <option value="pesquisa">Pesquisa</option>
        <option value="ensino">Ensino</option>
      </select>

      <input
        type="number"
        placeholder="Horas atribuídas"
        value={horas}
        onChange={(e) => setHoras(e.target.value)}
        className="w-full p-2 border rounded"
      />

      <input
        type="file"
        onChange={(e) => setArquivo(e.target.files[0])}
        className="w-full p-2 border rounded"
      />

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Enviar</button>
    </form>
  );
}
