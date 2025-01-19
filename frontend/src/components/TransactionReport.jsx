import { useState } from 'react';
import { transactionAPI } from '../services/api';
import { format } from 'date-fns';

export default function TransactionReport() {
  const [dateRange, setDateRange] = useState({
    start_date: '',
    end_date: ''
  });
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Validate dates
      const start = new Date(dateRange.start_date);
      const end = new Date(dateRange.end_date);
      
      if (start > end) {
        setError('Start date must be before end date');
        setLoading(false);
        return;
      }
  
      // Format dates to match backend expectations (YYYY-MM-DD)
      const formattedDates = {
        start_date: dateRange.start_date,
        end_date: dateRange.end_date
      };
  
      const response = await transactionAPI.getReport(formattedDates);
      
      if (!response.data) {
        throw new Error('No data received from server');
      }
      
      setReport(response.data);
    } catch (err) {
      console.error('Report error:', err);
      setError(
        err.response?.data?.error || 
        'Failed to generate report. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Rest of the component remains the same as before
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Generate Transaction Report</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Start Date
                <input
                  type="date"
                  value={dateRange.start_date}
                  onChange={(e) => setDateRange({ ...dateRange, start_date: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-forest-900 focus:outline-none focus:ring-1 focus:ring-forest-900"
                  required
                />
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                End Date
                <input
                  type="date"
                  value={dateRange.end_date}
                  onChange={(e) => setDateRange({ ...dateRange, end_date: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-forest-900 focus:outline-none focus:ring-1 focus:ring-forest-900"
                  required
                />
              </label>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-forest-900 text-white px-4 py-2 rounded-md hover:bg-forest-800 focus:outline-none focus:ring-2 focus:ring-forest-900 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Generate Report'}
            </button>
          </div>
        </form>
        
        {error && (
          <div className="mt-4 bg-red-50 text-red-500 p-4 rounded-md">{error}</div>
        )}
      </div>

      {report && (
        <div className="bg-white p-6 rounded-lg shadow space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(report.summary || {}).map(([key, value]) => (
                <div key={key} className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-500 capitalize">{key.replace(/_/g, ' ')}</p>
                  <p className="text-lg font-semibold">{Number(value).toFixed(2)} RWF</p>
                </div>
              ))}
            </div>
          </div>

          {report.by_category?.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">By Category</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Count</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {report.by_category.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">{item.category__name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{Number(item.total).toFixed(2)} RWF</td>
                        <td className="px-6 py-4 whitespace-nowrap">{item.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {report.daily_totals?.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Daily Totals</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {report.daily_totals.map((day, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">{format(new Date(day.day), 'MMM d, yyyy')}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{Number(day.total).toFixed(2)} RWF</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}