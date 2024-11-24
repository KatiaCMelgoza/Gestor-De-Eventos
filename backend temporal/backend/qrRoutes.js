const express = require('express');
const QRCode = require('qrcode');
const jwt = require('jsonwebtoken');
const { Resend } = require('resend');
const mysql = require('mysql2');
const router = express.Router();

const SECRET_KEY = process.env.SECRET_KEY || 'tu_clave_secreta';

// Inicializa el cliente Resend con tu clave API
const resend = new Resend(process.env.RESEND_API_KEY);

// Configura la conexión a la base de datos
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'SistemaEventos',
  port: 8889,
});

// Verifica la conexión a la base de datos
connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err.message);
  } else {
    console.log('Conexión exitosa a la base de datos');
  }
});

router.get('/api/qr/asistencia', async (req, res) => {
    const { token } = req.query;
  
    if (!token) {
      return res.status(400).json({ error: 'Token no proporcionado' });
    }
  
    try {
      // Decodificar el token
      const data = jwt.verify(token, SECRET_KEY);
      const { usuario_id, evento_id } = data;
  
      // Verificar si ya existe un registro
      const checkQuery = `SELECT COUNT(*) AS count FROM asistencias WHERE usuario_id = ? AND evento_id = ?`;
      const [rows] = await connection.promise().query(checkQuery, [usuario_id, evento_id]);
      if (rows[0].count > 0) {
        return res.status(409).json({ message: 'Asistencia ya registrada' });
      }
  
      // Registrar asistencia
      const insertQuery = `
        INSERT INTO asistencias (usuario_id, evento_id, fecha_entrada, asistencia_confirmada)
        VALUES (?, ?, NOW(), 1)`;
      await connection.promise().query(insertQuery, [usuario_id, evento_id]);
  
      res.status(200).json({ message: 'Asistencia registrada con éxito' });
    } catch (error) {
      console.error('Error al validar token:', error.message);
      res.status(401).json({ error: 'Token inválido o expirado' });
    }
  });

module.exports = router;
