import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const JobsVsApplicationsTrendChart = ({ jobs, applications }) => {
    // Group jobs and applications by month
    const monthlyData = {};

    // Process jobs
    jobs.forEach(job => {
        const date = new Date(job.createdAt);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

        if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = { month: monthKey, jobs: 0, applications: 0 };
        }
        monthlyData[monthKey].jobs++;
    });

    // Process applications
    applications.forEach(app => {
        const date = new Date(app.appliedAt);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

        if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = { month: monthKey, jobs: 0, applications: 0 };
        }
        monthlyData[monthKey].applications++;
    });

    // Convert to array and sort by month
    const chartData = Object.values(monthlyData)
        .sort((a, b) => a.month.localeCompare(b.month))
        .map(item => ({
            ...item,
            month: formatMonth(item.month)
        }));

    // Format month for display
    function formatMonth(monthKey) {
        const [year, month] = monthKey.split('-');
        const date = new Date(year, parseInt(month) - 1);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Jobs Posted vs Applications Trend</h3>
            {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                            dataKey="month"
                            tick={{ fontSize: 12 }}
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
                        <Line
                            type="monotone"
                            dataKey="jobs"
                            stroke="#6366f1"
                            strokeWidth={3}
                            dot={{ fill: '#6366f1', r: 5 }}
                            activeDot={{ r: 7 }}
                            name="Jobs Posted"
                        />
                        <Line
                            type="monotone"
                            dataKey="applications"
                            stroke="#10b981"
                            strokeWidth={3}
                            dot={{ fill: '#10b981', r: 5 }}
                            activeDot={{ r: 7 }}
                            name="Applications"
                        />
                    </LineChart>
                </ResponsiveContainer>
            ) : (
                <div className="text-center py-12 text-gray-500">
                    <p>No trend data available</p>
                </div>
            )}
        </div>
    );
};

export default JobsVsApplicationsTrendChart;
