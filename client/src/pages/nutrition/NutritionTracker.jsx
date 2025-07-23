import { useState } from 'react';
import { useGetNutritionLogsQuery, useLogNutritionMutation } from '../../api/nutritionApi';
import NutritionLogItem from '../../components/nutrition/NutritionLogItem';
import NutritionSummary from '../../components/nutrition/NutritionSummary';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { motion, AnimatePresence } from 'framer-motion';

export default function NutritionTracker() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const { data: logs, isLoading, error, refetch } = useGetNutritionLogsQuery(date);
  const [logNutrition, { isLoading: isLogging }] = useLogNutritionMutation();
  const [formData, setFormData] = useState({
    food: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: ''
  });
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    try {
      await logNutrition({
        ...formData,
        date: new Date().toISOString(),
        calories: Number(formData.calories),
        protein: Number(formData.protein),
        carbs: Number(formData.carbs),
        fats: Number(formData.fats)
      }).unwrap();
      setFormData({
        food: '',
        calories: '',
        protein: '',
        carbs: '',
        fats: ''
      });
    } catch (err) {
      setFormError(err?.data?.message || 'Failed to log nutrition');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen flex items-center justify-center bg-gray-50"
      >
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg max-w-md w-full text-center">
          <p className="font-semibold">Error</p>
          <p>{error?.data?.message || error.message || 'Failed to load nutrition data'}</p>
          <Button
            onClick={refetch}
            className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-4 py-2"
          >
            Retry
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-4xl font-extrabold text-gray-900 tracking-tight mb-8"
        >
          Nutrition Tracker
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-8 bg-white rounded-xl shadow-lg p-6 sm:p-8"
        >
          <label htmlFor="date" className="block text-sm font-medium text-gray-600 mb-2">
            Select Date
          </label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none"
            aria-label="Select date for nutrition logs"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Add Food Entry</h2>
          {formError && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-4">
              {formError}
            </div>
          )}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <Input
              name="food"
              placeholder="Food name"
              value={formData.food}
              onChange={handleChange}
              required
              aria-label="Food name"
              className="border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
            />
            <Input
              name="calories"
              type="number"
              placeholder="Calories"
              value={formData.calories}
              onChange={handleChange}
              required
              min="0"
              aria-label="Calories"
              className="border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
            />
            <Input
              name="protein"
              type="number"
              step="0.1"
              placeholder="Protein (g)"
              value={formData.protein}
              onChange={handleChange}
              required
              min="0"
              aria-label="Protein in grams"
              className="border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
            />
            <Input
              name="carbs"
              type="number"
              step="0.1"
              placeholder="Carbs (g)"
              value={formData.carbs}
              onChange={handleChange}
              required
              min="0"
              aria-label="Carbohydrates in grams"
              className="border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
            />
            <Input
              name="fats"
              type="number"
              step="0.1"
              placeholder="Fats (g)"
              value={formData.fats}
              onChange={handleChange}
              required
              min="0"
              aria-label="Fats in grams"
              className="border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
            />
            <Button
              type="submit"
              isLoading={isLogging}
              className="sm:col-span-2 lg:col-span-5 bg-emerald-600 hover:bg-emerald-700 rounded-full shadow-md hover:shadow-lg py-3 px-6 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              aria-label="Log nutrition entry"
            >
              Log Nutrition
            </Button>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <NutritionSummary logs={logs || []} date={date} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
          className="space-y-4"
        >
          {isLoading ? (
            <Loader />
          ) : (
            <AnimatePresence>
              {(!logs || logs.length === 0) ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-8 bg-white rounded-xl shadow-lg text-gray-500"
                >
                  No nutrition logs for this date
                </motion.div>
              ) : (
                logs.map((log, index) => (
                  <motion.div
                    key={log._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <NutritionLogItem log={log} />
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}