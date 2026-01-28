const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.json({ msg: "Usuario creado" });
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ msg: "Credenciales inválidas" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token });
});

// RUTA DE REGISTRO
router.post('/register', async (req, res, next) => {
    try {
        const { username, password } = req.body;

        // Verificar si el usuario ya existe
        let user = await User.findOne({ username });
        if (user) return res.status(400).json({ msg: "El usuario ya existe" });

        // Encriptar contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Guardar
        user = new User({ username, password: hashedPassword });
        await user.save();

        res.status(201).json({ msg: "Usuario creado exitosamente" });
    } catch (err) {
        next(err); // Esto envía el error al errorHandler.js
    }
});

module.exports = router;