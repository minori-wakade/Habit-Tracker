import express from 'express';
import Habit from '../models/Habit.js';

const router = express.Router();

// Get all habits for the logged-in user
router.get('/', async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(habits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single habit
router.get('/:id', async (req, res) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, user: req.user._id });
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }
    res.json(habit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new habit
router.post('/', async (req, res) => {
  const habit = new Habit({
    user: req.user._id,
    title: req.body.title,
    frequency: req.body.frequency,
    color: req.body.color,
    icon: req.body.icon,
    notes: req.body.notes || ''
  });

  try {
    const newHabit = await habit.save();
    res.status(201).json(newHabit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a habit
router.patch('/:id', async (req, res) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, user: req.user._id });
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    if (req.body.title != null) habit.title = req.body.title;
    if (req.body.frequency != null) habit.frequency = req.body.frequency;
    if (req.body.color != null) habit.color = req.body.color;
    if (req.body.icon != null) habit.icon = req.body.icon;
    if (req.body.notes != null) habit.notes = req.body.notes;

    const updatedHabit = await habit.save();
    res.json(updatedHabit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a habit
router.delete('/:id', async (req, res) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, user: req.user._id });
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }
    await habit.deleteOne();
    res.json({ message: 'Habit deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Toggle habit completion for today
router.post('/:id/toggle', async (req, res) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, user: req.user._id });
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayStr = today.toDateString();
    const completedIndex = habit.completedDates.findIndex(
      date => new Date(date).toDateString() === todayStr
    );

    if (completedIndex > -1) {
      // Remove today from completed dates
      habit.completedDates.splice(completedIndex, 1);
    } else {
      // Add today to completed dates
      habit.completedDates.push(today);
    }

    // Recalculate streak
    habit.streak = habit.calculateStreak();
    
    const updatedHabit = await habit.save();
    res.json(updatedHabit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get analytics data
router.get('/analytics/weekly', async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user._id });
    const today = new Date();
    const weekData = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const dateStr = date.toDateString();
      let completed = 0;
      
      habits.forEach(habit => {
        const isCompleted = habit.completedDates.some(
          d => new Date(d).toDateString() === dateStr
        );
        if (isCompleted) completed++;
      });

      weekData.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        fullDate: date.toISOString(),
        completed,
        total: habits.length,
        percentage: habits.length > 0 ? Math.round((completed / habits.length) * 100) : 0
      });
    }

    res.json(weekData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
