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

  async getSubmissions(enrollmentNumber) {
    const response = await fetch(API_ENDPOINTS.CERTIFICATE.GET_SUBMISSIONS(enrollmentNumber));
    
    if (!response.ok) {
      throw new Error('Erro ao buscar certificados enviados.');
    }
    
    return await response.json();
  },
};

export const coordinatorApi = {
  async getPending(page = 1) {
    const response = await fetch(API_ENDPOINTS.COORDINATOR.GET_PENDING(page));
    
    if (!response.ok) {
      throw new Error('Erro ao buscar submissões pendentes.');
    }
    
    return await response.json();
  },

  async approve(submissionId, overrideData = null) {
    const options = {
      method: 'POST',
    };

    if (overrideData) {
      options.headers = {
        'Content-Type': 'application/json',
      };
      options.body = JSON.stringify(overrideData);
    }

    const response = await fetch(API_ENDPOINTS.COORDINATOR.APPROVE(submissionId), options);
    
    if (!response.ok) {
      throw new Error('Erro ao aprovar submissão.');
    }
    
    return await response.json();
  },

  async reject(submissionId, reason) {
    const response = await fetch(API_ENDPOINTS.COORDINATOR.REJECT(submissionId), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        coordinator_id: 1,
        reason,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Erro ao rejeitar submissão.');
    }
    
    return await response.json();
  },
};
