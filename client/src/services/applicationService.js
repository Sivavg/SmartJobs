import api from './api';

const applicationService = {
    applyForJob: async (formData) => {
        const response = await api.post('/applications', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
    getMyApplications: async () => {
        const response = await api.get('/applications/my');
        return response.data;
    },
    getJobApplications: async (jobId) => {
        const response = await api.get(`/applications/job/${jobId}`);
        return response.data;
    },
    updateStatus: async (id, status) => {
        const response = await api.patch(`/applications/${id}/status`, { status });
        return response.data;
    },
};

export default applicationService;
