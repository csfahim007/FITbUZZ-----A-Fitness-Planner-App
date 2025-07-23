const express = require('express');
const router = express.Router();
const nutritionController = require('../controllers/nutritionController');
const authController = require('../controllers/authController');

router.use(authController.protect);

router.route('/')
  .get(nutritionController.getNutritionLogs)
  .post(nutritionController.logNutrition);

router.route('/:id')
  .put(nutritionController.updateNutritionLog)
  .delete(nutritionController.deleteNutritionLog);

module.exports = router;