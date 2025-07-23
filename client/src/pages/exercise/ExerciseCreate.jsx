import { useState } from 'react';
import { useCreateExerciseMutation } from '../../api/exerciseApi';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { motion } from 'framer-motion';

export default function ExerciseCreate() {
  const [formData, setFormData] = useState({
    name: '',
    muscleGroup: 'chest',
    equipment: 'bodyweight',
    instructions: '',
    caloriesPerRep: 0
  });
  const [createExercise, { isLoading }] = useCreateExerciseMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createExercise(formData).unwrap();
      navigate('/exercises');
    } catch (err) {
      console.error('Failed to create exercise:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
        Create New Exercise
      </motion.h1>
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white rounded-xl shadow-lg p-6 space-y-6"
      >
        <Input
          label="Exercise Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
        />
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">Muscle Group</label>
          <select
            name="muscleGroup"
            value={formData.muscleGroup}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="chest">Chest</option>
            <option value="back">Back</option>
            <option value="arms">Arms</option>
            <option value="shoulders">Shoulders</option>
            <option value="legs">Legs</option>
            <option value="core">Core</option>
            <option value="full-body">Full Body</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">Equipment</label>
          <select
            name="equipment"
            value={formData.equipment}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="bodyweight">Bodyweight</option>
            <option value="barbell">Barbell</option>
            <option value="dumbbell">Dumbbell</option>
            <option value="machine">Machine</option>
            <option value="kettlebell">Kettlebell</option>
            <option value="cable">Cable</option>
            <option value="bands">Bands</option>
            <option value="other">Other</option>
          </select>
        </div>
        <Input
          label="Instructions"
          name="instructions"
          value={formData.instructions}
          onChange={handleChange}
          as="textarea"
          rows={3}
          className="border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
        />
        <Input
          label="Calories per Rep"
          name="caloriesPerRep"
          type="number"
          value={formData.caloriesPerRep}
          onChange={handleChange}
          min="0"
          className="border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
        />
        <Button
          type="submit"
          isLoading={isLoading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 rounded-full shadow-md hover:shadow-lg py-3 px-6 text-white font-semibold"
        >
          Create Exercise
        </Button>
      </motion.form>
    </motion.div>
  );
}