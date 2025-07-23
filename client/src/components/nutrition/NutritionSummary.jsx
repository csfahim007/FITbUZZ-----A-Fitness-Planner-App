import { motion } from 'framer-motion';

export default function NutritionSummary({ logs = [], date }) {
  // Safely calculate totals with fallback to empty array
  const totals = (logs || []).reduce(
    (acc, log) => ({
      calories: acc.calories + (log?.calories || 0),
      protein: acc.protein + (log?.protein || 0),
      carbs: acc.carbs + (log?.carbs || 0),
      fats: acc.fats + (log?.fats || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  const macroCalories = {
    protein: totals.protein * 4,
    carbs: totals.carbs * 4,
    fats: totals.fats * 9,
  };

  const totalMacroCalories = macroCalories.protein + macroCalories.carbs + macroCalories.fats;

  const macroPercentages = totalMacroCalories > 0 ? {
    protein: Math.round((macroCalories.protein / totalMacroCalories) * 100),
    carbs: Math.round((macroCalories.carbs / totalMacroCalories) * 100),
    fats: Math.round((macroCalories.fats / totalMacroCalories) * 100),
  } : { protein: 0, carbs: 0, fats: 0 };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-lg p-6 mb-8"
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Daily Summary - {new Date(date).toLocaleDateString()}
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-emerald-600">{totals.calories}</div>
          <div className="text-sm text-gray-600">Calories</div>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600">{totals.protein.toFixed(1)}g</div>
          <div className="text-sm text-gray-600">Protein ({macroPercentages.protein}%)</div>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-orange-600">{totals.carbs.toFixed(1)}g</div>
          <div className="text-sm text-gray-600">Carbs ({macroPercentages.carbs}%)</div>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-600">{totals.fats.toFixed(1)}g</div>
          <div className="text-sm text-gray-600">Fats ({macroPercentages.fats}%)</div>
        </div>
      </div>

      {(!logs || logs.length === 0) && (
        <div className="mt-4 text-center text-gray-500">
          No nutrition data for this date
        </div>
      )}
    </motion.div>
  );
}