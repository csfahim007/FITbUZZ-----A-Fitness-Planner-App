const express = require('express');
const router = express.Router();
const exerciseController = require('../controllers/exerciseController');
const authController = require('../controllers/authController');

// Protect all routes
router.use(authController.protect);

// GET /api/exercises - Get all exercises for user
// POST /api/exercises - Create new exercise
router.route('/')
  .get(exerciseController.getExercises)
  .post(exerciseController.createExercise);

// GET /api/exercises/:id - Get single exercise
// PUT /api/exercises/:id - Update exercise
// DELETE /api/exercises/:id - Delete exercise
router.route('/:id')
  .get(exerciseController.getExercise)
  .put(exerciseController.updateExercise)
  .delete(exerciseController.deleteExercise);

module.exports = router;