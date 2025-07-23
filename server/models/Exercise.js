const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  muscleGroup: {
    type: String,
    required: true,
    enum: ['chest', 'back', 'arms', 'shoulders', 'legs', 'core', 'full-body']
  },
  equipment: {
    type: String,
    enum: ['barbell', 'dumbbell', 'machine', 'bodyweight', 'kettlebell', 'cable', 'bands', 'other'],
    default: 'bodyweight'
  },
  instructions: {
    type: String,
    trim: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  caloriesPerRep: {
    type: Number,
    default: 0,
    min: [0, 'Calories per rep cannot be negative']
  }
}, { timestamps: true });

module.exports = mongoose.model('Exercise', exerciseSchema);