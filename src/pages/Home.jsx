import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-8">Sistema de Documentos</h1>
      <div className="space-x-4">
        <Link
          to="/aluno"
          className="bg-blue-600 text-white px-6 py-3 rounded shadow hover:bg-blue-700"
        >
          Área do Aluno
        </Link>
        <Link
          to="/professor"
          className="bg-green-600 text-white px-6 py-3 rounded shadow hover:bg-green-700"
        >
          Área do Professor
        </Link>
      </div>
    </div>
  );
}
