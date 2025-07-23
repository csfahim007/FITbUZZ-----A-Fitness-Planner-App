import { useState } from 'react';
import { useCreateWorkoutMutation } from '../../api/workoutApi';
import { useGetExercisesQuery } from '../../api/exerciseApi';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Loader from '../../components/common/Loader';
import { motion, AnimatePresence } from 'framer-motion';

export default function WorkoutCreate() {
  const [name, setName] = useState('');
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [exerciseDetails, setExerciseDetails] = useState({});

  const [createWorkout, { isLoading: isCreating }] = useCreateWorkoutMutation();
  const { data: exercises = [], isLoading: exercisesLoading } = useGetExercisesQuery();
  const navigate = useNavigate();

  const handleExerciseToggle = (exercise) => {
    const isSelected = selectedExercises.some(ex => ex._id === exercise._id);
    if (isSelected) {
      setSelectedExercises(selectedExercises.filter(ex => ex._id !== exercise._id));
      const newDetails = { ...exerciseDetails };
      delete newDetails[exercise._id];
      setExerciseDetails(newDetails);
    } else {
      setSelectedExercises([...selectedExercises, exercise]);
      setExerciseDetails({
        ...exerciseDetails,
        [exercise._id]: { sets: 3, reps: 10, weight: 0 }
      });
    }
  };

  const handleDetailChange = (exerciseId, field, value) => {
    setExerciseDetails(prev => ({
      ...prev,
      [exerciseId]: {
        ...prev[exerciseId],
        [field]: Number(value) || 0
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || selectedExercises.length === 0) {
      alert('Please provide a workout name and select at least one exercise');
      return;
    }

    try {
      const workoutData = {
        name,
        exercises: selectedExercises.map(ex => ({
          exercise: ex._id,
          ...exerciseDetails[ex._id]
        }))
      };

      await createWorkout(workoutData).unwrap();
      navigate('/workouts');
    } catch (err) {
      console.error('Failed to create workout:', err);
      alert('Failed to create workout. Please try again.');
    }
  };

  if (exercisesLoading) return <Loader />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="content-container py-16 bg-gray-100"
    >
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-3xl font-extrabold text-gray-800 mb-8"
      >
        Create New Workout
      </motion.h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-xl shadow-lg p-6">
        <Input
          label="Workout Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Upper Body Routine"
          required
          className="border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
        />
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">Select Exercises</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto p-4 bg-gray-50 rounded-lg">
            <AnimatePresence>
              {exercises.length === 0 ? (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="col-span-full text-center text-gray-500"
                >
                  No exercises found. Create some exercises first!
                </motion.p>
              ) : (
                exercises.map((exercise, index) => (
                  <motion.div
                    key={exercise._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                      selectedExercises.some(ex => ex._id === exercise._id)
                        ? 'bg-emerald-100 border-emerald-500'
                        : 'bg-white hover:bg-emerald-50'
                    }`}
                    onClick={() => handleExerciseToggle(exercise)}
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-gray-800">{exercise.name}</h4>
                      <span className="text-sm text-gray-500 capitalize">{exercise.muscleGroup}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{exercise.equipment}</p>
                    {exercise.caloriesPerRep > 0 && (
                      <p className="text-sm text-gray-600 mt-1">{exercise.caloriesPerRep} kcal/rep</p>
                    )}
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
        {selectedExercises.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Exercise Details</h3>
            <AnimatePresence>
              {selectedExercises.map((exercise, index) => (
                <motion.div
                  key={exercise._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="border rounded-lg p-4"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium">{exercise.name}</h4>
                    <span className="text-sm text-gray-500 capitalize">{exercise.muscleGroup}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Sets</label>
                      <input
                        type="number"
                        min="1"
                        value={exerciseDetails[exercise._id]?.sets || 3}
                        onChange={(e) => handleDetailChange(exercise._id, 'sets', e.target.value)}
                        className="w-full p-2 border rounded focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Reps</label>
                      <input
                        type="number"
                        min="1"
                        value={exerciseDetails[exercise._id]?.reps || 10}
                        onChange={(e) => handleDetailChange(exercise._id, 'reps', e.target.value)}
                        className="w-full p-2 border rounded focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Weight (kg)</label>
                      <input
                        type="number"
                        min="0"
                        value={exerciseDetails[exercise._id]?.weight || 0}
                        onChange={(e) => handleDetailChange(exercise._id, 'weight', e.target.value)}
                        className="w-full p-2 border rounded focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            onClick={() => navigate('/workouts')}
            className="bg-gray-200 text-gray-800 hover:bg-gray-300 rounded-full"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isCreating}
            className="bg-emerald-600 text-white hover:bg-emerald-700 rounded-full"
            disabled={!name || selectedExercises.length === 0}
          >
            {isCreating ? 'Creating...' : 'Create Workout'}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}