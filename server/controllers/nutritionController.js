const Nutrition = require('../models/Nutrition');
const asyncHandler = require('express-async-handler');

// @desc    Get nutrition logs
// @route   GET /api/nutrition
// @access  Private
exports.getNutritionLogs = asyncHandler(async (req, res) => {
  const { date } = req.query;
  const query = { user: req.user.id };
  
  if (date) {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);
    
    query.date = { $gte: startDate, $lte: endDate };
  }

  const logs = await Nutrition.find(query).sort('-date');
  res.json(logs);
});

// @desc    Add nutrition log
// @route   POST /api/nutrition
// @access  Private
exports.logNutrition = asyncHandler(async (req, res) => {
  const { food, calories, protein, carbs, fats } = req.body;
  
  const nutrition = await Nutrition.create({
    user: req.user.id,
    food,
    calories,
    protein,
    carbs,
    fats
  });

  res.status(201).json(nutrition);
});

// @desc    Update nutrition log
// @route   PUT /api/nutrition/:id
// @access  Private
exports.updateNutritionLog = asyncHandler(async (req, res) => {
  const nutrition = await Nutrition.findById(req.params.id);
  
  if (!nutrition) {
    res.status(404);
    throw new Error('Nutrition log not found');
  }

  if (nutrition.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized');
  }

  const { food, calories, protein, carbs, fats } = req.body;

  const updatedNutrition = await Nutrition.findByIdAndUpdate(
    req.params.id,
    {
      food,
      calories,
      protein,
      carbs,
      fats
    },
    {
      new: true,
      runValidators: true
    }
  );

  res.json(updatedNutrition);
});

// @desc    Delete nutrition log
// @route   DELETE /api/nutrition/:id
// @access  Private
exports.deleteNutritionLog = asyncHandler(async (req, res) => {
  const nutrition = await Nutrition.findById(req.params.id);
  
  if (!nutrition) {
    res.status(404);
    throw new Error('Nutrition log not found');
  }

  if (nutrition.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized');
  }

  // Use deleteOne() instead of remove() for newer Mongoose versions
  await nutrition.deleteOne();
  res.json({ success: true });
});