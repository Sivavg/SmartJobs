import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const ApplicationsPerJobChart = ({ applications, jobs }) => {
    // Calculate applications per job
    const jobApplicationCounts = {};

    applications.forEach(app => {
        const jobTitle = app.job?.title || 'Unknown';
        jobApplicationCounts[jobTitle] = (jobApplicationCounts[jobTitle] || 0) + 1;
    });

    const chartData = Object.entries(jobApplicationCounts).map(([title, count]) => ({
        jobTitle: title.length > 20 ? title.substring(0, 20) + '...' : title,
        applications: count
    }));

    const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#3b82f6', '#14b8a6'];

    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Applications Per Job</h3>
            {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                            dataKey="jobTitle"
                            tick={{ fontSize: 12 }}
                            angle={-15}
                            textAnchor="end"
                            height={80}
                        />
                        <YAxis />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#fff',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                            }}
                        />
                        <Legend />
                        <Bar dataKey="applications" fill="#6366f1" radius={[8, 8, 0, 0]}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            ) : (
                <div className="text-center py-12 text-gray-500">
                    <p>No application data available</p>
                </div>
            )}
        </div>
    );
};

export default ApplicationsPerJobChart;
