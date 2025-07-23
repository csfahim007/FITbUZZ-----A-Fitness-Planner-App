import { useEffect, useRef } from 'react';
import { useGetWorkoutsQuery } from '../api/workoutApi';
import { useGetExercisesQuery } from '../api/exerciseApi';
import Loader from '../components/common/Loader';
import { motion, AnimatePresence } from 'framer-motion';
import { Doughnut, Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  LineElement, 
  PointElement, 
  CategoryScale, 
  LinearScale,
  Filler // Add Filler plugin
} from 'chart.js';
import { format, subDays, eachDayOfInterval } from 'date-fns';
import { Link } from 'react-router-dom';
import WorkoutCard from '../components/workouts/WorkoutCard';

// Register Filler plugin for filled line charts
ChartJS.register(ArcElement, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, Filler);

export default function Dashboard() {
  const { data: workouts = [], isLoading: workoutsLoading, error: workoutsError } = useGetWorkoutsQuery();
  const { data: exercises = [], isLoading: exercisesLoading, error: exercisesError } = useGetExercisesQuery();
  const chartRef1 = useRef(null);
  const chartRef2 = useRef(null);
  const lineChartRef = useRef(null);

  // Clean up charts on unmount to prevent canvas reuse errors
  useEffect(() => {
    return () => {
      if (chartRef1.current) {
        chartRef1.current.destroy();
      }
      if (chartRef2.current) {
        chartRef2.current.destroy();
      }
      if (lineChartRef.current) {
        lineChartRef.current.destroy();
      }
    };
  }, []);

  // Debug logging
  useEffect(() => {
    console.log('Dashboard - Workouts:', workouts);
    console.log('Dashboard - Exercises:', exercises);
    console.log('Dashboard - Workouts Error:', workoutsError);
    console.log('Dashboard - Exercises Error:', exercisesError);
    console.log('Workout Dates:', workouts.map(w => ({ id: w._id, date: w.date, totalCalories: w.totalCalories })));
  }, [workouts, exercises, workoutsError, exercisesError]);

  if (workoutsLoading || exercisesLoading) {
    return <Loader />;
  }

  if (workoutsError || exercisesError) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen flex items-center justify-center bg-gray-50"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Error Loading Dashboard</h2>
          <p className="text-gray-600">{workoutsError?.data?.message || exercisesError?.data?.message || 'Failed to load data'}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 inline-flex items-center px-4 py-2 bg-cyan-600 text-white rounded-full hover:bg-cyan-700 transition"
          >
            Retry
          </button>
        </div>
      </motion.div>
    );
  }

  // Fallback for invalid data
  if (!Array.isArray(workouts) || !Array.isArray(exercises)) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen flex items-center justify-center bg-gray-50"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700">No Data Available</h2>
          <p className="text-gray-600">Start by creating exercises or workouts!</p>
          <Link
            to="/workouts/create"
            className="mt-4 inline-flex items-center px-4 py-2 bg-cyan-600 text-white rounded-full hover:bg-cyan-700 transition"
          >
            Create Workout
          </Link>
        </div>
      </motion.div>
    );
  }

  // Calculate workout frequency and calories
  const today = new Date();
  const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const dailyWorkouts = workouts.filter(workout => {
    const workoutDate = new Date(workout.date);
    return format(workoutDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
  }).length;
  const weeklyWorkouts = workouts.filter(workout => new Date(workout.date) >= startOfWeek).length;
  const monthlyWorkouts = workouts.filter(workout => new Date(workout.date) >= startOfMonth).length;

  const weeklyCalories = workouts
    .filter(workout => new Date(workout.date) >= startOfWeek)
    .reduce((sum, workout) => sum + (Number(workout.totalCalories) || 0), 0);
  const monthlyCalories = workouts
    .filter(workout => new Date(workout.date) >= startOfMonth)
    .reduce((sum, workout) => sum + (Number(workout.totalCalories) || 0), 0);

  // Fixed createGradient function - use addColorStop instead of addColorStart
  const createGradient = (ctx, chartArea, colorStart, colorEnd) => {
    const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
    gradient.addColorStop(0, colorStart); // Fixed: addColorStop instead of addColorStart
    gradient.addColorStop(1, colorEnd);
    return gradient;
  };

  // Calorie trend for the past 7 days
  const pastWeek = eachDayOfInterval({ start: subDays(today, 6), end: today });
  
  // Calculate calorie data for past week first
  const pastWeekCalorieData = pastWeek.map(date => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return workouts
      .filter(workout => format(new Date(workout.date), 'yyyy-MM-dd') === dateStr)
      .reduce((sum, workout) => sum + (Number(workout.totalCalories) || 0), 0);
  });

  // Check if calorie trend data is empty - define this BEFORE using it
  const hasCalorieData = workouts.length > 0 && pastWeekCalorieData.some(value => value > 0);

  const calorieTrendData = {
    labels: pastWeek.map(date => format(date, 'MMM d')),
    datasets: [{
      label: 'Calories Burned',
      data: hasCalorieData ? pastWeekCalorieData : new Array(7).fill(0),
      borderColor: '#14B8A6',
      backgroundColor: (context) => {
        const chart = context.chart;
        const { ctx, chartArea } = chart;
        if (!chartArea) return 'rgba(20, 184, 166, 0.2)';
        return createGradient(ctx, chartArea, 'rgba(20, 184, 166, 0.2)', 'rgba(20, 184, 166, 0.8)');
      },
      fill: true,
      tension: 0.4
    }]
  };

  // Muscle group distribution for exercises
  const muscleGroupCounts = exercises.reduce((acc, exercise) => {
    acc[exercise.muscleGroup] = (acc[exercise.muscleGroup] || 0) + 1;
    return acc;
  }, {});
  
  const hasExerciseData = exercises.length > 0 && Object.keys(muscleGroupCounts).length > 0;
  
  const muscleGroupData = {
    labels: hasExerciseData 
      ? Object.keys(muscleGroupCounts).map(label => label.charAt(0).toUpperCase() + label.slice(1))
      : ['No Exercises'],
    datasets: [{
      data: hasExerciseData ? Object.values(muscleGroupCounts) : [1],
      backgroundColor: hasExerciseData 
        ? ['#14B8A6', '#4F46E5', '#F87171', '#FBBF24', '#8B5CF6', '#EC4899', '#2DD4BF']
        : ['#E5E7EB'],
      hoverOffset: 20
    }]
  };

  // Weekly calorie burn chart
  const calorieData = {
    labels: ['Calories Burned', 'Remaining Goal'],
    datasets: [{
      data: [weeklyCalories, Math.max(5000 - weeklyCalories, 0)],
      backgroundColor: ['#14B8A6', '#E5E7EB'],
      hoverOffset: 20
    }]
  };

  // Recent workouts (last 5)
  const recentWorkouts = [...workouts]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 py-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-4xl font-extrabold text-cyan-900 tracking-tight mb-8"
        >
          Fitness Dashboard
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Calorie Burn Chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-xl shadow-md p-6 bg-gradient-to-br from-white to-teal-50"
          >
            <h2 className="text-xl font-semibold text-cyan-900 mb-4">Weekly Calories Burned</h2>
            <div className="relative h-64">
              <Doughnut
                ref={chartRef1}
                data={calorieData}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'bottom', labels: { color: '#1F2937' } },
                    tooltip: {
                      callbacks: {
                        label: (context) => `${context.label}: ${context.raw} kcal`
                      }
                    }
                  }
                }}
              />
            </div>
            <p className="text-center text-gray-700 mt-4 font-medium">
              {weeklyCalories} / 5000 kcal goal this week
            </p>
            {!weeklyCalories && (
              <p className="text-center text-gray-600 mt-2 text-sm">
                No calories burned this week. <Link to="/workouts/create" className="text-cyan-600 hover:text-cyan-700">Log a workout</Link> to start tracking!
              </p>
            )}
          </motion.div>

          {/* Muscle Group Distribution Chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-white rounded-xl shadow-md p-6 bg-gradient-to-br from-white to-teal-50"
          >
            <h2 className="text-xl font-semibold text-cyan-900 mb-4">Exercise Muscle Groups</h2>
            <div className="relative h-64">
              <Doughnut
                ref={chartRef2}
                data={muscleGroupData}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'bottom', labels: { color: '#1F2937' } },
                    tooltip: {
                      callbacks: {
                        label: (context) => hasExerciseData ? `${context.label}: ${context.raw} exercises` : 'No exercises logged'
                      }
                    }
                  }
                }}
              />
            </div>
            {!hasExerciseData && (
              <p className="text-center text-gray-600 mt-4 text-sm">
                No exercises logged. <Link to="/exercises/create" className="text-cyan-600 hover:text-cyan-700">Create an exercise</Link> to see muscle group distribution!
              </p>
            )}
          </motion.div>

          {/* Calorie Trend Chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="bg-white rounded-xl shadow-md p-6 lg:col-span-2 bg-gradient-to-br from-white to-teal-50"
          >
            <h2 className="text-xl font-semibold text-cyan-900 mb-4">Calorie Burn Trend (Past Week)</h2>
            <div className="relative h-64">
              <Line
                ref={lineChartRef}
                data={calorieTrendData}
                options={{
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: { display: true, text: 'Calories Burned (kcal)', color: '#1F2937' },
                      ticks: { color: '#1F2937' }
                    },
                    x: {
                      title: { display: true, text: 'Date', color: '#1F2937' },
                      ticks: { color: '#1F2937' }
                    }
                  },
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      callbacks: {
                        label: (context) => hasCalorieData ? `${context.raw} kcal` : 'No calories burned'
                      }
                    }
                  }
                }}
              />
              {!hasCalorieData && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-600 text-sm">
                  No calorie data for the past week. <Link to="/workouts/create" className="text-cyan-600 hover:text-cyan-700 ml-1">Log a workout</Link> to see trends!
                </div>
              )}
            </div>
          </motion.div>

          {/* Recent Workouts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.0 }}
            className="bg-white rounded-xl shadow-md p-6 lg:col-span-2 bg-gradient-to-br from-white to-teal-50"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-cyan-900">Recent Workouts</h2>
              <Link
                to="/workouts"
                className="text-cyan-600 hover:text-cyan-700 text-sm font-medium"
              >
                View All
              </Link>
            </div>
            <AnimatePresence>
              {recentWorkouts.length === 0 ? (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-gray-600 text-center"
                >
                  No workouts yet. <Link to="/workouts/create" className="text-cyan-600 hover:text-cyan-700">Create one</Link> to get started!
                </motion.p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recentWorkouts.map((workout, index) => (
                    <motion.div
                      key={workout._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <WorkoutCard workout={workout} />
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Progress Tracking */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className="bg-white rounded-xl shadow-md p-6 lg:col-span-2 bg-gradient-to-br from-white to-teal-50"
          >
            <h2 className="text-xl font-bold text-teal-700 mb-4">Your Progress</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-teal-50 p-4 rounded-lg">
                  <p className="text-gray-700 font-medium pb-3">Workouts Today</p>
                  <p className="text-2xl font-bold text-teal-600">{dailyWorkouts}</p>
                </div>
                <div className="bg-teal-50 p-4 rounded-lg">
                  <p className="text-gray-700 font-medium pb-3">Workouts This Week</p>
                  <p className="text-2xl font-bold text-teal-600">{weeklyWorkouts}</p>
                </div>
                <div className="bg-teal-50 p-4 rounded-lg">
                  <p className="text-gray-700 font-medium pb-3">Workouts This Month</p>
                  <p className="text-2xl font-bold text-teal-600">{monthlyWorkouts}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-teal-50 p-4 rounded-lg">
                  <p className="text-gray-700 font-medium pb-3">Weekly Calories Burned</p>
                  <p className="text-2xl font-bold text-teal-600 ">{weeklyCalories} kcal</p>
                </div>
                <div className="bg-teal-50 p-4 rounded-lg pb-3">
                  <p className="text-gray-700 font-medium pb-3">Monthly Calories Burned</p>
                  <p className="text-2xl font-bold text-teal-600">{monthlyCalories} kcal</p>
                </div>
              </div>
              <div className="space-y-2 pt-10 pb-10">
                <p className="text-lg font-medium text-teal-600">Total Workouts: {workouts.length}</p>
                <p className="text-lg font-medium text-teal-600">Total Exercises: {exercises.length}</p>
                <p className="text-lg font-medium text-teal-700">
                  Total Calories Burned (All Time)  :{' '}
                  {workouts.reduce((sum, workout) => sum + (Number(workout.totalCalories) || 0), 0)} kcal
                </p>
              </div>
              <Link
                to="/workouts/create"
                className="inline-flex items-center px-4 py-2 bg-cyan-600 text-white rounded-full hover:bg-cyan-700 transition"
              >
                Plan Next Workout
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}