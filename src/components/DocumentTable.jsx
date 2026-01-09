export default function DocumentTable({ documentos }) {
  const statusClasses = {
    enviado: "bg-gray-200 text-gray-800",
    analise: "bg-yellow-200 text-yellow-800",
    aprovado: "bg-green-200 text-green-800",
    reprovado: "bg-red-200 text-red-800",
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300 rounded-lg shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border">Categoria</th>
            <th className="px-4 py-2 border">Horas</th>
            <th className="px-4 py-2 border">Arquivo</th>
            <th className="px-4 py-2 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {documentos.map((doc) => (
            <tr key={doc.id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border">{doc.categoria}</td>
              <td className="px-4 py-2 border">{doc.horas}</td>
              <td className="px-4 py-2 border">
                <a
                  href={doc.arquivoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Ver documento
                </a>
              </td>
              <td className="px-4 py-2 border">
                <span
                  className={`px-2 py-1 rounded ${statusClasses[doc.status]}`}
                >
                  {doc.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
