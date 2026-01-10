const API_BASE_URL = '/api/v1';

export const API_ENDPOINTS = {
  STUDENT: {
    GET: (enrollmentNumber) => `${API_BASE_URL}/student/${enrollmentNumber}`,
    REGISTER: `${API_BASE_URL}/student/register`,
  },
  CERTIFICATE: {
    SUBMIT: `${API_BASE_URL}/certificate/submit`,
    GET_SUBMISSIONS: (enrollmentNumber) => `${API_BASE_URL}/certificate/student/${enrollmentNumber}/submissions`,
  },
  COORDINATOR: {
    GET_PENDING: (page) => `${API_BASE_URL}/coordinator/pending?page=${page}`,
    APPROVE: (submissionId) => `${API_BASE_URL}/coordinator/approve/${submissionId}`,
    REJECT: (submissionId) => `${API_BASE_URL}/coordinator/reject/${submissionId}`,
  },
};

export const CATEGORIES = [
  { id: 1, name: "Programa de iniciação científica ou tecnológica" },
  { id: 2, name: "Programa de iniciação a docência" },
  { id: 3, name: "Programa de monitoria" },
  { id: 4, name: "Projeto de pesquisa ou extensão" },
  { id: 5, name: "Atividades artístico-culturais e/ou esportivas" },
  { id: 6, name: "Curso de línguas" },
  { id: 7, name: "Curso na área de engenharia de computação" },
  { id: 8, name: "Curso fora da área de engenharia de computação" },
  { id: 9, name: "Ministrar curso na área de engenharia da computação" },
  { id: 10, name: "Certificação técnica" },
  { id: 11, name: "Organização de eventos técnicos e/ou científicos na área do curso" },
  { id: 12, name: "Participação em eventos técnicos e/ou científicos na área do curso" },
  { id: 13, name: "Participação como ouvinte em palestras relacionadas com a área do curso" },
  { id: 14, name: "Participação como palestrante em palestras relacionadas com a área do curso" },
  { id: 15, name: "Projeto Social extra-curricular" },
  { id: 16, name: "Produção técnica com relatório" },
];

export default API_BASE_URL;
