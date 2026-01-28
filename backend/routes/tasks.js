const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth'); // Importamos el protector

// 1. OBTENER todas las tareas del usuario logueado (READ)
router.get('/', auth, async (req, res) => {
    const tasks = await Task.find({ user: req.user.id });
    res.json(tasks);
});

// 2. CREAR una nueva tarea (CREATE)
router.post('/', auth, async (req, res) => {
    const { title, description } = req.body;
    const newTask = new Task({ title, description, user: req.user.id });
    await newTask.save();
    res.json(newTask);
});

// 3. ACTUALIZAR una tarea (UPDATE Seguro)
router.put('/:id', auth, async (req, res) => {
    try {
        // Buscamos la tarea por ID y verificamos que pertenezca al usuario logueado
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id }, 
            req.body, 
            { new: true }
        );
        
        if (!task) return res.status(404).json({ msg: "Tarea no encontrada o no autorizada" });
        res.json(task);
    } catch (err) {
        res.status(500).send("Error al actualizar");
    }
});

// 4. ELIMINAR una tarea (DELETE)
router.delete('/:id', auth, async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ msg: "Tarea eliminada" });
});

module.exports = router;