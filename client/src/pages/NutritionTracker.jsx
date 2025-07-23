import { useLogNutritionMutation, useGetNutritionLogsQuery } from '../../api/nutritionApi';

export default function NutritionTracker() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const { data: logs, isLoading } = useGetNutritionLogsQuery(date);
  const [logNutrition] = useLogNutritionMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    await logNutrition({
      date,
      food: formData.get('food'),
      calories: Number(formData.get('calories')),
      protein: Number(formData.get('protein')),
    });
    e.target.reset();
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Nutrition Tracker</h1>
      <input 
        type="date" 
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="mb-4 p-2 border rounded"
      />
      
      <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-4 gap-4">
        <input name="food" placeholder="Food" className="border p-2 rounded" required />
        <input name="calories" type="number" placeholder="Calories" className="border p-2 rounded" required />
        <input name="protein" type="number" placeholder="Protein (g)" className="border p-2 rounded" required />
        <button type="submit" className="bg-green-500 text-white p-2 rounded">Add</button>
      </form>

      <div className="space-y-2">
        {logs?.map(log => (
          <div key={log._id} className="border p-3 rounded flex justify-between">
            <div>
              <h3 className="font-medium">{log.food}</h3>
              <p className="text-sm text-gray-600">{log.calories} cal • {log.protein}g protein</p>
            </div>
            <button className="text-red-500">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}