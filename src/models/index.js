const User = require('./User');
const Expense = require('./Expense');
const Income = require('./Income');
const Budget = require('./Budget');
const SavingsGoal = require('./SavingsGoal');
const UsageStats = require('./UsageStats');
const Task = require('./Task');
const Note = require('./Note');
const FitnessProfile = require('./FitnessProfile');
const Subscription = require('./Subscription');

// EXPERT ASSOCIATIONS - Establishing the "Owned By" link
User.hasMany(Expense, { foreignKey: 'user_id' });
Expense.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Income, { foreignKey: 'user_id' });
Income.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Budget, { foreignKey: 'user_id' });
Budget.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(SavingsGoal, { foreignKey: 'user_id' });
SavingsGoal.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Task, { foreignKey: 'user_id' });
Task.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Note, { foreignKey: 'user_id' });
Note.belongsTo(User, { foreignKey: 'user_id' });

User.hasOne(FitnessProfile, { foreignKey: 'user_id' });
FitnessProfile.belongsTo(User, { foreignKey: 'user_id' });

User.hasOne(UsageStats, { foreignKey: 'user_id' });
UsageStats.belongsTo(User, { foreignKey: 'user_id' });

User.hasOne(Subscription, { foreignKey: 'user_id' });
Subscription.belongsTo(User, { foreignKey: 'user_id' });

module.exports = {
  User,
  Expense,
  Income,
  Budget,
  SavingsGoal,
  UsageStats,
  Task,
  Note,
  FitnessProfile,
  Subscription
};
