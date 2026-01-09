export default function ValidationPanel({ documentos, onValidate }) {
  return (
    <div className="space-y-4">
      {documentos.map((doc) => (
        <div key={doc.id} className="p-4 border rounded bg-gray-50">
          <p><strong>Aluno:</strong> {doc.aluno}</p>
          <p><strong>Categoria:</strong> {doc.categoria}</p>
          <p><strong>Horas:</strong> {doc.horas}</p>
          <a href={doc.arquivoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Ver documento</a>
          <div className="mt-2 space-x-2">
            <button onClick={() => onValidate(doc.id, 'aprovado')} className="bg-green-500 text-white px-3 py-1 rounded">Aprovar</button>
            <button onClick={() => onValidate(doc.id, 'reprovado')} className="bg-red-500 text-white px-3 py-1 rounded">Reprovar</button>
          </div>
        </div>
      ))}
    </div>
  );
}
