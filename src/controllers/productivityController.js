const Task = require('../models/Task');
const Note = require('../models/Note');
const { sequelize } = require('../config/database');

const ensureUserExists = async (userId) => {
  const [results] = await sequelize.query(`SELECT id FROM "Users" WHERE id = '${userId}'`);
  if (results.length === 0) {
    await sequelize.query(`
      INSERT INTO "Users" (id, name, email, password_hash, is_verified, created_at, updated_at)
      VALUES ('${userId}', 'Mobile User', '${userId}@mobile.sync', 'placeholder', true, NOW(), NOW())
    `);
  }
};

// --- TASK CONTROLLERS ---
exports.createTask = async (req, res) => {
  try {
    await ensureUserExists(req.user.id);
    const task = await Task.create({ ...req.body, user_id: req.user.id });
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll({ where: { user_id: req.user.id }, order: [['created_at', 'DESC']] });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    await Task.update(req.body, { where: { id: req.params.id, user_id: req.user.id } });
    res.json({ status: 'SUCCESS' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    await Task.destroy({ where: { id: req.params.id, user_id: req.user.id } });
    res.json({ status: 'SUCCESS' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// --- NOTE CONTROLLERS ---
exports.createNote = async (req, res) => {
  try {
    await ensureUserExists(req.user.id);
    const note = await Note.create({ ...req.body, user_id: req.user.id });
    res.status(201).json(note);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.findAll({ where: { user_id: req.user.id }, order: [['updated_at', 'DESC']] });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateNote = async (req, res) => {
  try {
    await Note.update(req.body, { where: { id: req.params.id, user_id: req.user.id } });
    res.json({ status: 'SUCCESS' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    await Note.destroy({ where: { id: req.params.id, user_id: req.user.id } });
    res.json({ status: 'SUCCESS' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
