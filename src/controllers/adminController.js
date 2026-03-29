const { User, Subscription, FitnessProfile, Task, Note, Expense } = require('../models');
const { Op } = require('sequelize');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const activeSubscriptions = await Subscription.count({ where: { status: 'active' } });
    const expiredSubscriptions = await Subscription.count({ where: { status: 'expired' } });
    const freeTrialUsers = await Subscription.count({ where: { plan_type: 'free', status: 'active' } });

    res.json({
      totalUsers,
      activeSubscriptions,
      expiredSubscriptions,
      freeTrialUsers
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { search, planType, status, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const userWhere = {};
    if (search) {
      userWhere[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const subWhere = {};
    if (planType) subWhere.plan_type = planType;
    if (status) subWhere.status = status;

    const { count, rows: users } = await User.findAndCountAll({
      where: userWhere,
      attributes: { exclude: ['password_hash'] },
      include: [{
        model: Subscription,
        where: Object.keys(subWhere).length > 0 ? subWhere : undefined,
        required: Object.keys(subWhere).length > 0
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    res.json({
      total: count,
      pages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      users
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password_hash'] },
      include: [Subscription]
    });
    
    if (!user) return res.status(404).json({ error: 'User not found' });

    const fitness = await FitnessProfile.findOne({ where: { user_id: id } });
    const tasks = await Task.findAll({ where: { user_id: id } });
    const notes = await Note.findAll({ where: { user_id: id } });
    const expenses = await Expense.findAll({ where: { user_id: id } });

    res.json({
      profile: user,
      subscription: user.Subscription,
      fitness,
      tasks,
      notes,
      expenses
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateSubscription = async (req, res) => {
  try {
    const { id } = req.params; // user_id
    const { plan_type, end_date, status } = req.body;

    let subscription = await Subscription.findOne({ where: { user_id: id } });
    
    if (!subscription) {
      subscription = await Subscription.create({
        user_id: id,
        plan_type: plan_type || 'free',
        start_date: new Date(),
        end_date: end_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: status || 'active'
      });
    } else {
      await subscription.update({
        plan_type: plan_type !== undefined ? plan_type : subscription.plan_type,
        end_date: end_date !== undefined ? end_date : subscription.end_date,
        status: status !== undefined ? status : subscription.status
      });
    }

    res.json({ message: 'Subscription updated successfully', subscription });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.toggleUserAccess = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await user.update({ is_active });
    res.json({ message: `User access ${is_active ? 'restored' : 'removed'}.`, is_active });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
