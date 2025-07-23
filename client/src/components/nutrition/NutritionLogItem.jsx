import { useState } from 'react';
import { useDeleteNutritionLogMutation, useUpdateNutritionLogMutation } from '../../api/nutritionApi';

export default function NutritionLogItem({ log }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    food: log.food,
    calories: log.calories,
    protein: log.protein,
    carbs: log.carbs,
    fats: log.fats
  });
  
  const [deleteNutritionLog, { isLoading: isDeleting }] = useDeleteNutritionLogMutation();
  const [updateNutritionLog, { isLoading: isUpdating }] = useUpdateNutritionLogMutation();

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this nutrition log?')) {
      try {
        await deleteNutritionLog(log._id).unwrap();
      } catch (error) {
        console.error('Failed to delete nutrition log:', error);
        alert('Failed to delete nutrition log');
      }
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await updateNutritionLog({
        id: log._id,
        ...editData
      }).unwrap();
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update nutrition log:', error);
      alert('Failed to update nutrition log');
    }
  };

  const handleCancel = () => {
    setEditData({
      food: log.food,
      calories: log.calories,
      protein: log.protein,
      carbs: log.carbs,
      fats: log.fats
    });
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: name === 'food' ? value : Number(value)
    }));
  };

  if (isEditing) {
    return (
      <div className="border rounded-lg p-4 mb-3 bg-gray-50">
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 mb-4">
          <input
            type="text"
            name="food"
            value={editData.food}
            onChange={handleChange}
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Food name"
          />
          <input
            type="number"
            name="calories"
            value={editData.calories}
            onChange={handleChange}
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Calories"
            min="0"
          />
          <input
            type="number"
            name="protein"
            value={editData.protein}
            onChange={handleChange}
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Protein (g)"
            step="0.1"
            min="0"
          />
          <input
            type="number"
            name="carbs"
            value={editData.carbs}
            onChange={handleChange}
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Carbs (g)"
            step="0.1"
            min="0"
          />
          <input
            type="number"
            name="fats"
            value={editData.fats}
            onChange={handleChange}
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Fats (g)"
            step="0.1"
            min="0"
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isUpdating}
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isUpdating ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-4 flex justify-between items-center mb-3 bg-white">
      <div>
        <h3 className="font-medium">{log.food}</h3>
        <div className="flex flex-wrap gap-2 mt-1">
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {log.calories} cal
          </span>
          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
            P: {log.protein}g
          </span>
          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
            C: {log.carbs}g
          </span>
          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
            F: {log.fats}g
          </span>
        </div>
      </div>
      <div className="flex space-x-2">
        <button 
          onClick={handleEdit}
          className="text-blue-500 hover:text-blue-700 text-sm font-medium px-3 py-1 rounded hover:bg-blue-50 transition-colors"
        >
          Edit
        </button>
        <button 
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-red-500 hover:text-red-700 text-sm font-medium px-3 py-1 rounded hover:bg-red-50 transition-colors disabled:opacity-50"
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
}