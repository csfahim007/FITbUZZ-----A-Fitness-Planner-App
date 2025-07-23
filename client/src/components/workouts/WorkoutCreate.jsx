import { useState } from 'react';
import { useCreateWorkoutMutation } from '../../api/workoutApi';
import { useGetExercisesQuery } from '../../api/exerciseApi';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Loader from '../../components/common/Loader';

export default function WorkoutCreate() {
  const [name, setName] = useState('');
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [exerciseDetails, setExerciseDetails] = useState({});
  
  const [createWorkout, { isLoading: isCreating }] = useCreateWorkoutMutation();
  const { data: exercises = [], isLoading: exercisesLoading } = useGetExercisesQuery();
  const navigate = useNavigate();

  const exerciseOptions = exercises.map(exercise => ({
    value: exercise._id,
    label: exercise.name,
    muscleGroup: exercise.muscleGroup
  }));

  const handleExerciseChange = (selected) => {
    setSelectedExercises(selected);
    
    // Initialize default values for new exercises
    const newDetails = {...exerciseDetails};
    selected.forEach(ex => {
      if (!newDetails[ex.value]) {
        newDetails[ex.value] = { sets: 3, reps: 10, weight: 0 };
      }
    });
    setExerciseDetails(newDetails);
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
          exercise: ex.value,
          ...exerciseDetails[ex.value]
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
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Create New Workout</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Workout Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Upper Body Routine"
          required
        />
        
        <div>
          <label className="block text-sm font-medium mb-2">Exercises</label>
          <Select
            isMulti
            options={exerciseOptions}
            value={selectedExercises}
            onChange={handleExerciseChange}
            isLoading={exercisesLoading}
            className="basic-multi-select"
            classNamePrefix="select"
            placeholder="Search and select exercises..."
            noOptionsMessage={() => "No exercises found"}
          />
        </div>

        {selectedExercises.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-medium">Exercise Details</h3>
            {selectedExercises.map(exercise => (
              <div key={exercise.value} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium">{exercise.label}</h4>
                  <span className="text-sm text-gray-500 capitalize">
                    {exercise.muscleGroup}
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Sets</label>
                    <input
                      type="number"
                      min="1"
                      value={exerciseDetails[exercise.value]?.sets || 3}
                      onChange={(e) => handleDetailChange(exercise.value, 'sets', e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Reps</label>
                    <input
                      type="number"
                      min="1"
                      value={exerciseDetails[exercise.value]?.reps || 10}
                      onChange={(e) => handleDetailChange(exercise.value, 'reps', e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Weight (kg)</label>
                    <input
                      type="number"
                      min="0"
                      value={exerciseDetails[exercise.value]?.weight || 0}
                      onChange={(e) => handleDetailChange(exercise.value, 'weight', e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            onClick={() => navigate('/workouts')}
            className="bg-gray-200 text-gray-800 hover:bg-gray-300"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isCreating}
            className="bg-blue-500 text-white hover:bg-blue-600"
            disabled={!name || selectedExercises.length === 0}
          >
            {isCreating ? 'Creating...' : 'Create Workout'}
          </Button>
        </div>
      </form>
    </div>
  );
}