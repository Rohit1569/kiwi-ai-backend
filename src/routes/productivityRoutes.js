const express = require('express');
const router = express.Router();
const productivityController = require('../controllers/productivityController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// --- TASK ROUTES ---
router.post('/tasks', productivityController.createTask);
router.get('/tasks', productivityController.getTasks);
router.put('/tasks/:id', productivityController.updateTask);
router.delete('/tasks/:id', productivityController.deleteTask);

// --- NOTE ROUTES ---
router.post('/notes', productivityController.createNote);
router.get('/notes', productivityController.getNotes);
router.put('/notes/:id', productivityController.updateNote);
router.delete('/notes/:id', productivityController.deleteNote);

module.exports = router;
