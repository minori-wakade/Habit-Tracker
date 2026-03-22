import mongoose from 'mongoose';

const habitSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Habit title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  frequency: {
    type: String,
    enum: ['daily', 'weekly'],
    default: 'daily'
  },
  streak: {
    type: Number,
    default: 0,
    min: 0
  },
  maxStreak: {
    type: Number,
    default: 0,
    min: 0
  },
  notes: {
    type: String,
    default: '',
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  completedDates: [{
    type: Date
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  color: {
    type: String,
    default: '#6366f1'
  },
  icon: {
    type: String,
    default: 'target'
  }
});

// Calculate streak based on completed dates
habitSchema.methods.calculateStreak = function() {
  if (this.completedDates.length === 0) return 0;
  
  const sortedDates = this.completedDates
    .map(d => new Date(d).toDateString())
    .sort((a, b) => new Date(b) - new Date(a));
  
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  for (let i = 0; i < sortedDates.length; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);
    
    if (sortedDates.includes(checkDate.toDateString())) {
      streak++;
    } else {
      break;
    }
  }
  
  // Update max streak if current streak is higher
  if (streak > this.maxStreak) {
    this.maxStreak = streak;
  }
  
  return streak;
};

const Habit = mongoose.model('Habit', habitSchema);

export default Habit;
