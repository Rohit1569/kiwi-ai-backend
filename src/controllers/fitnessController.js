const FitnessProfile = require('../models/FitnessProfile');
const { sequelize } = require('../config/database');

const ensureUserExists = async (userId) => {
  const [results] = await sequelize.query(`SELECT id FROM "Users" WHERE id = '${userId}'`);
  if (results.length === 0) {
    await sequelize.query(`
      INSERT INTO "Users" (id, name, email, password_hash, is_verified, created_at, updated_at)
      VALUES ('${userId}', 'Fitness User', '${userId}@fitness.sync', 'placeholder', true, NOW(), NOW())
    `);
  }
};

exports.createOrUpdateProfile = async (req, res) => {
  try {
    await ensureUserExists(req.user.id);
    const [profile, created] = await FitnessProfile.upsert({
      ...req.body,
      user_id: req.user.id
    });
    res.status(created ? 201 : 200).json(profile);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const profile = await FitnessProfile.findOne({ where: { user_id: req.user.id } });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteProfile = async (req, res) => {
  try {
    await FitnessProfile.destroy({ where: { user_id: req.user.id } });
    res.json({ message: 'Profile deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
