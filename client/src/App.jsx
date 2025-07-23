import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/common/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import WorkoutList from './pages/workouts/WorkoutList';
import WorkoutDetail from './pages/workouts/WorkoutDetail';
import WorkoutCreate from './pages/workouts/WorkoutCreate';
import ExerciseList from './pages/exercise/ExerciseList';
import ExerciseDetail from './pages/exercise/ExerciseDetail';
import ExerciseCreate from './pages/exercise/ExerciseCreate';
import NutritionTracker from './pages/nutrition/NutritionTracker';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Terms from './components/common/Terms';
import Privacy from './components/common/Privacy';
import Contact from './components/common/Contact';

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen m-0 p-0 w-full">
        <Navbar />
        <main className="flex-grow w-full">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/workouts" element={<WorkoutList />} />
              <Route path="/workouts/create" element={<WorkoutCreate />} />
              <Route path="/workouts/:id" element={<WorkoutDetail />} />
              <Route path="/exercises" element={<ExerciseList />} />
              <Route path="/exercises/create" element={<ExerciseCreate />} />
              <Route path="/exercises/:id" element={<ExerciseDetail />} />
              <Route path="/nutrition" element={<NutritionTracker />} />
            </Route>
            
            {/* 404 Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;