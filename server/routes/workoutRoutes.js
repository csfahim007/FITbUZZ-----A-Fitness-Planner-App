const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/workoutController');
const authController = require('../controllers/authController');

// Protect all routes
router.use(authController.protect);

// GET /api/workouts - Get all workouts for logged in user
// POST /api/workouts - Create new workout
router.route('/')
  .get(workoutController.getWorkouts)
  .post(workoutController.createWorkout);

// GET /api/workouts/:id - Get single workout
// PUT /api/workouts/:id - Update workout
// DELETE /api/workouts/:id - Delete workout
router.route('/:id')
  .get(workoutController.getWorkout)
  .put(workoutController.updateWorkout)
  .delete(workoutController.deleteWorkout);

module.exports = router;