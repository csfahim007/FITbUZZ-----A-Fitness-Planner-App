const Exercise = require('../models/Exercise');
const asyncHandler = require('express-async-handler');

// @desc Get all exercises for user
// @route GET /api/exercises
// @access Private
exports.getExercises = asyncHandler(async (req, res) => {
  const exercises = await Exercise.find({ user: req.user.id });
  res.status(200).json({ success: true, count: exercises.length, data: exercises });
});

// @desc Get single exercise
// @route GET /api/exercises/:id
// @access Private
exports.getExercise = asyncHandler(async (req, res) => {
  console.log('Fetching exercise with ID:', req.params.id);
  const exercise = await Exercise.findById(req.params.id);

  if (!exercise) {
    console.log('Exercise not found for ID:', req.params.id);
    res.status(404);
    throw new Error('Exercise not found');
  }

  if (exercise.user.toString() !== req.user.id) {
    console.log('Unauthorized access attempt for exercise:', req.params.id);
    res.status(401);
    throw new Error('Not authorized');
  }

  res.status(200).json({ success: true, data: exercise });
});

// @desc Create new exercise
// @route POST /api/exercises
// @access Private
exports.createExercise = asyncHandler(async (req, res) => {
  const { name, muscleGroup, equipment, instructions, caloriesPerRep } = req.body;

  const exercise = await Exercise.create({
    user: req.user.id,
    name,
    muscleGroup,
    equipment,
    instructions,
    caloriesPerRep: caloriesPerRep || 0
  });

  res.status(201).json({ success: true, data: exercise });
});

// @desc Update exercise
// @route PUT /api/exercises/:id
// @access Private
exports.updateExercise = asyncHandler(async (req, res) => {
  let exercise = await Exercise.findById(req.params.id);

  if (!exercise) {
    res.status(404);
    throw new Error('Exercise not found');
  }

  if (exercise.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized');
  }

  exercise = await Exercise.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({ success: true, data: exercise });
});

// @desc Delete exercise
// @route DELETE /api/exercises/:id
// @access Private
exports.deleteExercise = asyncHandler(async (req, res) => {
  const exercise = await Exercise.findById(req.params.id);

  if (!exercise) {
    res.status(404);
    throw new Error('Exercise not found');
  }

  if (exercise.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized');
  }

  await exercise.remove();

  res.status(200).json({ success: true, data: {} });
});