// backend/middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
    console.error("🔥 Error detectado:", err.stack);

    const status = err.statusCode || 500;
    const message = err.message || "Error interno del servidor";

    res.status(status).json({
        success: false,
        status,
        message,
        // Solo mostramos el detalle técnico si no estamos en producción
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
};

module.exports = errorHandler;