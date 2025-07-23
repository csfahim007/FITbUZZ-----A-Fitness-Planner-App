const Workout = require('../models/Workout');
const Exercise = require('../models/Exercise');
const asyncHandler = require('express-async-handler');

// @desc Get all workouts for logged in user
// @route GET /api/workouts
// @access Private
exports.getWorkouts = asyncHandler(async (req, res) => {
  const workouts = await Workout.find({ user: req.user.id }).populate('exercises.exercise');
  const workoutsWithCalories = workouts.map(workout => {
    const totalCalories = workout.exercises.reduce((sum, ex) => {
      return sum + (ex.exercise.caloriesPerRep * ex.sets * ex.reps || 0);
    }, 0);
    return { ...workout._doc, totalCalories };
  });
  res.status(200).json({ success: true, count: workoutsWithCalories.length, data: workoutsWithCalories });
});

// @desc Get single workout
// @route GET /api/workouts/:id
// @access Private
exports.getWorkout = asyncHandler(async (req, res) => {
  const workout = await Workout.findById(req.params.id).populate('exercises.exercise');

  if (!workout) {
    res.status(404);
    throw new Error('Workout not found');
  }

  if (workout.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized');
  }

  const totalCalories = workout.exercises.reduce((sum, ex) => {
    return sum + (ex.exercise.caloriesPerRep * ex.sets * ex.reps || 0);
  }, 0);

  res.status(200).json({ success: true, data: { ...workout._doc, totalCalories } });
});

// @desc Create new workout
// @route POST /api/workouts
// @access Private
exports.createWorkout = asyncHandler(async (req, res) => {
  const { name, exercises } = req.body;

  const workout = await Workout.create({
    user: req.user.id,
    name,
    exercises: exercises || []
  });

  const populatedWorkout = await Workout.findById(workout._id).populate('exercises.exercise');
  const totalCalories = populatedWorkout.exercises.reduce((sum, ex) => {
    return sum + (ex.exercise.caloriesPerRep * ex.sets * ex.reps || 0);
  }, 0);

  res.status(201).json({ success: true, data: { ...populatedWorkout._doc, totalCalories } });
});

// @desc Update workout
// @route PUT /api/workouts/:id
// @access Private
exports.updateWorkout = asyncHandler(async (req, res) => {
  let workout = await Workout.findById(req.params.id);

  if (!workout) {
    res.status(404);
    throw new Error('Workout not found');
  }

  if (workout.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized');
  }

  workout = await Workout.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).populate('exercises.exercise');

  const totalCalories = workout.exercises.reduce((sum, ex) => {
    return sum + (ex.exercise.caloriesPerRep * ex.sets * ex.reps || 0);
  }, 0);

  res.status(200).json({ success: true, data: { ...workout._doc, totalCalories } });
});

// @desc Delete workout
// @route DELETE /api/workouts/:id
// @access Private
exports.deleteWorkout = asyncHandler(async (req, res) => {
  const workout = await Workout.findById(req.params.id);

  if (!workout) {
    res.status(404);
    throw new Error('Workout not found');
  }

  if (workout.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized');
  }

  await workout.remove();

  res.status(200).json({ success: true, data: {} });
});