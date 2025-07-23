import { Link } from 'react-router-dom';

export default function ExerciseCard({ exercise }) {
  if (!exercise || !exercise._id) {
    return (
      <div className="border rounded-lg p-4 bg-red-50">
        <p className="text-red-600">Invalid exercise data</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
      <h3 className="font-medium text-lg">{exercise.name}</h3>
      <p className="text-sm text-gray-600 capitalize">
        {exercise.muscleGroup} • {exercise.equipment}
      </p>
      <Link 
        to={`/exercises/${exercise._id}`} 
        className="text-emerald-600 hover:text-emerald-700 text-sm mt-2 inline-block"
      >
        View Details →
      </Link>
    </div>
  );
}