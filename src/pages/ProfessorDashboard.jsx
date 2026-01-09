import { useState } from "react";
import ProfessorTable from "../components/ProfessorTable";

export default function ProfessorDashboard() {
  const [documentos, setDocumentos] = useState([
    {
      id: 1,
      aluno: "João Silva",
      categoria: "Extensão",
      horas: 10,
      arquivoUrl: "/docs/extensao1.pdf",
      status: "analise",
    },
    {
      id: 2,
      aluno: "Maria Souza",
      categoria: "Pesquisa",
      horas: 20,
      arquivoUrl: "/docs/pesquisa1.pdf",
      status: "analise",
    },
  ]);

  const handleValidate = (id, status) => {
    setDocumentos((prev) =>
      prev.map((doc) =>
        doc.id === id ? { ...doc, status } : doc
      )
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Área do Professor</h1>
      <ProfessorTable documentos={documentos} onValidate={handleValidate} />
    </div>
  );
}
