import { useState } from "react";
import DocumentForm from "../components/DocumentForm";
import DocumentTable from "../components/DocumentTable";

export default function AlunoDashboard() {
  const [documentos, setDocumentos] = useState([]);

  const handleSubmit = (doc) => {
    const novoDoc = {
      id: documentos.length + 1,
      categoria: doc.categoria,
      horas: doc.horas,
      arquivoUrl: URL.createObjectURL(doc.arquivo),
      status: "enviado",
    };
    setDocumentos([...documentos, novoDoc]);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Área do Aluno</h1>
      <DocumentForm onSubmit={handleSubmit} />
      <h2 className="text-xl font-semibold mt-6 mb-2">Meus Documentos</h2>
      <DocumentTable documentos={documentos} />
    </div>
  );
}
