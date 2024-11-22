const express = require('express');
const QRCode = require('qrcode');
const jwt = require('jsonwebtoken');
const { Resend } = require('resend'); // Importamos Resend
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

// Endpoint para generar y enviar QR al correo
router.post('/registrar', async (req, res) => {
  const { nombre, correo, evento_id, usuario_id } = req.body;

  // Validación de los campos obligatorios
  if (!nombre || !correo || !evento_id || !usuario_id) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    // Crear token único para el QR
    const data = { usuario_id, evento_id, timestamp: Date.now() };
    const token = jwt.sign(data, SECRET_KEY, { expiresIn: '1h' }); // Expira en 1 hora

    // Generar código QR
    const qrCode = await QRCode.toDataURL(token);

    // Configurar y enviar el correo con Resend
    const emailResponse = await resend.emails.send({
      from: 'e_mannage <onboarding@resend.dev>', 
      to: correo,
      subject: `Código QR para el evento #${evento_id}`,
      html: `<h1>¡Gracias por registrarte, ${nombre}!</h1>
             <p>Escanea este código QR al llegar al evento:</p>
             <img src="${qrCode}" alt="Código QR">`,
    });

    console.log('Correo enviado exitosamente:', emailResponse);

    // Guardar token en la base de datos (tabla QR_Codes)
    const query = `
      INSERT INTO QR_Codes (usuario_id, evento_id, codigo_qr) 
      VALUES (?, ?, ?)`;

    connection.query(query, [usuario_id, evento_id, token], (dbErr) => {
      if (dbErr) {
        console.error('Error al guardar el QR en la base de datos:', dbErr.message);
        return res.status(500).json({ error: 'Error al guardar el QR en la base de datos' });
      }

      res.status(201).json({ message: 'Registro exitoso. QR enviado al correo.' });
    });
  } catch (error) {
    console.error('Error general:', error.message);
    res.status(500).json({ error: 'Error interno al procesar el registro' });
  }
});

// Endpoint para validar el QR
router.post('/validar', (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'El token es obligatorio' });
  }

  try {
    const data = jwt.verify(token, SECRET_KEY); // Verifica el token
    res.status(200).json({ message: 'QR válido', data });
  } catch (error) {
    console.error('Error al validar QR:', error.message);
    res.status(401).json({ error: 'QR inválido o expirado' });
  }
});

//Asistencia's endpoint:::::::::::::::::::::::::::::::::::::::::::::::::::
router.post('/asistencia', (req, res) => {
    const { token } = req.body;
  
    if (!token) {
      return res.status(400).json({ error: 'El token es obligatorio.' });
    }
  
    try {
      const data = jwt.verify(token, SECRET_KEY);
      const { usuario_id, evento_id } = data;
      const fechaEntrada = new Date();
  
      const query = `
        INSERT INTO asistencias (usuario_id, evento_id, fecha_entrada, asistencia_confirmada)
        VALUES (?, ?, ?, ?)`;
  
      connection.query(query, [usuario_id, evento_id, fechaEntrada, 1], (err, result) => {
        if (err) {
          console.error('Error al registrar asistencia:', err.message);
          return res.status(500).json({ error: 'Error al registrar asistencia en la base de datos.' });
        }
        res.status(201).json({ message: 'Asistencia registrada exitosamente.', asistenciaId: result.insertId });
      });
    } catch (error) {
      console.error('Error al procesar el token:', error.message);
      res.status(401).json({ error: 'Token inválido o expirado.' });
    }
  });
  

module.exports = router;
