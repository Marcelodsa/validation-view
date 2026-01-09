import { API_ENDPOINTS } from '../config/api.config';

export const studentApi = {
  async login(enrollmentNumber) {
    const response = await fetch(API_ENDPOINTS.STUDENT.GET(enrollmentNumber));
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Matrícula não encontrada. Verifique o número ou cadastre-se.');
      }
      throw new Error('Erro ao fazer login. Tente novamente.');
    }
    
    return await response.json();
  },

  async register(data) {
    const response = await fetch(API_ENDPOINTS.STUDENT.REGISTER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      if (response.status === 400) {
        throw new Error('Matrícula já cadastrada. Faça login ao invés de se cadastrar.');
      }
      throw new Error('Erro ao cadastrar. Tente novamente.');
    }
    
    return await response.json();
  },
};

export const certificateApi = {
  async submit(enrollmentNumber, file) {
    const formData = new FormData();
    formData.append('enrollment_number', enrollmentNumber);
    formData.append('file', file);

    const response = await fetch(API_ENDPOINTS.CERTIFICATE.SUBMIT, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      if (response.status === 400) {
        throw new Error('Este certificado já foi enviado anteriormente.');
      }
      throw new Error('Erro ao enviar certificado. Tente novamente.');
    }
    
    return await response.json();
  },
};
