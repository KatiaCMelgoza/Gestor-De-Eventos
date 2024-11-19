const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const connection = require('../index').connection; // Importa la conexión de la base de datos
const SECRET_KEY = process.env.SECRET_KEY;

// Controlador de registro de usuario
exports.register = async (req, res) => {
  const { nombre, apellido, telefono, correo_electronico, password, rol } = req.body;

  if (isNaN(telefono)) {
    return res.status(400).json({ error: 'El teléfono debe ser un número válido' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const query = 'INSERT INTO usuarios (nombre, apellido, telefono, correo_electronico, password, rol) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [nombre, apellido, Number(telefono), correo_electronico, hashedPassword, rol];

  connection.query(query, values, (err, result) => {
    if (err) {
      console.error('Error al registrar el usuario:', err);
      return res.status(500).json({ error: 'Error al registrar el usuario en la base de datos' });
    } else {
      return res.status(201).json({ message: 'Usuario registrado con éxito', userId: result.insertId });
    }
  });
};

// Controlador de inicio de sesión
exports.login = (req, res) => {
  const { correo_electronico, password } = req.body;

  const query = 'SELECT * FROM usuarios WHERE correo_electronico = ?';
  connection.query(query, [correo_electronico], async (err, results) => {
    if (err) {
      console.error('Error al buscar el usuario:', err);
      return res.status(500).json({ error: 'Error al buscar el usuario en la base de datos' });
    }

    if (results.length > 0) {
      const user = results[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        const token = jwt.sign(
          { userId: user.id_usuario, correo_electronico: user.correo_electronico },
          SECRET_KEY,
          { expiresIn: '1h' }
        );
        return res.json({ message: 'Inicio de sesión exitoso', token });
      } else {
        return res.status(401).json({ error: 'Contraseña incorrecta' });
      }
    } else {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
  });
};
