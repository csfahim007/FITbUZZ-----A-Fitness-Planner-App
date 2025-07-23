import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import { motion } from 'framer-motion';

export default function Navbar() {
  const { token, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // Get current location

  const handleLogout = async () => {
    try {
      console.log('Initiating logout...');
      dispatch(logout());
      console.log('Redux state cleared, redirecting to /login');
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      dispatch(logout());
      window.location.href = '/login';
    }
  };

  const handleLinkClick = (path) => {
    console.log(`Navigating to: ${path}`);
  };

  // Helper function to check if a link is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-emerald-500 to-cyan-500 shadow-lg w-full"
    >
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link
              to="/"
              onClick={() => handleLinkClick('/')}
              className="text-2xl font-extrabold text-white text-shadow-sm"
            >
              FITbUZZ           -সুসাস্থ্য অ্যাপ            

            </Link>
          </div>
          
          <div className="flex items-center space-x-6">
            {token ? (
              <>
                <Link
                  to="/"
                  onClick={() => handleLinkClick('/')}
                  className={`text-white font-semibold transition duration-300 ${
                    isActive('/') ? 'text-gray-100 underline' : 'hover:text-gray-100'
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/dashboard"
                  onClick={() => handleLinkClick('/dashboard')}
                  className={`text-white font-semibold transition duration-300 ${
                    isActive('/dashboard') ? 'text-gray-100 underline' : 'hover:text-gray-100'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/workouts"
                  onClick={() => handleLinkClick('/workouts')}
                  className={`text-white font-semibold transition duration-300 ${
                    isActive('/workouts') ? 'text-gray-100 underline' : 'hover:text-gray-100'
                  }`}
                >
                  Workouts
                </Link>
                <Link
                  to="/exercises"
                  onClick={() => handleLinkClick('/exercises')}
                  className={`text-white font-semibold transition duration-300 ${
                    isActive('/exercises') ? 'text-gray-100 underline' : 'hover:text-gray-100'
                  }`}
                >
                  Exercises
                </Link>
                <Link
                  to="/nutrition"
                  onClick={() => handleLinkClick('/nutrition')}
                  className={`text-white font-semibold transition duration-300 ${
                    isActive('/nutrition') ? 'text-gray-100 underline' : 'hover:text-gray-100'
                  }`}
                >
                  Nutrition
                </Link>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="bg-cyan-600 text-white py-2 px-4 rounded-full hover:bg-cyan-700 transition duration-300 shadow-md hover:shadow-lg font-semibold"
                >
                  Logout
                </motion.button>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  onClick={() => handleLinkClick('/')}
                  className={`text-white font-semibold transition duration-300 ${
                    isActive('/') ? 'text-gray-100 underline' : 'hover:text-gray-100'
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/login"
                  onClick={() => handleLinkClick('/login')}
                  className={`text-white font-semibold transition duration-300 ${
                    isActive('/login') ? 'text-gray-100 underline' : 'hover:text-gray-100'
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => handleLinkClick('/register')}
                  className={`text-white font-semibold transition duration-300 ${
                    isActive('/register') ? 'text-gray-100 underline' : 'hover:text-gray-100'
                  }`}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}