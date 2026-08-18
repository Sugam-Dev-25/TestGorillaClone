import API from './axiosInstance';

// Candidate Login
export const loginCandidate = async (credentials) => {
  const response = await API.post('/auth/login', credentials);
  return response.data; // পুরো API response রিটার্ন করছে (যার ভেতর token & user থাকবে)
};

// Candidate Register
export const registerCandidate = async (userData) => {
  const response = await API.post('/auth/register', { 
    ...userData, 
    role: 'candidate' 
  });
  return response.data;
};

// Assessment Details Fetch
export const fetchAssessmentDetails = async (id) => {
  const response = await API.get(`/candidate/assessments/start/${id}`);
  // ব্যাকএন্ড response.data.data অথবা response.data যাই পাঠাক, সেফলি হ্যান্ডেল করার জন্য
  return response.data?.data || response.data;
};

// Submit Assessment Answers
export const submitCandidateAssessment = async ({ id, answers }) => {
  const response = await API.post(`/candidate/assessments/submit/${id}`, { 
    userAnswers: answers 
  });
  return response.data;
};

// Download PDF Certificate
export const downloadCandidateCertificate = async (attemptId) => {
  const response = await API.get(`/candidate/certificate/download/${attemptId}`, {
    responseType: 'blob',
  });
  return response.data; // PDF Blob Data
};