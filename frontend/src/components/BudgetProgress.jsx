import { useState, useEffect } from 'react';
import { budgetAPI } from '../services/api';
import { Trash2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Colors } from 'chart.js';

export default function BudgetProgress({ budget, onDelete }) {
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    fetchProgress();
  }, [budget.id]);

  const fetchProgress = async () => {
    try {
      const response = await budgetAPI.getProgress(budget.id);
      setProgress(response.data);
    } catch (err) {
      console.error('Failed to fetch budget progress:', err);
    }
  };

  const handleDelete = async () => {
    try {
      await budgetAPI.delete(budget.id);
      console.log('Budget deleted successfully');
      if (onDelete) {
        onDelete(budget.id);
      }
    } catch (err) {
      console.error('Failed to delete budget:', err);
    }
  };

  if (!progress) return null;

  const budgetLimit = Number(budget.limit) || 0;
  const totalSpent = Number(progress.total_spent) || 0;
  const percentage = budgetLimit > 0 ? (totalSpent / budgetLimit) * 100 : 0;
  
  // Data for the donut chart
  const data = [
    { name: 'Spent', value: totalSpent },
    { name: 'Remaining', value: Math.max(0, budgetLimit - totalSpent) }
  ];

  // Colors for the chart
  const COLORS = ['#3B82F6', '#E5E7EB'];

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{budget.category_name}</h3>
        <button 
          onClick={handleDelete}
          className="text-gray-400 hover:text-red-500"
        >
          <Trash2 size={20} />
        </button>
      </div>
      
      <div className="text-sm text-gray-600 mb-4">
        {new Date(budget.start_date).toLocaleDateString()} - {new Date(budget.end_date).toLocaleDateString()}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius="60%"
                outerRadius="100%"
                paddingAngle={0}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-col justify-center">
          <div className="text-2xl font-bold text-forest-800 mb-2">
            {percentage.toFixed(0)}%
          </div>
          <div className="text-sm text-gray-600">
            {totalSpent.toFixed(2)} RWF / {budgetLimit.toFixed(2)} RWF
          </div>
        </div>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
        <div
          className="bg-forest-800 rounded-full h-2"
          style={{ width: `${Math.min(100, percentage)}%` }}
        />
      </div>
    </div>
  );
}