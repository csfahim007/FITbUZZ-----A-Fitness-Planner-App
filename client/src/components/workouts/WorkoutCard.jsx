import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export default function WorkoutCard({ workout }) {
  return (
    <Link 
      to={`/workouts/${workout._id}`}
      className="block border p-4 rounded hover:bg-gray-50 transition"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">{workout.name}</h3>
          <p className="text-sm text-gray-600">
            {workout.exercises?.length || 0} exercises
          </p>
        </div>
        <span className="text-sm text-gray-500">
          {format(new Date(workout.date), 'MMM d, yyyy')}
        </span>
      </div>
    </Link>
  );
}