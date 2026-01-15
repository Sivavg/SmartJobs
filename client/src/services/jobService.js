import api from './api';

const jobService = {
    getAllJobs: async (params) => {
        const response = await api.get('/jobs', { params });
        return response.data;
    },
    getJobById: async (id) => {
        const response = await api.get(`/jobs/${id}`);
        return response.data;
    },
    getRelatedJobs: async (id) => {
        const response = await api.get(`/jobs/${id}/related`);
        return response.data;
    },
    createJob: async (jobData) => {
        const response = await api.post('/jobs', jobData);
        return response.data;
    },
};

export default jobService;
