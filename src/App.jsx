import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import AlunoDashboard from "./pages/AlunoDashboard";
import ProfessorDashboard from "./pages/ProfessorDashboard";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/aluno" element={<AlunoDashboard />} />
        <Route path="/professor" element={<ProfessorDashboard />} />
      </Routes>
    </Router>
  );
}
