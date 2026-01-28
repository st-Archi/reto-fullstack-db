require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middlewares iniciales
app.use(cors());
app.use(express.json());

console.log("Conectando a:", process.env.MONGO_URI);

// Conexión a Base de Datos
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Conectado"))
    .catch(err => console.log("❌ Error DB:", err));

// --- AQUÍ CONECTAMOS LAS RUTAS ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks')); 

// Middleware de manejo de errores (El "atrapa-todo")
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Algo salió mal en el servidor' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor en puerto ${PORT}`));

const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);