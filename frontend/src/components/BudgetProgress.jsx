import { useState, useEffect } from 'react';
import { budgetAPI } from '../services/api';
import { Trash2 } from 'lucide-react'; 

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
      // Call the API to delete the budget
      await budgetAPI.delete(budget.id);
      console.log('Budget deleted successfully');

      // Notify the parent component to remove the deleted budget
      if (onDelete) {
        onDelete(budget.id);
      }
    } catch (err) {
      console.error('Failed to delete budget:', err);
    }
  };

  if (!progress) return null;

  console.log('budget.limit:', budget.limit, typeof budget.limit);
  console.log('progress.total_spent:', progress.total_spent, typeof progress.total_spent);

  const budgetLimit = Number(budget.limit) || 0;
  const totalSpent = Number(progress.total_spent) || 0;
  const percentage = budgetLimit > 0 ? (totalSpent / budgetLimit) * 100 : 0;

  return (
    <div className="rounded-lg bg-white p-4 shadow">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">{budget.category_name}</h3>
        <Trash2
          onClick={handleDelete}
          className="text-red-500 hover:text-red-700 cursor-pointer"
          size={20} // Adjust the size of the icon
        />
      </div>
      <p className="text-sm text-gray-500">
        {new Date(budget.start_date).toLocaleDateString()} - {new Date(budget.end_date).toLocaleDateString()}
      </p>
      <div className="mt-4">
        <div className="relative pt-1">
          <div className="mb-2 flex items-center justify-between">
            <div>
              <span className="inline-block rounded-full bg-forest-200 px-2 py-1 text-xs font-semibold uppercase text-forest-800">
                {percentage.toFixed(0)}%
              </span>
            </div>
            <div className="text-right">
              <span className="text-sm font-semibold text-forest-900">
                {totalSpent.toFixed(2)} RWF / {budgetLimit.toFixed(2)} RWF
              </span>
            </div>
          </div>
          <div className="mb-4 h-2 overflow-hidden rounded bg-forest-200">
            <div
              style={{ width: `${percentage}%` }}
              className="h-2 rounded bg-forest-500"
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}