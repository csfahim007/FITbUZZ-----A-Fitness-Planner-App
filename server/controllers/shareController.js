const Workout = require('../models/Workout');

exports.shareWorkout = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }
    
    // Generate shareable link (in real app, you'd create a share token)
    const shareLink = `${req.protocol}://${req.get('host')}/share/workout/${workout._id}`;
    
    res.json({ shareLink });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getSharedWorkout = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id).populate('exercises.exercise');
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }
    
    res.json(workout);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};