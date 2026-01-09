const API_BASE_URL = '/api/v1';

export const API_ENDPOINTS = {
  STUDENT: {
    GET: (enrollmentNumber) => `${API_BASE_URL}/student/${enrollmentNumber}`,
    REGISTER: `${API_BASE_URL}/student/register`,
  },
  CERTIFICATE: {
    SUBMIT: `${API_BASE_URL}/certificate/submit`,
  },
};

export default API_BASE_URL;
